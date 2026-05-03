import fs from "node:fs";
import path from "node:path";
import { run } from "node:test";
import { spec } from "node:test/reporters";

const distDir = path.resolve("dist");
const files = collectTestFiles(distDir);

if (files.length === 0) {
  console.error("No compiled test files found in dist.");
  process.exit(1);
}

const stream = run({
  files,
  concurrency: 1,
  isolation: "none",
});

stream.compose(spec).pipe(process.stdout);

let hasFailure = false;
stream.on("test:fail", () => {
  hasFailure = true;
});
stream.on("error", () => {
  hasFailure = true;
});
stream.on("end", () => {
  process.exitCode = hasFailure ? 1 : 0;
});

function collectTestFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTestFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".test.js")) {
      files.push(fullPath);
    }
  }

  return files.sort();
}
