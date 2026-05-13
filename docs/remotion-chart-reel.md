# Remotion Stock Chart Reel

This template renders an Instagram-style 9:16 stock-chart reel from a simple JSON payload.

## What it produces

- `chart-reel.mp4` - fully rendered vertical video
- `poster.png` - thumbnail / reference frame
- `premiere/chart.svg` - clean static chart asset for manual editing
- `premiere/captions.srt` - subtitle timing
- `premiere/timeline.json` - scene timings for manual edits
- `premiere/edit-guide.md` - handoff notes for Premiere Pro

## Quick start

1. Build the TypeScript project:

```bash
npm run build
```

2. Write the sample JSON:

```bash
npm run reel:sample
```

3. Render the Samsung vs KOSPI demo reel:

```bash
npm run reel:render -- --input content/chart-reels/sample-samsung-kospi-10y-chart-reel.json
```

The output lands in `output/chart-reels/<ticker-comparison>/`.

## Input shape

```json
{
  "ticker": "005930.KS",
  "assetName": "Samsung Electronics",
  "title": "Samsung vs KOSPI over the last 10 years",
  "subtitle": "Normalized to 100 from the same start date.",
  "periodLabel": "10Y Relative Performance",
  "exchange": "KRX",
  "comparisonTicker": "^KS11",
  "comparisonAssetName": "KOSPI",
  "primaryLabel": "Samsung Electronics",
  "comparisonLabel": "KOSPI",
  "primaryColor": "#7CF7B1",
  "comparisonColor": "#5BA7FF",
  "valueType": "index",
  "points": [
    { "date": "2016-04-30", "close": 100 }
  ],
  "comparisonPoints": [
    { "date": "2016-04-30", "close": 100 }
  ]
}
```

## Premiere workflow

If you do not want the fully rendered MP4, run:

```bash
node dist/chart-reel-cli.js render --input content/chart-reels/sample-samsung-kospi-10y-chart-reel.json --skip-video true
```

That still creates the Premiere handoff package so you can animate or restyle inside Adobe tools.
