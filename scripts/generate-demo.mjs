import { runPipeline } from "../dist/pipeline/run.js";
import { SAMPLE_POLYMARKET_EVENTS } from "../dist/fixtures/sample-events.js";

const manifest = await runPipeline({
  fixturePayload: SAMPLE_POLYMARKET_EVENTS,
  runId: "demo-style",
});

console.log(JSON.stringify(manifest, null, 2));
