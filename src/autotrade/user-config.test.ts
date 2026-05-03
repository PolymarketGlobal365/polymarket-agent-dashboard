import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  getUserTradingConfigByTelegramUserId,
  listUserTradingConfigs,
  normalizeUserTradingConfig,
  setUserTradingMode,
  upsertUserTradingConfig,
} from "./user-config.js";

test("normalizeUserTradingConfig applies defaults for a new user", () => {
  const config = normalizeUserTradingConfig({
    telegramUserId: "10001",
    username: "alpha_user",
  });

  assert.equal(config.userId, "10001");
  assert.equal(config.mode, "PAUSED");
  assert.equal(config.connection.connectionStatus, "PENDING");
  assert.equal(config.budget.maxDailyBudgetUsd, 100);
  assert.equal(config.execution.cadenceMinutes, 5);
  assert.equal(config.execution.dryRunOnly, true);
  assert.equal(config.marketPreferences.tradingSide, "BOTH");
});

test("normalizeUserTradingConfig preserves existing createdAt and merges updates", () => {
  const existing = normalizeUserTradingConfig({
    telegramUserId: "10001",
    username: "alpha_user",
  });

  const updated = normalizeUserTradingConfig(
    {
      telegramUserId: "10001",
      budget: {
        maxDailyBudgetUsd: 300,
      },
      execution: {
        dryRunOnly: false,
      },
    },
    existing,
  );

  assert.equal(updated.createdAt, existing.createdAt);
  assert.equal(updated.budget.maxDailyBudgetUsd, 300);
  assert.equal(updated.execution.dryRunOnly, false);
  assert.equal(updated.marketPreferences.maxSignalsPerRun, existing.marketPreferences.maxSignalsPerRun);
});

test("upsertUserTradingConfig stores and updates file-backed user configs", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pm-autotrade-config-"));
  const filePath = path.join(tempDir, "user-configs.json");

  const created = await upsertUserTradingConfig(
    {
      telegramUserId: "20001",
      username: "beta_user",
      displayName: "Beta User",
      connection: {
        walletAddress: "0xabc",
        connectionStatus: "CONNECTED",
      },
      budget: {
        maxDailyBudgetUsd: 500,
        maxOrderSizeUsd: 50,
        maxDailyLossUsd: 40,
        maxOpenPositions: 4,
      },
      marketPreferences: {
        categories: ["politics", "crypto"],
        followWallets: ["debased", "SecondWindCapital"],
      },
      notifications: {
        topicId: 321,
      },
    },
    filePath,
  );

  assert.equal(created.displayName, "Beta User");
  assert.equal(created.connection.connectionStatus, "CONNECTED");
  assert.deepEqual(created.marketPreferences.categories, ["politics", "crypto"]);

  const fetched = await getUserTradingConfigByTelegramUserId("20001", filePath);
  assert.equal(fetched?.notifications.topicId, 321);

  const updated = await upsertUserTradingConfig(
    {
      telegramUserId: "20001",
      mode: "ACTIVE",
      budget: {
        maxDailyBudgetUsd: 650,
      },
    },
    filePath,
  );

  assert.equal(updated.mode, "ACTIVE");
  assert.equal(updated.budget.maxDailyBudgetUsd, 650);
  assert.equal(updated.displayName, "Beta User");

  const list = await listUserTradingConfigs(filePath);
  assert.equal(list.length, 1);
});

test("setUserTradingMode toggles a stored user mode", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pm-autotrade-mode-"));
  const filePath = path.join(tempDir, "user-configs.json");

  const created = await upsertUserTradingConfig(
    {
      telegramUserId: "30001",
      username: "gamma_user",
    },
    filePath,
  );

  const updated = await setUserTradingMode(created.userId, "ACTIVE", filePath);
  assert.equal(updated.mode, "ACTIVE");
});

test("normalizeUserTradingConfig rejects impossible budgets", () => {
  assert.throws(
    () =>
      normalizeUserTradingConfig({
        telegramUserId: "40001",
        budget: {
          maxDailyBudgetUsd: 50,
          maxOrderSizeUsd: 60,
        },
      }),
    /cannot exceed/,
  );
});
