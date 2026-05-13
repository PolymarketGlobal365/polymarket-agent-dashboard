## Secure Connection Flow

This project now supports a safe onboarding path for the `TRADING BOT (PROGRAM)` topic.

### User-facing flow

1. The user sends `/connect`
2. The bot replies with the referral onboarding link:
   - [Polymarket signup/login](https://polymarket.com/ko?r=Musk7)
3. The bot explains three modes:
   - `dry-run`
   - `API-only`
   - `wallet + API`

### Why API-only is not enough

Per Polymarket's official authentication model, API credentials authenticate CLOB requests, but order creation still requires a signer for local order signing.

Official references:

- [Authentication](https://docs.polymarket.com/api-reference/authentication)
- [Quickstart](https://docs.polymarket.com/trading/quickstart)

This means:

- `API-only` can be useful for future account inspection or cancellation workflows
- `wallet + API` is the required path for live order placement

### What is implemented now

- `/connect`
- `/connect dry-run`
- `/connectstatus`
- encrypted local credential vault
- live execution adapter that can use the official SDK when credentials are available

### Secure vault

Sensitive values are encrypted at rest using `AUTOTRADE_MASTER_KEY`.

Vault file:

- `output/autotrade-credential-vault.json`

Implementation:

- [src/autotrade/credential-vault.ts](C:/Users/jyjy6/Documents/New%20project/src/autotrade/credential-vault.ts)

### Secure operator workflow

Sensitive live credentials should be linked outside Telegram.

This repo includes a local operator CLI:

- [src/autotrade-link-user.ts](C:/Users/jyjy6/Documents/New%20project/src/autotrade-link-user.ts)

Example:

```bash
node dist/autotrade-link-user.js ^
  --user-id 12345 ^
  --method WALLET_AND_API ^
  --public-address 0x... ^
  --funder-address 0x... ^
  --signature-type 2 ^
  --api-key ... ^
  --api-secret ... ^
  --api-passphrase ... ^
  --private-key 0x...
```

### Live execution adapter

Live order creation is wired through:

- [src/polymarket/execution.ts](C:/Users/jyjy6/Documents/New%20project/src/polymarket/execution.ts)

It supports:

- dry-run simulation
- connection validation
- live order creation through the official Polymarket SDK when a wallet signer and API credentials are both present
