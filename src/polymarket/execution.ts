import type { RewardTradingSignal } from "./trading-bot.js";

import {
  getPolymarketCredentials,
  type LiveTradingCredentials,
} from "../autotrade/credential-vault.js";
import {
  getUserTradingConfigByUserId,
  type UserTradingConfig,
} from "../autotrade/user-config.js";

export type ExecutionIntent = {
  userId: string;
  signal: RewardTradingSignal;
  sizeUsd: number;
  side: "BUY";
  orderType?: "GTC";
  tickSize?: string;
  negRisk?: boolean;
};

export type ExecutionResult = {
  ok: boolean;
  mode: "dry-run" | "live";
  reason?: string;
  orderId?: string;
  status?: string;
  simulatedOrder?: {
    tokenId: string;
    price: number;
    size: number;
    side: "BUY";
  };
};

export async function executeSignalForUser(
  intent: ExecutionIntent,
  options: {
    configFile?: string;
    vaultFile?: string;
    masterKey?: string;
  } = {},
): Promise<ExecutionResult> {
  const config = await getUserTradingConfigByUserId(intent.userId, options.configFile);
  if (!config) {
    return {
      ok: false,
      mode: "dry-run",
      reason: `Trading config not found for user ${intent.userId}.`,
    };
  }

  if (config.execution.dryRunOnly) {
    return simulate(intent, config, "User profile is still in dry-run mode.");
  }

  const creds = await getPolymarketCredentials(intent.userId, options.vaultFile, options.masterKey);
  if (!creds) {
    return simulate(intent, config, "No live Polymarket credentials are linked yet.");
  }

  if (creds.method !== "WALLET_AND_API") {
    return simulate(
      intent,
      config,
      "API-only connection is not enough for order creation. Polymarket orders still require a signer.",
    );
  }

  if (!creds.privateKey || !creds.apiKey || !creds.apiSecret || !creds.apiPassphrase || !creds.funderAddress) {
    return simulate(intent, config, "Live credential set is incomplete.");
  }

  return placeOrderViaSdk(intent, {
    ...creds,
    privateKey: creds.privateKey,
    apiKey: creds.apiKey,
    apiSecret: creds.apiSecret,
    apiPassphrase: creds.apiPassphrase,
    funderAddress: creds.funderAddress,
  });
}

export async function validateConnectionMethod(
  credentials: LiveTradingCredentials | undefined,
): Promise<{
  ok: boolean;
  connectionSummary: string;
}> {
  if (!credentials || credentials.method === "NONE") {
    return {
      ok: false,
      connectionSummary: "No connection has been linked yet.",
    };
  }

  if (credentials.method === "DRY_RUN") {
    return {
      ok: true,
      connectionSummary: "Dry-run mode is linked. No live orders will be posted.",
    };
  }

  if (credentials.method === "API_ONLY") {
    return {
      ok: false,
      connectionSummary: "API-only mode is linked, but live order creation still needs a wallet signer.",
    };
  }

  if (credentials.method === "WALLET_AND_API") {
    return {
      ok: true,
      connectionSummary: "Wallet signer and API credentials are available for live trading.",
    };
  }

  return {
    ok: false,
    connectionSummary: "Unknown connection state.",
  };
}

function simulate(intent: ExecutionIntent, config: UserTradingConfig, reason: string): ExecutionResult {
  return {
    ok: true,
    mode: "dry-run",
    reason,
    simulatedOrder: {
      tokenId: intent.signal.tokenId,
      price: intent.signal.quote.targetPrice ?? intent.signal.bestBid,
      size: Math.min(intent.sizeUsd, config.budget.maxOrderSizeUsd),
      side: "BUY",
    },
  };
}

async function placeOrderViaSdk(
  intent: ExecutionIntent,
  credentials: Required<Pick<LiveTradingCredentials, "privateKey" | "apiKey" | "apiSecret" | "apiPassphrase" | "funderAddress">>
    & LiveTradingCredentials,
): Promise<ExecutionResult> {
  const { ClobClient, Side, OrderType } = await import("@polymarket/clob-client-v2");
  const { createWalletClient, http } = await import("viem");
  const { privateKeyToAccount } = await import("viem/accounts");

  const host = "https://clob.polymarket.com";
  const chain = 137;
  const account = privateKeyToAccount(credentials.privateKey as `0x${string}`);
  const signer = createWalletClient({ account, transport: http() });

  const client = new ClobClient({
    host,
    chain,
    signer,
    creds: {
      key: credentials.apiKey,
      secret: credentials.apiSecret,
      passphrase: credentials.apiPassphrase,
    },
    signatureType: credentials.signatureType ?? 2,
    funderAddress: credentials.funderAddress,
  });

  const response = await client.createAndPostOrder(
    {
      tokenID: intent.signal.tokenId,
      price: intent.signal.quote.targetPrice ?? intent.signal.bestBid,
      size: intent.sizeUsd,
      side: Side.BUY,
      ...(credentials.builderCode ? { builderCode: credentials.builderCode } : {}),
    },
    {
      tickSize: (intent.tickSize ?? "0.01") as never,
      negRisk: intent.negRisk ?? false,
    },
    OrderType[intent.orderType ?? "GTC"],
  );

  return {
    ok: true,
    mode: "live",
    orderId: response.orderID,
    status: response.status,
  };
}
