import {
  getUserTradingConfigByTelegramUserId,
  type UserProgramMode,
  type UserTradingConfig,
  type UserTradingConfigInput,
  type UserTradingSide,
  upsertUserTradingConfig,
} from "../autotrade/user-config.js";
import { DEFAULT_AUTOTRADE_CREDENTIAL_VAULT_PATH, getCredentialSummary } from "../autotrade/credential-vault.js";
import { validateConnectionMethod } from "../polymarket/execution.js";

export type ProgramCommandContext = {
  telegramUserId: string;
  username?: string;
  displayName?: string;
  topicId?: number;
  configFile?: string;
  vaultFile?: string;
};

export type ProgramCommandResult = {
  ok: boolean;
  command: string;
  message: string;
  config?: UserTradingConfig;
};

type UserConfigPatch = Pick<UserTradingConfigInput, "mode" | "budget" | "marketPreferences" | "execution" | "notifications">;

export async function handleProgramCommand(
  text: string,
  context: ProgramCommandContext,
): Promise<ProgramCommandResult> {
  const trimmed = text.trim();
  if (!trimmed.startsWith("/")) {
    return {
      ok: false,
      command: "unknown",
      message: buildHelpMessage("Please send a supported command."),
    };
  }

  const [rawCommand, ...rawArgs] = trimmed.split(/\s+/);
  const command = normalizeTelegramCommand(rawCommand ?? "");
  const argText = rawArgs.join(" ").trim();

  switch (command) {
    case "start":
    case "help":
      return {
        ok: true,
        command,
        message: buildHelpMessage(),
      };
    case "status":
      return handleStatusCommand(context);
    case "connect":
      return handleConnectCommand(argText, context);
    case "connectstatus":
      return handleConnectStatusCommand(context);
    case "startbot":
      return handleModeCommand("ACTIVE", context, command);
    case "pausebot":
      return handleModeCommand("PAUSED", context, command);
    case "stopbot":
      return handleModeCommand("STOPPED", context, command);
    case "setbudget":
      return handleSetBudgetCommand(argText, context);
    case "setmaxpositions":
      return handleSetMaxPositionsCommand(argText, context);
    case "setordersize":
      return handleSetOrderSizeCommand(argText, context);
    case "setlosscap":
      return handleSetLossCapCommand(argText, context);
    case "setcategories":
      return handleSetCategoriesCommand(argText, context);
    case "settags":
      return handleSetTagsCommand(argText, context);
    case "setside":
      return handleSetSideCommand(argText, context);
    case "followwallet":
      return handleFollowWalletCommand(argText, context);
    case "unfollowwallet":
      return handleUnfollowWalletCommand(argText, context);
    case "setcadence":
      return handleSetCadenceCommand(argText, context);
    case "dryrun":
      return handleDryRunCommand(argText, context);
    default:
      return {
        ok: false,
        command,
        message: buildHelpMessage(`Unknown command: /${command}`),
      };
  }
}

export function isTradingBotProgramCommand(text: string): boolean {
  return text.trim().startsWith("/");
}

async function handleStatusCommand(context: ProgramCommandContext): Promise<ProgramCommandResult> {
  const config = await getUserTradingConfigByTelegramUserId(context.telegramUserId, context.configFile);
  if (!config) {
    return {
      ok: true,
      command: "status",
      message: [
        "No trading profile exists yet.",
        "",
        "Start here:",
        "/connect",
        "/setbudget 200",
        "/setmaxpositions 3",
        "/setcategories politics,crypto",
        "/startbot",
      ].join("\n"),
    };
  }

  return {
    ok: true,
    command: "status",
    config,
    message: await formatStatusMessage(config, context),
  };
}

async function handleConnectCommand(
  argText: string,
  context: ProgramCommandContext,
): Promise<ProgramCommandResult> {
  const mode = argText.trim().toLowerCase();

  if (!mode) {
    return {
      ok: true,
      command: "connect",
      message: buildConnectMessage(),
    };
  }

  if (mode === "dry-run" || mode === "paper") {
    const updated = await applyUserUpdate(context, {
      execution: {
        dryRunOnly: true,
      },
    });

    return {
      ok: true,
      command: "connect",
      config: updated,
      message: [
        "Dry-run mode is enabled for your profile.",
        "",
        "You can now test the bot without posting real orders.",
        "",
        await formatStatusMessage(updated, context),
      ].join("\n"),
    };
  }

  return {
    ok: true,
    command: "connect",
    message: buildConnectMessage("Use `/connect` or `/connect dry-run`."),
  };
}

