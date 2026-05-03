import fs from "node:fs";

import { SYSTEM_BROWSER_PATHS } from "../config.js";

export function findSystemBrowserExecutable(): string | undefined {
  return SYSTEM_BROWSER_PATHS.find((candidate) => fs.existsSync(candidate));
}
