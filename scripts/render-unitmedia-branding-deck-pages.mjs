import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const htmlPath = path.resolve("output/unitmedia-branding-deck-8p.html");
const outDir = path.resolve("output/unitmedia-branding-deck-8p-pages");

if (!fs.existsSync(htmlPath)) {
  throw new Error(`Input HTML not found: ${htmlPath}`);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});

await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  // @ts-ignore
  if (document.fonts?.ready) await document.fonts.ready;
});

const slides = await page.locator(".slide").elementHandles();
for (let index = 0; index < slides.length; index += 1) {
  const outputFile = path.join(outDir, `page-${String(index + 1).padStart(2, "0")}.png`);
  await slides[index].screenshot({ path: outputFile, type: "png" });
  console.log(outputFile);
}

await browser.close();
