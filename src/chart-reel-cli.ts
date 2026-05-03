import path from "node:path";
import { fileURLToPath } from "node:url";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, renderStill, selectComposition } from "@remotion/renderer";

import { formatPercent, formatValue, getChartSeriesStats } from "./chart-reels/math.js";
import { SAMPLE_CHART_REEL_INPUT } from "./chart-reels/sample-input.js";
import { renderChartSvgAsset } from "./chart-reels/svg.js";
import type { ChartReelInput } from "./chart-reels/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "..");
const bundledRoot = path.join(workspaceRoot, "dist", "remotion-root.js");
const defaultSampleJson = path.join(workspaceRoot, "content", "chart-reels", "sample-samsung-kospi-10y-chart-reel.json");

async function main() {
  const [command = "render", ...restArgs] = process.argv.slice(2);
  const args = parseArgs(restArgs);

  if (command === "sample") {
    await writeSampleInput(args["output-dir"]);
    return;
  }

  if (command !== "render") {
    throw new Error(`Unknown command "${command}". Use "render" or "sample".`);
  }

  const input = await loadInput(args.input);
  const slug = slugify(`${input.ticker}-${input.comparisonTicker ?? input.periodLabel}`);
  const outputDir = path.resolve(workspaceRoot, args["output-dir"] ?? path.join("output", "chart-reels", slug));

  await mkdir(outputDir, { recursive: true });
  await mkdir(path.join(outputDir, "premiere"), { recursive: true });

  await writePremierePackage(outputDir, input);
  await renderRemotionVideo(outputDir, input, args["skip-video"] === "true");
}

async function loadInput(inputPath: string | undefined): Promise<ChartReelInput> {
  const resolvedPath = inputPath ? path.resolve(workspaceRoot, inputPath) : defaultSampleJson;
  try {
    const raw = await readFile(resolvedPath, "utf8");
    const parsed = JSON.parse(raw) as ChartReelInput;
    validateInput(parsed);
    return parsed;
  } catch (error) {
    if (inputPath) {
      throw error;
    }

    validateInput(SAMPLE_CHART_REEL_INPUT);
    return SAMPLE_CHART_REEL_INPUT;
  }
}

function validateInput(input: ChartReelInput) {
  if (!input.points || input.points.length < 2) {
    throw new Error("Input JSON must include at least two primary price points.");
  }

  if (input.comparisonPoints && input.comparisonPoints.length > 0 && input.comparisonPoints.length < 2) {
    throw new Error("Comparison series must include at least two points.");
  }
}

async function writeSampleInput(outputDirArg: string | undefined) {
  const outputDir = path.resolve(workspaceRoot, outputDirArg ?? path.join("content", "chart-reels"));
  await mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, "sample-samsung-kospi-10y-chart-reel.json");

  try {
    await copyFile(defaultSampleJson, filePath);
  } catch {
    await writeFile(filePath, JSON.stringify(SAMPLE_CHART_REEL_INPUT, null, 2), "utf8");
  }

  console.log(`Sample input written to ${filePath}`);
}

