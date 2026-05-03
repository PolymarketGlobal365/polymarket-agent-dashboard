import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  getCredentialSummary,
  getPolymarketCredentials,
  upsertPolymarketCredentials,
} from "./credential-vault.js";

test("credential vault encrypts and restores sensitive secrets", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pm-credential-vault-"));
  const filePath = path.join(tempDir, "vault.json");
  const masterKey = "test-master-key";

  const stored = await upsertPolymarketCredentials(
    "user-1",
    {
      method: "WALLET_AND_API",
      publicAddress: "0x123",
      funderAddress: "0x456",
      signatureType: 2,
      apiKey: "api-key",
      apiSecret: "api-secret",
      apiPassphrase: "api-passphrase",
      privateKey: "0xprivate",
      builderCode: "0xbuilder",
    },
    filePath,
    masterKey,
  );

  assert.equal(stored.apiKey, "api-key");
  assert.ok(stored.encryptedApiSecret);
  assert.ok(stored.encryptedPrivateKey);

  const restored = await getPolymarketCredentials("user-1", filePath, masterKey);
  assert.equal(restored?.apiSecret, "api-secret");
  assert.equal(restored?.privateKey, "0xprivate");

  const summary = await getCredentialSummary("user-1", filePath);
  assert.equal(summary?.method, "WALLET_AND_API");
});
