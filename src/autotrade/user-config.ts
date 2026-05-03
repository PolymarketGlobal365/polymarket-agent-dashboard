import path from "node:path";

import { DEFAULT_OUTPUT_ROOT } from "../config.js";
import { readJsonIfExists, writeJson } from "../lib/fs.js";

export const DEFAULT_AUTOTRADE_USER_CONFIG_PATH = path.join(
  DEFAULT_OUTPUT_ROOT,
  "autotrade-user-configs.json",
);

export type UserProgramMode = "ACTIVE" | "PAUSED" | "STOPPED";
export type UserTradingSide = "YES" | "NO" | "BOTH";

export type UserTradingConfig = {
  userId: string;
  telegramUserId: string;
  username?: string;
  displayName?: string;
  mode: UserProgramMode;
  connection: {
    walletAddress?: string;
    proxyWalletAddress?: string;
    apiCredentialRef?: string;
    connectionStatus: "CONNECTED" | "PENDING" | "DISCONNECTED";
  };
  budget: {
    maxDailyBudgetUsd: number;
    maxOpenPositions: number;
    maxOrderSizeUsd: number;
    maxDailyLossUsd: number;
  };
  marketPreferences: {
    categories: string[];
    tags: string[];
    tradingSide: UserTradingSide;
    minRewardRate: number;
    minLiquidityUsd: number;
    maxSignalsPerRun: number;
    followWallets: string[];
  };
  execution: {
    cadenceMinutes: number;
    repriceEnabled: boolean;
    cancelStaleOrdersMinutes: number;
    dryRunOnly: boolean;
  };
  notifications: {
    topicId?: number;
    sendDailySummary: boolean;
    sendFillAlerts: boolean;
    sendRiskAlerts: boolean;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserTradingConfigInput = {
  userId?: string;
  telegramUserId: string;
  username?: string;
  displayName?: string;
  mode?: UserProgramMode;
  connection?: Partial<UserTradingConfig["connection"]>;
  budget?: Partial<UserTradingConfig["budget"]>;
  marketPreferences?: Partial<UserTradingConfig["marketPreferences"]>;
  execution?: Partial<UserTradingConfig["execution"]>;
  notifications?: Partial<UserTradingConfig["notifications"]>;
  notes?: string;
};

type UserTradingConfigFile = {
  version: 1;
  updatedAt: string;
  users: UserTradingConfig[];
};

export async function listUserTradingConfigs(
  filePath = DEFAULT_AUTOTRADE_USER_CONFIG_PATH,
): Promise<UserTradingConfig[]> {
  const file = await readConfigFile(filePath);
  return sortConfigs(file.users);
}

export async function getUserTradingConfigByUserId(
  userId: string,
  filePath = DEFAULT_AUTOTRADE_USER_CONFIG_PATH,
): Promise<UserTradingConfig | undefined> {
  const file = await readConfigFile(filePath);
  return file.users.find((user) => user.userId === userId);
}

export async function getUserTradingConfigByTelegramUserId(
  telegramUserId: string,
  filePath = DEFAULT_AUTOTRADE_USER_CONFIG_PATH,
): Promise<UserTradingConfig | undefined> {
  const file = await readConfigFile(filePath);
  return file.users.find((user) => user.telegramUserId === telegramUserId);
}

export async function upsertUserTradingConfig(
  input: UserTradingConfigInput,
  filePath = DEFAULT_AUTOTRADE_USER_CONFIG_PATH,
): Promise<UserTradingConfig> {
  const file = await readConfigFile(filePath);
  const existing = findExistingConfig(file.users, input);
  const normalized = normalizeUserTradingConfig(input, existing);
  const nextUsers = existing
    ? file.users.map((user) => (user.userId === existing.userId ? normalized : user))
    : [...file.users, normalized];

  await writeJson(filePath, {
    version: 1,
    updatedAt: new Date().toISOString(),
    users: sortConfigs(nextUsers),
  } satisfies UserTradingConfigFile);

  return normalized;
}

export async function setUserTradingMode(
  userId: string,
  mode: UserProgramMode,
  filePath = DEFAULT_AUTOTRADE_USER_CONFIG_PATH,
): Promise<UserTradingConfig> {
  const existing = await getUserTradingConfigByUserId(userId, filePath);
  if (!existing) {
    throw new Error(`User trading config not found for ${userId}.`);
  }

  return upsertUserTradingConfig(
    {
      userId: existing.userId,
      telegramUserId: existing.telegramUserId,
      mode,
    },
    filePath,
  );
}

export function normalizeUserTradingConfig(
  input: UserTradingConfigInput,
  existing?: UserTradingConfig,
): UserTradingConfig {
  const now = new Date().toISOString();
  const createdAt = existing?.createdAt ?? now;
  const userId = normalizeRequiredString(input.userId ?? existing?.userId ?? input.telegramUserId, "userId");
  const telegramUserId = normalizeRequiredString(input.telegramUserId ?? existing?.telegramUserId, "telegramUserId");
  const username = normalizeOptionalString(input.username ?? existing?.username);
  const displayName = normalizeOptionalString(input.displayName ?? existing?.displayName);
  const notes = normalizeOptionalString(input.notes ?? existing?.notes);

  const mode = input.mode ?? existing?.mode ?? "PAUSED";
  const walletAddress = normalizeOptionalString(input.connection?.walletAddress ?? existing?.connection.walletAddress);
  const proxyWalletAddress = normalizeOptionalString(
    input.connection?.proxyWalletAddress ?? existing?.connection.proxyWalletAddress,
  );
  const apiCredentialRef = normalizeOptionalString(
    input.connection?.apiCredentialRef ?? existing?.connection.apiCredentialRef,
  );
  const connection: UserTradingConfig["connection"] = {
    connectionStatus:
      input.connection?.connectionStatus
      ?? existing?.connection.connectionStatus
      ?? "PENDING",
    ...(walletAddress ? { walletAddress } : {}),
    ...(proxyWalletAddress ? { proxyWalletAddress } : {}),
    ...(apiCredentialRef ? { apiCredentialRef } : {}),
  };

  const budget = {
    maxDailyBudgetUsd: normalizePositiveNumber(
      input.budget?.maxDailyBudgetUsd ?? existing?.budget.maxDailyBudgetUsd ?? 100,
      "budget.maxDailyBudgetUsd",
    ),
    maxOpenPositions: normalizePositiveInteger(
      input.budget?.maxOpenPositions ?? existing?.budget.maxOpenPositions ?? 3,
      "budget.maxOpenPositions",
    ),
    maxOrderSizeUsd: normalizePositiveNumber(
      input.budget?.maxOrderSizeUsd ?? existing?.budget.maxOrderSizeUsd ?? 25,
      "budget.maxOrderSizeUsd",
    ),
    maxDailyLossUsd: normalizePositiveNumber(
      input.budget?.maxDailyLossUsd ?? existing?.budget.maxDailyLossUsd ?? 30,
      "budget.maxDailyLossUsd",
    ),
  } satisfies UserTradingConfig["budget"];

  const marketPreferences = {
    categories: normalizeStringArray(
      input.marketPreferences?.categories ?? existing?.marketPreferences.categories ?? [],
    ),
    tags: normalizeStringArray(input.marketPreferences?.tags ?? existing?.marketPreferences.tags ?? []),
    tradingSide: input.marketPreferences?.tradingSide ?? existing?.marketPreferences.tradingSide ?? "BOTH",
    minRewardRate: normalizeNonNegativeNumber(
      input.marketPreferences?.minRewardRate ?? existing?.marketPreferences.minRewardRate ?? 1,
      "marketPreferences.minRewardRate",
    ),
    minLiquidityUsd: normalizeNonNegativeNumber(
      input.marketPreferences?.minLiquidityUsd ?? existing?.marketPreferences.minLiquidityUsd ?? 1_000,
      "marketPreferences.minLiquidityUsd",
    ),
    maxSignalsPerRun: normalizePositiveInteger(
      input.marketPreferences?.maxSignalsPerRun ?? existing?.marketPreferences.maxSignalsPerRun ?? 5,
      "marketPreferences.maxSignalsPerRun",
    ),
    followWallets: normalizeStringArray(
      input.marketPreferences?.followWallets ?? existing?.marketPreferences.followWallets ?? [],
    ),
  } satisfies UserTradingConfig["marketPreferences"];

  const execution = {
    cadenceMinutes: normalizePositiveInteger(
      input.execution?.cadenceMinutes ?? existing?.execution.cadenceMinutes ?? 5,
      "execution.cadenceMinutes",
    ),
    repriceEnabled: input.execution?.repriceEnabled ?? existing?.execution.repriceEnabled ?? true,
    cancelStaleOrdersMinutes: normalizePositiveInteger(
      input.execution?.cancelStaleOrdersMinutes ?? existing?.execution.cancelStaleOrdersMinutes ?? 30,
      "execution.cancelStaleOrdersMinutes",
    ),
    dryRunOnly: input.execution?.dryRunOnly ?? existing?.execution.dryRunOnly ?? true,
  } satisfies UserTradingConfig["execution"];

  const topicId = normalizeOptionalInteger(input.notifications?.topicId ?? existing?.notifications.topicId);
  const notifications: UserTradingConfig["notifications"] = {
    sendDailySummary: input.notifications?.sendDailySummary ?? existing?.notifications.sendDailySummary ?? true,
    sendFillAlerts: input.notifications?.sendFillAlerts ?? existing?.notifications.sendFillAlerts ?? true,
    sendRiskAlerts: input.notifications?.sendRiskAlerts ?? existing?.notifications.sendRiskAlerts ?? true,
    ...(topicId !== undefined ? { topicId } : {}),
  };

  if (budget.maxOrderSizeUsd > budget.maxDailyBudgetUsd) {
    throw new Error("budget.maxOrderSizeUsd cannot exceed budget.maxDailyBudgetUsd.");
  }

  return {
    userId,
    telegramUserId,
    ...(username ? { username } : {}),
    ...(displayName ? { displayName } : {}),
    mode,
    connection,
    budget,
    marketPreferences,
    execution,
    notifications,
    ...(notes ? { notes } : {}),
    createdAt,
    updatedAt: now,
  };
}

async function readConfigFile(filePath: string): Promise<UserTradingConfigFile> {
  const existing = await readJsonIfExists<UserTradingConfigFile>(filePath);
  if (!existing) {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      users: [],
    };
  }

  return {
    version: 1,
    updatedAt: existing.updatedAt,
    users: sortConfigs(existing.users ?? []),
  };
}

function findExistingConfig(
  users: UserTradingConfig[],
  input: UserTradingConfigInput,
): UserTradingConfig | undefined {
  if (input.userId) {
    const byUserId = users.find((user) => user.userId === input.userId);
    if (byUserId) {
      return byUserId;
    }
  }

  return users.find((user) => user.telegramUserId === input.telegramUserId);
}

function sortConfigs(users: UserTradingConfig[]): UserTradingConfig[] {
  return [...users].sort((left, right) => left.userId.localeCompare(right.userId));
}

function normalizeRequiredString(value: string | undefined, label: string): string {
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    throw new Error(`${label} is required.`);
  }

  return normalized;
}

function normalizeOptionalString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeStringArray(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function normalizePositiveInteger(value: number, label: string): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }

  return value;
}

function normalizePositiveNumber(value: number, label: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive number.`);
  }

  return value;
}

function normalizeNonNegativeNumber(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be zero or greater.`);
  }

  return value;
}

function normalizeOptionalInteger(value: number | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("notifications.topicId must be a positive integer.");
  }

  return value;
}
