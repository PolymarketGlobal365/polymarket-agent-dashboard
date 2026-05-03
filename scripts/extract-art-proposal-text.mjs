import fs from "node:fs";
import path from "node:path";

const htmlPath = path.resolve("proposal_2026_art_trade_data_unitmedia_a4.html");
const outTxtUtf8 = path.resolve("output/proposal_2026_art_trade_data_unitmedia_hwp_safe_utf8.txt");
const outTxtUtf16 = path.resolve("output/proposal_2026_art_trade_data_unitmedia_hwp_safe_utf16.txt");

let html = fs.readFileSync(htmlPath, "utf8");

html = html
  .replace(/<style[\s\S]*?<\/style>/gi, "\n")
  .replace(/<head[\s\S]*?<\/head>/gi, "\n")
  .replace(/<section class="page[^"]*">/gi, "\n\n==============================\n")
  .replace(/<br\s*\/?>/gi, "\n")
  .replace(/<\/(p|div|h1|h2|h3|li|tr|table|section|ul|ol)>/gi, "\n")
  .replace(/<li[^>]*>/gi, "- ")
  .replace(/<td[^>]*>/gi, " ")
  .replace(/<th[^>]*>/gi, " ")
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, "\"")
  .replace(/&#39;/g, "'")
  .replace(/&nbsp;/g, " ")
  .replace(/[ \t]+\n/g, "\n")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

const header = [
  "2026년 미술작품 거래자료 수집 및 관리 대행 용역",
  "유니트미디어 제안서",
  "한글(HWP)에서 내용 확인용으로 안전하게 볼 수 있도록 추출한 텍스트 버전",
  ""
].join("\n");

const content = header + html + "\n";

fs.mkdirSync(path.dirname(outTxtUtf8), { recursive: true });
fs.writeFileSync(outTxtUtf8, "\uFEFF" + content, "utf8");
fs.writeFileSync(outTxtUtf16, "\uFEFF" + content, "utf16le");

console.log(outTxtUtf8);
console.log(outTxtUtf16);
