## Autotrade User Config Model

This document defines the per-user configuration model for the automatic trading bot.

### Goal

Each Telegram user needs an isolated trading profile so the bot can:

- know whether the user is active or paused
- understand budget and risk limits
- decide what markets the user wants to trade
- know where to send program notifications
- later attach Polymarket execution credentials safely

### Main fields

Stored model:

- `userId`
- `telegramUserId`
- `username`
- `displayName`
- `mode`
- `connection`
- `budget`
- `marketPreferences`
- `execution`
- `notifications`
- `notes`
- `createdAt`
- `updatedAt`

### Connection

Current model stores metadata only:

- `walletAddress`
- `proxyWalletAddress`
- `apiCredentialRef`
- `connectionStatus`

Important:
- this stage does not store raw API secrets
- `apiCredentialRef` is a future hook for a safer credential layer

### Budget

- `maxDailyBudgetUsd`
- `maxOpenPositions`
- `maxOrderSizeUsd`
- `maxDailyLossUsd`

### Market preferences

- `categories`
- `tags`
- `tradingSide`
- `minRewardRate`
- `minLiquidityUsd`
- `maxSignalsPerRun`
- `followWallets`

### Execution

- `cadenceMinutes`
- `repriceEnabled`
- `cancelStaleOrdersMinutes`
- `dryRunOnly`

### Notifications

- `topicId`
- `sendDailySummary`
- `sendFillAlerts`
- `sendRiskAlerts`

### Storage

Default file path:

- `output/autotrade-user-configs.json`

Implementation:

- [src/autotrade/user-config.ts](C:/Users/jyjy6/Documents/New%20project/src/autotrade/user-config.ts)

Tests:

- [src/autotrade/user-config.test.ts](C:/Users/jyjy6/Documents/New%20project/src/autotrade/user-config.test.ts)

### What this unlocks next

This model is the foundation for:

1. Telegram commands in the `TRADING BOT (PROGRAM)` topic
2. user-specific execution loops
3. user-specific fills and risk alerts
4. later Polymarket credential attachment
