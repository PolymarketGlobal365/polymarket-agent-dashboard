import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const html = path.resolve("output/proposal_2026_korean_artist_today_30p_editable.html");
const outDir = path.resolve("output/kat_30p_pages");

if (!fs.existsSync(html)) {
  throw new Error(`Input HTML not found: ${html}`);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1240, height: 1754 },
  deviceScaleFactor: 2,
});

await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  // @ts-ignore
  if (document.fonts?.ready) await document.fonts.ready;
});

const pages = await page.locator(".page").elementHandles();
for (let i = 0; i < pages.length; i += 1) {
  const out = path.join(outDir, `page-${String(i + 1).padStart(2, "0")}.png`);
  await pages[i].screenshot({ path: out });
  console.log(out);
}

await browser.close();
