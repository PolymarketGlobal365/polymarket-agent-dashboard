import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { SAMPLE_POLYMARKET_EVENTS } from "../fixtures/sample-events.js";
import { runPipeline } from "./run.js";

test("runPipeline writes manifest and event artifacts from fixture payload", async () => {
  const outputRoot = await fs.mkdtemp(path.join(os.tmpdir(), "pm-run-"));

  const manifest = await runPipeline({
    fixturePayload: SAMPLE_POLYMARKET_EVENTS,
    outputRoot,
    runId: "test-run",
  });

  assert.equal(manifest.selectedEvents.length, 4);
  assert.equal(manifest.usedFallbackSnapshot, false);

  const eventDir = path.join(outputRoot, "runs", "test-run", "events", manifest.selectedEvents[0]!.eventId);
  assert.ok((await fs.stat(path.join(eventDir, "01-hook.png"))).isFile());
  assert.ok((await fs.stat(path.join(eventDir, "02-breakdown.png"))).isFile());
  assert.ok((await fs.stat(path.join(eventDir, "03-insight.png"))).isFile());
  assert.ok((await fs.stat(path.join(eventDir, "04-context.png"))).isFile());
  assert.ok((await fs.stat(path.join(eventDir, "05-source.png"))).isFile());
});
