import fs from "node:fs/promises";
import path from "node:path";

import { DEFAULT_OUTPUT_ROOT } from "./config.js";
import { ensureDir, writeJson } from "./lib/fs.js";
import {
  buildForecastDashboardViewModel,
  renderForecastDashboardHtml,
  type ForecastDashboardConfig,
} from "./polymarket/forecast-dashboard.js";
import { buildRewardTradingSnapshot } from "./polymarket/trading-bot.js";

const DEFAULT_OUTPUT_FILE = path.join(DEFAULT_OUTPUT_ROOT, "polymarket-forecast-dashboard.html");
const DEFAULT_CONFIG_FILE = path.join(DEFAULT_OUTPUT_ROOT, "polymarket-agent-config.json");
const DEFAULT_SNAPSHOT_FILE = path.join(DEFAULT_OUTPUT_ROOT, "polymarket-forecast-snapshot.json");

type ParsedArgs = {
  outputFile: string;
  snapshotFile: string;
  configFile?: string;
  writeTemplate: boolean;
};

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.writeTemplate) {
    const template = defaultConfig();
    await writeJson(args.configFile ?? DEFAULT_CONFIG_FILE, template);
    process.stdout.write(`${JSON.stringify({ ok: true, wroteTemplate: args.configFile ?? DEFAULT_CONFIG_FILE }, null, 2)}\n`);
    return;
  }

  const config = await loadConfig(args.configFile);
  const snapshot = await buildRewardTradingSnapshot();
  const model = buildForecastDashboardViewModel(snapshot, config);
  const html = renderForecastDashboardHtml(model);

  await ensureDir(path.dirname(args.outputFile));
  await fs.writeFile(args.outputFile, html, "utf8");
  await writeJson(args.snapshotFile, snapshot);

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        outputFile: args.outputFile,
        snapshotFile: args.snapshotFile,
        cards: model.cards.length,
        agent: config.agent.agentName,
      },
      null,
      2,
    )}\n`,
  );
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    outputFile: DEFAULT_OUTPUT_FILE,
    snapshotFile: DEFAULT_SNAPSHOT_FILE,
    writeTemplate: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    switch (current) {
      case "--output-file":
        parsed.outputFile = path.resolve(requireValue(current, next));
        index += 1;
        break;
      case "--snapshot-file":
        parsed.snapshotFile = path.resolve(requireValue(current, next));
        index += 1;
        break;
      case "--config-file":
        parsed.configFile = path.resolve(requireValue(current, next));
        index += 1;
        break;
      case "--write-template":
        parsed.writeTemplate = true;
        break;
      default:
        throw new Error(`Unknown argument: ${current}`);
    }
  }

  return parsed;
}

function requireValue(flag: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${flag} requires a value.`);
  }

  return value;
}

async function loadConfig(configFile: string | undefined): Promise<ForecastDashboardConfig> {
  if (!configFile) {
    return defaultConfig();
  }

  const raw = JSON.parse(await fs.readFile(configFile, "utf8")) as Partial<ForecastDashboardConfig>;
  return {
    title: raw.title?.trim() || "Polymarket Win Rate Desk",
    subtitle: raw.subtitle?.trim() || "Downloadable prediction dashboard with your own AI agent profile",
    accent: raw.accent === "cyan" || raw.accent === "amber" ? raw.accent : "green",
    agent: {
      agentName: raw.agent?.agentName?.trim() || "My Trading Agent",
      provider: raw.agent?.provider?.trim() || "OpenAI",
      model: raw.agent?.model?.trim() || "gpt-5.4",
      strategy: raw.agent?.strategy?.trim() || "Desk strategy using probability, rewards, spread, and execution stability",
      riskStyle:
        raw.agent?.riskStyle === "conservative" || raw.agent?.riskStyle === "aggressive"
          ? raw.agent.riskStyle
          : "balanced",
      voiceNote: raw.agent?.voiceNote?.trim() || "Short and sharp briefing focused on the key edge",
    },
  };
}

function defaultConfig(): ForecastDashboardConfig {
  return {
    title: "Polymarket Win Rate Desk",
    subtitle: "Downloadable prediction dashboard with your own AI agent profile",
    accent: "green",
    agent: {
      agentName: "My Trading Agent",
      provider: "OpenAI",
      model: "gpt-5.4",
      strategy: "Desk strategy using probability, rewards, spread, and execution stability",
      riskStyle: "balanced",
      voiceNote: "Short and sharp briefing focused on the key edge",
    },
  };
}

await main();
