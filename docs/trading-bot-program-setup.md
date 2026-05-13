## Trading Bot (Program) Setup

This is the user-facing Telegram command layer for the `TRADING BOT (PROGRAM)` topic.

### What it does now

- reads Telegram commands from updates
- creates or updates a per-user trading profile
- replies with English status messages
- keeps all user settings in a local JSON store

### Entry point

Run:

```bash
node dist/telegram-program-bot.js --allowed-topic-id <TOPIC_ID>
```

Or with the package script:

```bash
npm run telegram:program-bot -- --allowed-topic-id <TOPIC_ID>
```

### Required environment variable

- `TELEGRAM_BOT_TOKEN`

### Recommended topic

Use this only inside the `TRADING BOT (PROGRAM)` topic.

### Supported commands

- `/status`
- `/startbot`
- `/pausebot`
- `/stopbot`
- `/setbudget 200`
- `/setmaxpositions 3`
- `/setordersize 25`
- `/setlosscap 30`
- `/setcategories politics,crypto`
- `/settags trump,iran`
- `/setside yes|no|both`
- `/followwallet secondwindcapital`
- `/unfollowwallet secondwindcapital`
- `/setcadence 5`
- `/dryrun on|off`

### What users should do first

Suggested onboarding flow:

1. `/setbudget 200`
2. `/setmaxpositions 3`
3. `/setcategories politics,crypto`
4. `/followwallet secondwindcapital`
5. `/status`
6. `/startbot`

### Important limitation

At this stage, this is still a command and configuration layer.
It does not place real Polymarket orders yet.
The next step is the execution engine connection.

### Files

- [src/telegram/program-commands.ts](C:/Users/jyjy6/Documents/New%20project/src/telegram/program-commands.ts)
- [src/telegram-program-bot.ts](C:/Users/jyjy6/Documents/New%20project/src/telegram-program-bot.ts)
- [src/autotrade/user-config.ts](C:/Users/jyjy6/Documents/New%20project/src/autotrade/user-config.ts)
