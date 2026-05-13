# Blue State Club Automation Spec

Last stabilized: 2026-04-21

## Purpose

This document freezes the currently approved Blue State Club workflow so future edits do not accidentally drift from the working setup.

## Output Package

For each story, create one folder under `F:\bluestateclub\<story-title>` containing:

- `01.png`
- `02.png`
- `03.png`
- `04.png`
- `05.png`
- `<story-title>.txt`

All slide images must be `1080x1350`.

## Content Source Rule

- Story topics come from recent `Bloomberg` and `NYTimes` Instagram posts.
- Text is rewritten/summarized, not copied as a long verbatim excerpt.
- Background images must use license-allowed assets and should avoid reuse across batches whenever possible.

## Visual Rules

### Global

- Top-center brand line: `BLUE STATE CLUB`
- Brand size is reduced from the original PSD reference and currently fixed in code.
- Slide 5 uses the approved current closing design.

### Slide 1

- Large centered title block
- Background uses approved gradient treatment

### Slide 2

- Left-aligned 3-line body
- First word red, remaining text white

### Slide 3

- No vignette
- Use a uniform dark full-page overlay behind text
- `부제목의 내용 2` body text must be bold

### Slide 4

- Background must remain dark behind text
- First word red, remaining text white

### Slide 5

- Use the approved fixed CTA/follow layout

## Instagram Posting Rules

- Upload as `Post`
- In the crop step, always choose `Original`
- Do not allow square `1:1` posting for these `1080x1350` slides
- If an Instagram security warning appears even once, stop the scheduler

## Posting Cadence

Repeat this sequence:

1. `T0`
2. `T+3h`
3. `T+4h`
4. `T+6h`
5. `T+10h`
6. `T+17h`

## Caption File Rule

The txt file format is:

1. Title
2. Blank line
3. 5 summary lines
4. Blank line
5. One-line takeaway
6. Blank line
7. 5 English hashtags

The Instagram uploader uses the text from this txt file as the caption.

## Key Automation Files

- `C:\Users\jyjy6\Documents\New project\scripts\generate_bluestateclub_cardnews.py`
- `C:\Users\jyjy6\Documents\New project\scripts\instagram_scheduler\post-instagram-queue.mjs`
- `C:\Users\jyjy6\Documents\New project\scripts\instagram_scheduler\setup-instagram-scheduler.ps1`

## Stability Rule

If future edits are needed:

- preserve this behavior by default
- change only one part at a time
- verify with a test post or upload flow check before re-enabling repeated scheduling
