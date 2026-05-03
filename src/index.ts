import fs from "node:fs/promises";
import path from "node:path";

import { DEFAULT_API_URL, DEFAULT_OUTPUT_ROOT, DEFAULT_SOURCE_URL } from "./config.js";
import { runPipeline } from "./pipeline/run.js";

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const fixturePayload = args.fixturePayloadPath
    ? JSON.parse(await fs.readFile(path.resolve(args.fixturePayloadPath), "utf8"))
    : undefined;

  const manifest = await runPipeline({
    apiUrl: args.apiUrl ?? DEFAULT_API_URL,
    sourceUrl: args.sourceUrl ?? DEFAULT_SOURCE_URL,
    outputRoot: args.outputRoot ?? DEFAULT_OUTPUT_ROOT,
    ...(fixturePayload ? { fixturePayload } : {}),
    ...(args.runId ? { runId: args.runId } : {}),
    ...(args.bullImagePath ? { bullImagePath: args.bullImagePath } : {}),
    ...(args.bearImagePath ? { bearImagePath: args.bearImagePath } : {}),
    skipSnapshotFallback: args.skipSnapshotFallback,
  });

  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

type ParsedArgs = {
  apiUrl?: string;
  sourceUrl?: string;
  outputRoot?: string;
  fixturePayloadPath?: string;
  runId?: string;
  bullImagePath?: string;
  bearImagePath?: string;
  skipSnapshotFallback: boolean;
};

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    skipSnapshotFallback: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    switch (current) {
      case "--api-url":
        if (!next) {
          throw new Error("--api-url requires a value");
        }
        parsed.apiUrl = next;
        index += 1;
        break;
      case "--source-url":
        if (!next) {
          throw new Error("--source-url requires a value");
        }
        parsed.sourceUrl = next;
        index += 1;
        break;
      case "--output-root":
        if (!next) {
          throw new Error("--output-root requires a value");
        }
        parsed.outputRoot = next;
        index += 1;
        break;
      case "--fixture-payload":
        if (!next) {
          throw new Error("--fixture-payload requires a value");
        }
        parsed.fixturePayloadPath = next;
        index += 1;
        break;
      case "--run-id":
        if (!next) {
          throw new Error("--run-id requires a value");
        }
        parsed.runId = next;
        index += 1;
        break;
      case "--bull-image":
        if (!next) {
          throw new Error("--bull-image requires a value");
        }
        parsed.bullImagePath = next;
        index += 1;
        break;
      case "--bear-image":
        if (!next) {
          throw new Error("--bear-image requires a value");
        }
        parsed.bearImagePath = next;
        index += 1;
        break;
      case "--skip-snapshot-fallback":
        parsed.skipSnapshotFallback = true;
        break;
      default:
        throw new Error(`Unknown argument: ${current}`);
    }
  }

  return parsed;
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
