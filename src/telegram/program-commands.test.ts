import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { handleProgramCommand } from "./program-commands.js";

test("help command returns the supported command list", async () => {
  const result = await handleProgramCommand("/help", {
    telegramUserId: "10001",
  });

  assert.equal(result.ok, true);
  assert.match(result.message, /Trading Bot \(Program\) commands/);
  assert.match(result.message, /\/startbot/);
});

test("status command guides a new user through setup", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pm-program-cmd-"));
  const result = await handleProgramCommand("/status", {
    telegramUserId: "10002",
    configFile: path.join(tempDir, "users.json"),
  });

  assert.equal(result.ok, true);
  assert.match(result.message, /No trading profile exists yet/);
  assert.match(result.message, /\/connect/);
  assert.match(result.message, /\/setbudget 200/);
});

test("connect command returns referral onboarding instructions", async () => {
  const result = await handleProgramCommand("/connect", {
    telegramUserId: "10011",
  });

  assert.equal(result.ok, true);
  assert.match(result.message, /https:\/\/polymarket\.com\/ko\?r=Musk7/);
  assert.match(result.message, /API credentials alone are not enough/);
});

test("setbudget and startbot update stored user config", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pm-program-cmd-"));
  const filePath = path.join(tempDir, "users.json");

  const budgetResult = await handleProgramCommand("/setbudget 250", {
    telegramUserId: "10003",
    username: "alpha_user",
    topicId: 444,
    configFile: filePath,
  });

  assert.equal(budgetResult.ok, true);
  assert.match(budgetResult.message, /Daily budget updated to \$250/);
  assert.equal(budgetResult.config?.budget.maxDailyBudgetUsd, 250);
  assert.equal(budgetResult.config?.notifications.topicId, 444);

  const startResult = await handleProgramCommand("/startbot", {
    telegramUserId: "10003",
    username: "alpha_user",
    topicId: 444,
    configFile: filePath,
  });

  assert.equal(startResult.ok, true);
  assert.equal(startResult.config?.mode, "ACTIVE");
  assert.match(startResult.message, /Auto-trading is now ACTIVE/);
});

test("followwallet and setcategories produce merged status output", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pm-program-cmd-"));
  const filePath = path.join(tempDir, "users.json");

  await handleProgramCommand("/setcategories politics,crypto", {
    telegramUserId: "10004",
    configFile: filePath,
  });

  const result = await handleProgramCommand("/followwallet secondwindcapital", {
    telegramUserId: "10004",
    configFile: filePath,
  });

  assert.equal(result.ok, true);
  assert.match(result.message, /Added followed wallet: secondwindcapital/);
  assert.match(result.message, /Markets: politics, crypto/);
  assert.match(result.message, /Followed wallets: secondwindcapital/);
});

test("invalid commands return usage guidance", async () => {
  await assert.rejects(
    () =>
      handleProgramCommand("/setside maybe", {
        telegramUserId: "10005",
      }),
    /Usage: \/setside yes\|no\|both/,
  );
});