async function writePremierePackage(outputDir: string, input: ChartReelInput) {
  const premiereDir = path.join(outputDir, "premiere");
  const primaryStats = getChartSeriesStats(input.points);
  const comparisonStats = input.comparisonPoints && input.comparisonPoints.length > 1
    ? getChartSeriesStats(input.comparisonPoints)
    : null;
  const chartSvg = renderChartSvgAsset(input);
  const primaryLabel = input.primaryLabel ?? input.assetName;
  const comparisonLabel = input.comparisonLabel ?? input.comparisonAssetName ?? input.comparisonTicker ?? "Benchmark";
  const valueType = input.valueType ?? (comparisonStats ? "index" : "currency");

  const timeline = {
    metadata: {
      ticker: input.ticker,
      comparisonTicker: input.comparisonTicker ?? null,
      title: input.title,
      periodLabel: input.periodLabel,
      durationSeconds: 8,
      fps: 30,
    },
    scenes: [
      {
        start: 0,
        end: 2.5,
        type: "intro",
        text: input.title,
        direction: "Fade in ticker chips, headline, subtitle.",
      },
      {
        start: 2.5,
        end: 11,
        type: "chart-run",
        text: comparisonStats
          ? `${primaryLabel} ${formatPercent(primaryStats.percentChange)} vs ${comparisonLabel} ${formatPercent(comparisonStats.percentChange)}`
          : `${input.ticker} ${formatPercent(primaryStats.percentChange)}`,
        direction: "Use chart.svg as the base asset. Add a slow push-in and keep the line legend visible.",
      },
      ...(input.highlights ?? []).map((highlight, index) => ({
        start: 3 + index * 4,
        end: 6 + index * 4,
        type: "callout",
        text: highlight.title,
        direction: highlight.body ?? "",
      })),
      {
        start: 8,
        end: 8,
        type: "cta",
        text: input.cta ?? "Follow for the next setup.",
        direction: "End on the latest comparison gap and CTA bar.",
      },
    ],
  };

  const captions = buildCaptions(input);
  const guide = buildEditGuide(input, primaryStats, comparisonStats);
  const socialCaption = buildSocialCaption(input, primaryStats, comparisonStats);

  await writeFile(path.join(premiereDir, "chart.svg"), chartSvg, "utf8");
  await writeFile(path.join(premiereDir, "timeline.json"), JSON.stringify(timeline, null, 2), "utf8");
  await writeFile(path.join(premiereDir, "captions.srt"), captions, "utf8");
  await writeFile(path.join(premiereDir, "edit-guide.md"), guide, "utf8");
  await writeFile(path.join(outputDir, "input.json"), JSON.stringify(input, null, 2), "utf8");
  await writeFile(path.join(outputDir, "caption.txt"), socialCaption, "utf8");

  const summary = {
    primaryLabel,
    comparisonLabel: comparisonStats ? comparisonLabel : null,
    primaryReturn: formatPercent(primaryStats.percentChange),
    comparisonReturn: comparisonStats ? formatPercent(comparisonStats.percentChange) : null,
    latestPrimaryValue: formatValue(primaryStats.lastClose, valueType),
    latestComparisonValue: comparisonStats ? formatValue(comparisonStats.lastClose, valueType) : null,
  };
  await writeFile(path.join(outputDir, "summary.json"), JSON.stringify(summary, null, 2), "utf8");
}

async function renderRemotionVideo(outputDir: string, input: ChartReelInput, skipVideo: boolean) {
  const bundled = await bundle({
    entryPoint: bundledRoot,
    webpackOverride: (config) => config,
  });
  await getCompositions(bundled, {
    inputProps: input,
  });
  const composition = await selectComposition({
    serveUrl: bundled,
    id: "StockChartReel",
    inputProps: input,
  });

  await renderStill({
    composition,
    serveUrl: bundled,
    output: path.join(outputDir, "poster.png"),
    imageFormat: "png",
    inputProps: input,
    frame: Math.max(0, composition.durationInFrames - 20),
  });

  if (!skipVideo) {
    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: "h264",
      outputLocation: path.join(outputDir, "chart-reel.mp4"),
      inputProps: input,
      chromiumOptions: {
        gl: "angle",
      },
    });
  }
}

function buildCaptions(input: ChartReelInput): string {
  const primaryLabel = input.primaryLabel ?? input.assetName;
  const comparisonLabel = input.comparisonLabel ?? input.comparisonAssetName ?? input.comparisonTicker ?? "Benchmark";
  const header = input.comparisonPoints && input.comparisonPoints.length > 1
    ? `${primaryLabel} vs ${comparisonLabel}`
    : input.title;

  const segments = [
    { start: "00:00:00,000", end: "00:00:02,200", text: header },
    { start: "00:00:02,200", end: "00:00:05,600", text: input.subtitle },
    ...(
      input.highlights?.map((highlight, index) => ({
        start: toSrtTimestamp(3 + index * 4),
        end: toSrtTimestamp(6 + index * 4),
        text: [highlight.title, highlight.body].filter(Boolean).join("\n"),
      })) ?? []
    ),
    { start: "00:00:06,000", end: "00:00:08,000", text: input.cta ?? "Follow for the next setup." },
  ];

  return segments
    .map((segment, index) => `${index + 1}\n${segment.start} --> ${segment.end}\n${segment.text}\n`)
    .join("\n");
}

