import fs from "node:fs/promises";
import path from "node:path";

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function readJsonIfExists<T>(filePath: string): Promise<T | undefined> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return undefined;
    }

    throw error;
  }
}

export function resolveOutputPaths(outputRoot: string, runId: string): {
  runDir: string;
  snapshotsDir: string;
  eventsDir: string;
} {
  const runDir = path.join(outputRoot, "runs", runId);

  return {
    runDir,
    snapshotsDir: path.join(outputRoot, "snapshots"),
    eventsDir: path.join(runDir, "events"),
  };
}