async function handleConnectStatusCommand(context: ProgramCommandContext): Promise<ProgramCommandResult> {
  const config = await getUserTradingConfigByTelegramUserId(context.telegramUserId, context.configFile);
  const summary = config ? await describeConnection(config.userId, context.vaultFile) : undefined;

  return {
    ok: true,
    command: "connectstatus",
    ...(config ? { config } : {}),
    message: [
      config ? `Profile found for ${config.displayName ?? config.username ?? config.telegramUserId}.` : "No trading profile exists yet.",
      summary ?? "No connection has been linked yet.",
      "",
      buildConnectMessage(),
    ].join("\n\n"),
  };
}

async function handleModeCommand(
  mode: UserProgramMode,
  context: ProgramCommandContext,
  command: string,
): Promise<ProgramCommandResult> {
  const config = await ensureUserConfig(context);
  const updated = await upsertUserTradingConfig({
    userId: config.userId,
    telegramUserId: context.telegramUserId,
    mode,
    ...(context.username ? { username: context.username } : {}),
    ...(context.displayName ? { displayName: context.displayName } : {}),
    notifications: {
      ...(context.topicId !== undefined ? { topicId: context.topicId } : {}),
    },
  }, context.configFile);

  const message =
    mode === "ACTIVE"
      ? "Auto-trading is now ACTIVE."
      : mode === "PAUSED"
        ? "Auto-trading is now PAUSED."
        : "Auto-trading is now STOPPED.";

  return {
    ok: true,
    command,
    config: updated,
    message: `${message}\n\n${await formatStatusMessage(updated, context)}`,
  };
}

async function handleSetBudgetCommand(argText: string, context: ProgramCommandContext): Promise<ProgramCommandResult> {
  const value = parsePositiveNumberArg(argText, "/setbudget");
  const updated = await applyUserUpdate(context, {
    budget: {
      maxDailyBudgetUsd: value,
    },
  });

  return {
    ok: true,
    command: "setbudget",
    config: updated,
    message: `Daily budget updated to $${trimZeros(value.toFixed(2))}.\n\n${await formatStatusMessage(updated, context)}`,
  };
}

async function handleSetMaxPositionsCommand(
  argText: string,
  context: ProgramCommandContext,
): Promise<ProgramCommandResult> {
  const value = parsePositiveIntegerArg(argText, "/setmaxpositions");
  const updated = await applyUserUpdate(context, {
    budget: {
      maxOpenPositions: value,
    },
  });

  return {
    ok: true,
    command: "setmaxpositions",
    config: updated,
    message: `Max open positions updated to ${value}.\n\n${await formatStatusMessage(updated, context)}`,
  };
}

async function handleSetOrderSizeCommand(
  argText: string,
  context: ProgramCommandContext,
): Promise<ProgramCommandResult> {
  const value = parsePositiveNumberArg(argText, "/setordersize");
  const updated = await applyUserUpdate(context, {
    budget: {
      maxOrderSizeUsd: value,
    },
  });

  return {
    ok: true,
    command: "setordersize",
    config: updated,
    message: `Max order size updated to $${trimZeros(value.toFixed(2))}.\n\n${await formatStatusMessage(updated, context)}`,
  };
}

async function handleSetLossCapCommand(argText: string, context: ProgramCommandContext): Promise<ProgramCommandResult> {
  const value = parsePositiveNumberArg(argText, "/setlosscap");
  const updated = await applyUserUpdate(context, {
    budget: {
      maxDailyLossUsd: value,
    },
  });

  return {
    ok: true,
    command: "setlosscap",
    config: updated,
    message: `Daily loss cap updated to $${trimZeros(value.toFixed(2))}.\n\n${await formatStatusMessage(updated, context)}`,
  };
}

async function handleSetCategoriesCommand(
  argText: string,
  context: ProgramCommandContext,
): Promise<ProgramCommandResult> {
  const categories = parseCsvArg(argText, "/setcategories");
  const updated = await applyUserUpdate(context, {
    marketPreferences: {
      categories,
    },
  });

  return {
    ok: true,
    command: "setcategories",
    config: updated,
    message: `Categories updated to: ${updated.marketPreferences.categories.join(", ") || "none"}.\n\n${await formatStatusMessage(updated, context)}`,
  };
}

async function handleSetTagsCommand(argText: string, context: ProgramCommandContext): Promise<ProgramCommandResult> {
  const tags = parseCsvArg(argText, "/settags");
  const updated = await applyUserUpdate(context, {
    marketPreferences: {
      tags,
    },
  });

  return {
    ok: true,
    command: "settags",
    config: updated,
    message: `Tags updated to: ${updated.marketPreferences.tags.join(", ") || "none"}.\n\n${await formatStatusMessage(updated, context)}`,
  };
}