function buildEditGuide(
  input: ChartReelInput,
  primaryStats: ReturnType<typeof getChartSeriesStats>,
  comparisonStats: ReturnType<typeof getChartSeriesStats> | null,
): string {
  const primaryLabel = input.primaryLabel ?? input.assetName;
  const comparisonLabel = input.comparisonLabel ?? input.comparisonAssetName ?? input.comparisonTicker ?? "Benchmark";
  const valueType = input.valueType ?? (comparisonStats ? "index" : "currency");

  return `# Premiere Edit Guide

Ticker: ${input.ticker}
Title: ${input.title}
Period: ${input.periodLabel}
Primary series: ${primaryLabel}
Primary latest: ${formatValue(primaryStats.lastClose, valueType)}
Primary return: ${formatPercent(primaryStats.percentChange)}
${comparisonStats ? `Comparison series: ${comparisonLabel}
Comparison latest: ${formatValue(comparisonStats.lastClose, valueType)}
Comparison return: ${formatPercent(comparisonStats.percentChange)}` : ""}

## Suggested edit flow

1. Drop \`chart.svg\` onto a 1080x1920 sequence and scale it to fit.
2. Add a slow 102% -> 108% push-in during the chart-run section.
3. Use \`captions.srt\` for the main text overlays, then restyle inside Essential Graphics.
4. Follow \`timeline.json\` markers for intro, chart-run, callouts, and CTA timing.
5. Keep both legend labels visible during the chart comparison section.

## Recommended visual tweaks

- Keep the background dark and premium.
- Primary color: ${input.primaryColor ?? input.accentColor ?? "#74f7b3"}.
- Comparison color: ${input.comparisonColor ?? "#5ba7ff"}.
- Keep each callout to 1-2 short lines.
- If you add B-roll, keep it behind the chart card and under 20% opacity.
`;
}

function buildSocialCaption(
  input: ChartReelInput,
  primaryStats: ReturnType<typeof getChartSeriesStats>,
  comparisonStats: ReturnType<typeof getChartSeriesStats> | null,
) {
  const primaryName = input.localizedAssetName ?? input.primaryLabel ?? input.assetName;
  const comparisonName =
    input.localizedComparisonName ?? input.comparisonLabel ?? input.comparisonAssetName ?? input.comparisonTicker ?? "비교 대상";
  const title = input.title;
  const line1 = `같은 시작점을 기준으로 ${primaryName}와 ${comparisonName}의 장기 수익률을 비교했습니다.`;
  const line2 = `${primaryName}는 ${formatPercent(primaryStats.lastClose)}, ${comparisonName}는 ${formatPercent(comparisonStats?.lastClose ?? 0)}를 기록했습니다.`;
  const line3 = `10년 동안 두 자산의 격차가 어떻게 벌어졌는지 한눈에 확인할 수 있습니다.`;
  const commentLine = `비교하고 싶은 회사가 있으면 아래 댓글로 남겨주세요.`;
  const hashtags = `#삼성전자 #코스피 #주식비교 #장기투자 #stockmanclub`;

  return `${title}\n\n${line1}\n${line2}\n${line3}\n\n${commentLine}\n\n${hashtags}\n`;
}

function parseArgs(rawArgs: string[]): Record<string, string> {
  const result: Record<string, string> = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    const value = rawArgs[index];
    if (!value?.startsWith("--")) {
      continue;
    }
    const key = value.slice(2);
    const next = rawArgs[index + 1];
    if (!next || next.startsWith("--")) {
      result[key] = "true";
      continue;
    }
    result[key] = next;
    index += 1;
  }

  return result;
}

function toSrtTimestamp(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds - Math.floor(totalSeconds)) * 1000);

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${String(milliseconds).padStart(3, "0")}`;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
