## Polymarket Trading Bot

This bot scans active Polymarket reward markets, reads the live CLOB order books, and turns them into Telegram-ready trading notes.

### What it does

- Joins Gamma event data with current reward-market data from the Polymarket CLOB.
- Fetches YES and NO order books for shortlisted markets.
- Scores each side using reward rate, liquidity, momentum, and book imbalance.
- Applies a passive quote heuristic inspired by the reference bot's reward-band repricing logic.
- Produces Telegram message blocks or JSON output.

### Current scope

- Built for signal generation and passive entry guidance.
- Does not place or cancel live orders yet.
- Safe to run in a Telegram room as a market-watching assistant.

### Run a dry scan

```bash
node dist/telegram-polymarket-trading-bot.js --dry-run
```

### Narrow by category or tag

```bash
node dist/telegram-polymarket-trading-bot.js --dry-run --category politics --max-markets 5 --max-signals 6
node dist/telegram-polymarket-trading-bot.js --dry-run --tag trump,iran
```

### Send to Telegram

Set these environment variables first:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TELEGRAM_TOPIC_ID` (optional)

Then run:

```bash
node dist/telegram-polymarket-trading-bot.js --max-markets 5 --max-signals 6
```

### Output interpretation

- `passive-entry`: the book has a usable rewarded bid lane.
- `watch-only`: the market is interesting, but the rewarded band is too thin or too wide right now.
- `score`: relative ranking only, useful for sorting signals in the room.

### Next step for live trading

To turn this into a real execution bot, add a separate order-execution adapter that signs and places CLOB orders using your wallet credentials. Keep that layer isolated from the scanning and Telegram modules.
