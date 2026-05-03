export async function writeRunArtifacts(_params: {
  outputRoot: string;
  runId: string;
  rawCards: unknown[];
  normalizedEvents: unknown[];
  eventArtifacts: unknown[];
  manifest: unknown;
}): Promise<void> {
  // The user asked to keep only PNG files, so we intentionally skip JSON sidecar artifacts.
}
