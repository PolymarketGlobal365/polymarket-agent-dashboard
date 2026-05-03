import path from "node:path";

import { DEFAULT_AUTOTRADE_CREDENTIAL_VAULT_PATH, upsertPolymarketCredentials, type ConnectionMethod } from "./autotrade/credential-vault.js";

type ParsedArgs = {
  userId: string;
  method: ConnectionMethod;
  publicAddress?: string;
  funderAddress?: string;
  signatureType?: 0 | 1 | 2 | 3;
  apiKey?: string;
  apiSecret?: string;
  apiPassphrase?: string;
  privateKey?: string;
  builderCode?: string;
  vaultFile: string;
};

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const saved = await upsertPolymarketCredentials(
    args.userId,
    {
      method: args.method,
      ...(args.publicAddress ? { publicAddress: args.publicAddress } : {}),
      ...(args.funderAddress ? { funderAddress: args.funderAddress } : {}),
      ...(args.signatureType !== undefined ? { signatureType: args.signatureType } : {}),
      ...(args.apiKey ? { apiKey: args.apiKey } : {}),
      ...(args.apiSecret ? { apiSecret: args.apiSecret } : {}),
      ...(args.apiPassphrase ? { apiPassphrase: args.apiPassphrase } : {}),
      ...(args.privateKey ? { privateKey: args.privateKey } : {}),
      ...(args.builderCode ? { builderCode: args.builderCode } : {}),
    },
    args.vaultFile,
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        userId: saved.userId,
        method: saved.method,
        publicAddress: saved.publicAddress,
        funderAddress: saved.funderAddress,
        hasApiKey: Boolean(saved.apiKey),
        hasApiSecret: Boolean(saved.encryptedApiSecret),
        hasPrivateKey: Boolean(saved.encryptedPrivateKey),
      },
      null,
      2,
    )}\n`,
  );
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    userId: "",
    method: "NONE",
    vaultFile: DEFAULT_AUTOTRADE_CREDENTIAL_VAULT_PATH,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];
    switch (current) {
      case "--user-id":
        parsed.userId = requireValue(current, next);
        index += 1;
        break;
      case "--method":
        parsed.method = parseMethod(requireValue(current, next));
        index += 1;
        break;
      case "--public-address":
        parsed.publicAddress = requireValue(current, next);
        index += 1;
        break;
      case "--funder-address":
        parsed.funderAddress = requireValue(current, next);
        index += 1;
        break;
      case "--signature-type":
        parsed.signatureType = parseSignatureType(requireValue(current, next));
        index += 1;
        break;
      case "--api-key":
        parsed.apiKey = requireValue(current, next);
        index += 1;
        break;
      case "--api-secret":
        parsed.apiSecret = requireValue(current, next);
        index += 1;
        break;
      case "--api-passphrase":
        parsed.apiPassphrase = requireValue(current, next);
        index += 1;
        break;
      case "--private-key":
        parsed.privateKey = requireValue(current, next);
        index += 1;
        break;
      case "--builder-code":
        parsed.builderCode = requireValue(current, next);
        index += 1;
        break;
      case "--vault-file":
        parsed.vaultFile = path.resolve(requireValue(current, next));
        index += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${current}`);
    }
  }

  if (!parsed.userId) {
    throw new Error("Missing --user-id.");
  }

  return parsed;
}

function requireValue(flag: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${flag} requires a value`);
  }

  return value;
}

function parseMethod(value: string): ConnectionMethod {
  const normalized = value.trim().toUpperCase();
  const allowed: ConnectionMethod[] = ["NONE", "DRY_RUN", "API_ONLY", "WALLET_AND_API"];
  if (!allowed.includes(normalized as ConnectionMethod)) {
    throw new Error(`Unsupported method: ${value}`);
  }

  return normalized as ConnectionMethod;
}

function parseSignatureType(value: string): 0 | 1 | 2 | 3 {
  const parsed = Number.parseInt(value, 10);
  if (parsed !== 0 && parsed !== 1 && parsed !== 2 && parsed !== 3) {
    throw new Error("signatureType must be 0, 1, 2, or 3.");
  }

  return parsed;
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
