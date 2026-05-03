import crypto from "node:crypto";
import path from "node:path";

import { DEFAULT_OUTPUT_ROOT } from "../config.js";
import { readJsonIfExists, writeJson } from "../lib/fs.js";

export const DEFAULT_AUTOTRADE_CREDENTIAL_VAULT_PATH = path.join(
  DEFAULT_OUTPUT_ROOT,
  "autotrade-credential-vault.json",
);

export type ConnectionMethod = "NONE" | "DRY_RUN" | "API_ONLY" | "WALLET_AND_API";

export type EncryptedPolymarketCredentials = {
  userId: string;
  method: ConnectionMethod;
  publicAddress?: string;
  funderAddress?: string;
  signatureType?: 0 | 1 | 2 | 3;
  apiKey?: string;
  apiPassphrase?: string;
  encryptedApiSecret?: string;
  encryptedPrivateKey?: string;
  builderCode?: string;
  createdAt: string;
  updatedAt: string;
};

type CredentialVaultFile = {
  version: 1;
  updatedAt: string;
  users: EncryptedPolymarketCredentials[];
};

export type LiveTradingCredentials = {
  method: ConnectionMethod;
  publicAddress?: string;
  funderAddress?: string;
  signatureType?: 0 | 1 | 2 | 3;
  apiKey?: string;
  apiSecret?: string;
  apiPassphrase?: string;
  privateKey?: string;
  builderCode?: string;
};

export async function upsertPolymarketCredentials(
  userId: string,
  credentials: LiveTradingCredentials,
  filePath = DEFAULT_AUTOTRADE_CREDENTIAL_VAULT_PATH,
  masterKey = process.env.AUTOTRADE_MASTER_KEY,
): Promise<EncryptedPolymarketCredentials> {
  if (!masterKey) {
    throw new Error("Missing AUTOTRADE_MASTER_KEY.");
  }

  const file = await readVaultFile(filePath);
  const existing = file.users.find((entry) => entry.userId === userId);
  const now = new Date().toISOString();

  const next: EncryptedPolymarketCredentials = {
    userId,
    method: credentials.method,
    ...(credentials.publicAddress ? { publicAddress: credentials.publicAddress } : {}),
    ...(credentials.funderAddress ? { funderAddress: credentials.funderAddress } : {}),
    ...(credentials.signatureType !== undefined ? { signatureType: credentials.signatureType } : {}),
    ...(credentials.apiKey ? { apiKey: credentials.apiKey } : {}),
    ...(credentials.apiPassphrase ? { apiPassphrase: credentials.apiPassphrase } : {}),
    ...(credentials.apiSecret ? { encryptedApiSecret: encryptSecret(credentials.apiSecret, masterKey) } : {}),
    ...(credentials.privateKey ? { encryptedPrivateKey: encryptSecret(credentials.privateKey, masterKey) } : {}),
    ...(credentials.builderCode ? { builderCode: credentials.builderCode } : {}),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const users = existing
    ? file.users.map((entry) => (entry.userId === userId ? next : entry))
    : [...file.users, next];

  await writeJson(filePath, {
    version: 1,
    updatedAt: now,
    users: users.sort((left, right) => left.userId.localeCompare(right.userId)),
  } satisfies CredentialVaultFile);

  return next;
}

export async function getPolymarketCredentials(
  userId: string,
  filePath = DEFAULT_AUTOTRADE_CREDENTIAL_VAULT_PATH,
  masterKey = process.env.AUTOTRADE_MASTER_KEY,
): Promise<LiveTradingCredentials | undefined> {
  const file = await readVaultFile(filePath);
  const existing = file.users.find((entry) => entry.userId === userId);
  if (!existing) {
    return undefined;
  }

  const hasEncryptedSecrets = Boolean(existing.encryptedApiSecret || existing.encryptedPrivateKey);
  if (hasEncryptedSecrets && !masterKey) {
    throw new Error("Missing AUTOTRADE_MASTER_KEY.");
  }

  return {
    method: existing.method,
    ...(existing.publicAddress ? { publicAddress: existing.publicAddress } : {}),
    ...(existing.funderAddress ? { funderAddress: existing.funderAddress } : {}),
    ...(existing.signatureType !== undefined ? { signatureType: existing.signatureType } : {}),
    ...(existing.apiKey ? { apiKey: existing.apiKey } : {}),
    ...(existing.apiPassphrase ? { apiPassphrase: existing.apiPassphrase } : {}),
    ...(existing.encryptedApiSecret && masterKey
      ? { apiSecret: decryptSecret(existing.encryptedApiSecret, masterKey) }
      : {}),
    ...(existing.encryptedPrivateKey && masterKey
      ? { privateKey: decryptSecret(existing.encryptedPrivateKey, masterKey) }
      : {}),
    ...(existing.builderCode ? { builderCode: existing.builderCode } : {}),
  };
}

export async function getCredentialSummary(
  userId: string,
  filePath = DEFAULT_AUTOTRADE_CREDENTIAL_VAULT_PATH,
): Promise<EncryptedPolymarketCredentials | undefined> {
  const file = await readVaultFile(filePath);
  return file.users.find((entry) => entry.userId === userId);
}

async function readVaultFile(filePath: string): Promise<CredentialVaultFile> {
  const file = await readJsonIfExists<CredentialVaultFile>(filePath);
  if (!file) {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      users: [],
    };
  }

  return {
    version: 1,
    updatedAt: file.updatedAt,
    users: file.users ?? [],
  };
}

function encryptSecret(value: string, masterKey: string): string {
  const key = deriveKey(masterKey);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

function decryptSecret(payload: string, masterKey: string): string {
  const [ivPart, tagPart, encryptedPart] = payload.split(".");
  if (!ivPart || !tagPart || !encryptedPart) {
    throw new Error("Invalid encrypted payload.");
  }

  const key = deriveKey(masterKey);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivPart, "base64"));
  decipher.setAuthTag(Buffer.from(tagPart, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedPart, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

function deriveKey(masterKey: string): Buffer {
  return crypto.createHash("sha256").update(masterKey, "utf8").digest();
}
