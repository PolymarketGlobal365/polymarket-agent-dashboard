import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const htmlPath = path.resolve("output/brand-sns-packages-4p.html");
const outDir = path.resolve("output/brand-sns-packages-4p-pages");

if (!fs.existsSync(htmlPath)) {
  throw new Error(`Input HTML not found: ${htmlPath}`);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1300, height: 1600 },
  deviceScaleFactor: 2,
});

await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  // @ts-ignore
  if (document.fonts?.ready) await document.fonts.ready;
});

const pages = await page.locator(".page").elementHandles();
for (let index = 0; index < pages.length; index += 1) {
  const outputFile = path.join(outDir, `page-${String(index + 1).padStart(2, "0")}.png`);
  await pages[index].screenshot({ path: outputFile });
  console.log(outputFile);
}

await browser.close();
