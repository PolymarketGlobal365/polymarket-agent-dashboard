## Telegram Topic Formats

This document defines the English message format for the four Telegram topics in the room.

### 1. Wallet Leaderboard

Purpose:
- Show who is performing well
- Summarize each trader's style and focus
- Help users decide which wallets are worth tracking

Message shape:
- Topic header
- Generated timestamp
- Trader count
- Ranked trader blocks

Each trader block includes:
- rank
- trader name
- account id
- profile link
- PnL, volume, win rate
- focus market
- style tags
- short overview

### 2. Copytrade

Purpose:
- Show notable wallet moves
- Explain whether the move looks like an entry, trim, or rotation
- Give users a direct market link

Message shape:
- Topic header
- Generated timestamp
- Alert count
- Alert blocks

Each alert block includes:
- trader name
- buy or sell side
- market title
- outcome
- price
- size
- observed time
- interpretation
- market link

### 3. Trading Bot (Program)

Purpose:
- Show operational status for the automatic trading system
- Show per-user program status
- Surface warnings, budget caps, and pending actions

Message shape:
- Topic header
- Generated timestamp
- bot status
- optional alerts
- per-user program blocks

Each program block includes:
- user label
- mode
- strategy label
- budget
- deployed capital
- realized PnL
- open orders
- filled orders
- pending actions
- note

### 4. Strategies

Purpose:
- Publish the daily thesis
- Explain what the team should emphasize or avoid
- Separate strategic commentary from execution logs

Message shape:
- Topic header
- Generated timestamp
- headline
- thesis
- watchlist
- section blocks
- closing note

Each section block includes:
- heading
- bullet list

### Code location

Topic formatters live in:

- [src/telegram/topic-format.ts](C:/Users/jyjy6/Documents/New%20project/src/telegram/topic-format.ts)

Tests live in:

- [src/telegram/topic-format.test.ts](C:/Users/jyjy6/Documents/New%20project/src/telegram/topic-format.test.ts)