async function handleSetSideCommand(argText: string, context: ProgramCommandContext): Promise<ProgramCommandResult> {
  const normalized = argText.trim().toUpperCase();
  const valid: UserTradingSide[] = ["YES", "NO", "BOTH"];
  if (!valid.includes(normalized as UserTradingSide)) {
    throw new Error("Usage: /setside yes|no|both");
  }

  const updated = await applyUserUpdate(context, {
    marketPreferences: {
      tradingSide: normalized as UserTradingSide,
    },
  });

  return {
    ok: true,
    command: "setside",
    config: updated,
    message: `Trading side updated to ${updated.marketPreferences.tradingSide}.\n\n${await formatStatusMessage(updated, context)}`,
  };
}

async function handleFollowWalletCommand(
  argText: string,
  context: ProgramCommandContext,
): Promise<ProgramCommandResult> {
  const wallet = parseSingleValueArg(argText, "/followwallet");
  const current = await ensureUserConfig(context);
  const updated = await applyUserUpdate(context, {
    marketPreferences: {
      followWallets: [...current.marketPreferences.followWallets, wallet],
    },
  });

  return {
    ok: true,
    command: "followwallet",
    config: updated,
    message: `Added followed wallet: ${wallet}.\n\n${await formatStatusMessage(updated, context)}`,
  };
}

async function handleUnfollowWalletCommand(
  argText: string,
  context: ProgramCommandContext,
): Promise<ProgramCommandResult> {
  const wallet = parseSingleValueArg(argText, "/unfollowwallet");
  const current = await ensureUserConfig(context);
  const updated = await applyUserUpdate(context, {
    marketPreferences: {
      followWallets: current.marketPreferences.followWallets.filter(
        (existingWallet) => existingWallet.toLowerCase() !== wallet.toLowerCase(),
      ),
    },
  });

  return {
    ok: true,
    command: "unfollowwallet",
    config: updated,
    message: `Removed followed wallet: ${wallet}.\n\n${await formatStatusMessage(updated, context)}`,
  };
}

async function handleSetCadenceCommand(
  argText: string,
  context: ProgramCommandContext,
): Promise<ProgramCommandResult> {
  const value = parsePositiveIntegerArg(argText, "/setcadence");
  const updated = await applyUserUpdate(context, {
    execution: {
      cadenceMinutes: value,
    },
  });

  return {
    ok: true,
    command: "setcadence",
    config: updated,
    message: `Execution cadence updated to every ${value} minute(s).\n\n${await formatStatusMessage(updated, context)}`,
  };
}

async function handleDryRunCommand(argText: string, context: ProgramCommandContext): Promise<ProgramCommandResult> {
  const normalized = argText.trim().toLowerCase();
  if (normalized !== "on" && normalized !== "off") {
    throw new Error("Usage: /dryrun on|off");
  }

  const updated = await applyUserUpdate(context, {
    execution: {
      dryRunOnly: normalized === "on",
    },
  });

  return {
    ok: true,
    command: "dryrun",
    config: updated,
    message: `Dry-run mode is now ${updated.execution.dryRunOnly ? "ON" : "OFF"}.\n\n${await formatStatusMessage(updated, context)}`,
  };
}

async function applyUserUpdate(
  context: ProgramCommandContext,
  input: UserConfigPatch,
): Promise<UserTradingConfig> {
  const current = await ensureUserConfig(context);

  return upsertUserTradingConfig(
    {
      userId: current.userId,
      telegramUserId: context.telegramUserId,
      ...((context.username ?? current.username) ? { username: context.username ?? current.username } : {}),
      ...((context.displayName ?? current.displayName)
        ? { displayName: context.displayName ?? current.displayName }
        : {}),
      notifications: {
        ...(current.notifications.topicId !== undefined ? { topicId: current.notifications.topicId } : {}),
        ...(context.topicId !== undefined ? { topicId: context.topicId } : {}),
      },
      ...input,
    },
    context.configFile,
  );
}

async function ensureUserConfig(context: ProgramCommandContext): Promise<UserTradingConfig> {
  const existing = await getUserTradingConfigByTelegramUserId(context.telegramUserId, context.configFile);
  if (existing) {
    return existing;
  }

  return upsertUserTradingConfig(
    {
      telegramUserId: context.telegramUserId,
      ...(context.username ? { username: context.username } : {}),
      ...(context.displayName ? { displayName: context.displayName } : {}),
      notifications: {
        ...(context.topicId !== undefined ? { topicId: context.topicId } : {}),
      },
    },
    context.configFile,
  );
}

