import { chromium, type Browser } from "playwright";

import { DEFAULT_BROWSER_CHANNEL, INSTAGRAM_HEIGHT, INSTAGRAM_WIDTH } from "../config.js";
import { findSystemBrowserExecutable } from "../lib/browser.js";

export async function launchRenderingBrowser(channel = DEFAULT_BROWSER_CHANNEL): Promise<Browser> {
  const executablePath = findSystemBrowserExecutable();

  try {
    return await chromium.launch({ headless: true });
  } catch {
    if (executablePath) {
      return chromium.launch({ executablePath, headless: true });
    }

    return chromium.launch({ channel, headless: true });
  }
}

export async function newRenderPage(browser: Browser) {
  return browser.newPage({
    viewport: {
      width: INSTAGRAM_WIDTH,
      height: INSTAGRAM_HEIGHT,
    },
    deviceScaleFactor: 1,
  });
}