async function formatStatusMessage(config: UserTradingConfig, context: ProgramCommandContext): Promise<string> {
  const connectionSummary = await describeConnection(config.userId, context.vaultFile);

  return [
    `Profile: ${config.displayName ?? config.username ?? config.telegramUserId}`,
    `Mode: ${config.mode}`,
    `Connection: ${config.connection.connectionStatus}`,
    ...(connectionSummary ? [`Connection detail: ${connectionSummary}`] : []),
    `Budget: $${trimZeros(config.budget.maxDailyBudgetUsd.toFixed(2))} daily | $${trimZeros(config.budget.maxOrderSizeUsd.toFixed(2))} per order | loss cap $${trimZeros(config.budget.maxDailyLossUsd.toFixed(2))}`,
    `Capacity: ${config.budget.maxOpenPositions} open positions max`,
    `Markets: ${config.marketPreferences.categories.join(", ") || "all"} | tags ${config.marketPreferences.tags.join(", ") || "none"} | side ${config.marketPreferences.tradingSide}`,
    `Thresholds: reward >= ${trimZeros(config.marketPreferences.minRewardRate.toFixed(2))}/day | liquidity >= $${trimZeros(config.marketPreferences.minLiquidityUsd.toFixed(0))}`,
    `Followed wallets: ${config.marketPreferences.followWallets.join(", ") || "none"}`,
    `Execution: every ${config.execution.cadenceMinutes}m | reprice ${config.execution.repriceEnabled ? "on" : "off"} | stale cancel ${config.execution.cancelStaleOrdersMinutes}m | dry-run ${config.execution.dryRunOnly ? "on" : "off"}`,
    `Topic: ${config.notifications.topicId ?? "not set"}`,
  ].join("\n");
}

function buildHelpMessage(prefix?: string): string {
  return [
    ...(prefix ? [prefix, ""] : []),
    "Trading Bot (Program) commands",
    "",
    "/connect",
    "/connect dry-run",
    "/connectstatus",
    "/status",
    "/startbot",
    "/pausebot",
    "/stopbot",
    "/setbudget 200",
    "/setmaxpositions 3",
    "/setordersize 25",
    "/setlosscap 30",
    "/setcategories politics,crypto",
    "/settags trump,iran",
    "/setside yes|no|both",
    "/followwallet secondwindcapital",
    "/unfollowwallet secondwindcapital",
    "/setcadence 5",
    "/dryrun on|off",
  ].join("\n");
}

function buildConnectMessage(prefix?: string): string {
  return [
    ...(prefix ? [prefix, ""] : []),
    "Connect your Polymarket account",
    "",
    `1. Sign up or log in here: https://polymarket.com/ko?r=Musk7`,
    "2. Choose one of these modes:",
    "- Dry-run: `/connect dry-run`",
    "- API-only: derive API credentials after login, then link them outside Telegram through a secure operator workflow",
    "- Live trading: link both a wallet signer and API credentials through the secure operator workflow",
    "",
    "Important:",
    "- API credentials alone are not enough to create new Polymarket orders.",
    "- Polymarket order creation still requires a signer for local order signing.",
    "- Do not send private keys into the group chat.",
    "",
    "Use `/connectstatus` at any time to see your current connection state.",
  ].join("\n");
}

function normalizeTelegramCommand(input: string): string {
  return input.trim().replace(/^\//, "").split("@")[0]?.toLowerCase() ?? "";
}

function parsePositiveNumberArg(input: string, usage: string): number {
  const parsed = Number.parseFloat(input.trim());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Usage: ${usage} <positive number>`);
  }

  return parsed;
}

function parsePositiveIntegerArg(input: string, usage: string): number {
  const parsed = Number.parseInt(input.trim(), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Usage: ${usage} <positive integer>`);
  }

  return parsed;
}

function parseCsvArg(input: string, usage: string): string[] {
  const values = input
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (values.length === 0) {
    throw new Error(`Usage: ${usage} value1,value2`);
  }

  return values;
}

function parseSingleValueArg(input: string, usage: string): string {
  const value = input.trim();
  if (!value) {
    throw new Error(`Usage: ${usage} <value>`);
  }

  return value;
}

function trimZeros(value: string): string {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

async function describeConnection(userId: string, vaultFile = DEFAULT_AUTOTRADE_CREDENTIAL_VAULT_PATH): Promise<string | undefined> {
  const summary = await getCredentialSummary(userId, vaultFile);
  if (!summary) {
    return undefined;
  }

  const validation = await validateConnectionMethod({
    method: summary.method,
    ...(summary.publicAddress ? { publicAddress: summary.publicAddress } : {}),
    ...(summary.funderAddress ? { funderAddress: summary.funderAddress } : {}),
    ...(summary.signatureType !== undefined ? { signatureType: summary.signatureType } : {}),
    ...(summary.apiKey ? { apiKey: summary.apiKey } : {}),
    ...(summary.apiPassphrase ? { apiPassphrase: summary.apiPassphrase } : {}),
    ...(summary.builderCode ? { builderCode: summary.builderCode } : {}),
  });

  return validation.connectionSummary;
}
