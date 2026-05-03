import fs from "node:fs";
import path from "node:path";
import { pages } from "./generate-art-proposal-rtf.mjs";

const outPath = path.resolve("proposal_2026_art_trade_data_unitmedia_hwp_editable_full.html");

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderBullets(list) {
  return `<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

const style = `
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>2026년 미술작품 거래자료 수집 및 관리 대행 용역 제안서</title>
<style>
  @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
  body { margin: 0; padding: 0; font-family: "Malgun Gothic", sans-serif; color: #1e3552; font-size: 11pt; line-height: 1.75; background: #fff; }
  .page { page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  .frame { border: 1px solid #cfd7e1; padding: 16mm 13mm 15mm 13mm; background: #fcfcfc; }
  .cover { padding-top: 22mm; }
  .badge { display: inline-block; border: 1px solid #8ea0b4; color: #1e3c61; font-size: 9pt; letter-spacing: 1px; padding: 5px 10px; margin-bottom: 18mm; }
  .title-box { border: 1px dashed #8fa1b7; padding: 10px 12px; margin-bottom: 15px; }
  .title { font-size: 24pt; font-weight: 700; color: #17375a; line-height: 1.35; margin: 0 0 8px 0; }
  .subtitle { color: #59718a; font-size: 12pt; margin: 0; }
  .pill-wrap { margin: 13px 0 20px 0; }
  .pill { display: inline-block; padding: 4px 10px; border: 1px solid #c8d3de; border-radius: 20px; background: #fff; color: #23456c; font-size: 10pt; margin: 0 6px 7px 0; }
  table.layout { width: 100%; border-collapse: separate; border-spacing: 14px 0; }
  table.layout td { width: 50%; vertical-align: top; border: 1px solid #d3dae2; background: #f7f9fb; padding: 14px 16px; }
  .box-title { display: inline-block; font-weight: 700; font-size: 12pt; margin-bottom: 8px; color: #1e3552; border-bottom: 1px dashed #9aaaba; padding-bottom: 3px; }
  .section-mark { color: #d9e3ee; font-size: 34pt; font-weight: 700; margin: 0 0 8px 0; }
  .section-title { font-size: 21pt; font-weight: 700; color: #17375a; margin: 0 0 10px 0; }
  .lead { border-left: 4px solid #375f87; background: #f6f9fc; padding: 10px 12px; margin: 0 0 14px 0; }
  .content p { margin: 0 0 10px 0; }
  .content ul { margin: 6px 0 12px 18px; }
  .content li { margin: 0 0 6px 0; }
  .footer { margin-top: 16px; border-top: 1px solid #d1dbe5; padding-top: 6px; text-align: right; font-size: 9pt; color: #6a7a8b; }
  .small-title { font-size: 14pt; color: #17375a; font-weight: 700; margin: 0 0 8px 0; }
</style>
</head>
<body>
`;

let html = style;

pages.forEach((page, idx) => {
  const pageOpen = `<div class="page"${idx > 0 ? ` style="page-break-before:always;"` : ""}>`;
  if (page.type === "cover") {
    html += `${pageOpen}<div class="frame cover">`;
    html += `<div class="badge">PROPOSAL DOCUMENT / A4 PORTRAIT</div>`;
    html += `<div class="title-box"><div class="title">${escapeHtml(page.lines[1].text)}</div><div class="subtitle">${escapeHtml(page.lines[2].text)}</div></div>`;
    html += `<div class="pill-wrap"><span class="pill">국내 12개 경매사 대응</span><span class="pill">해외 3개 경매사 + 2개 플랫폼</span><span class="pill">7일 이내 검수·제출 체계</span><span class="pill">식별 ID 표준화</span><span class="pill">자료 오류 최소화</span><span class="pill">시스템 연동 협업</span></div>`;
    html += `<table class="layout"><tr><td><div class="box-title">제안 방향</div><p>${escapeHtml(page.lines[8].text)}</p></td><td><div class="box-title">핵심 약속</div><p>${escapeHtml(page.lines[9].text)}</p></td></tr></table>`;
    html += `<table class="layout" style="margin-top:14px;"><tr><td><div class="box-title">기본 정보</div><p>${escapeHtml(page.lines[4].text)}</p><p>${escapeHtml(page.lines[5].text)}</p></td><td><div class="box-title">기본 정보</div><p>${escapeHtml(page.lines[6].text)}</p><p>${escapeHtml(page.lines[7].text)}</p></td></tr></table>`;
    html += `<div class="footer">${String(idx + 1).padStart(2, "0")}</div></div></div>`;
    return;
  }

  const title = page.title ?? `Page ${idx + 1}`;
  const lead = page.bullets?.[0] ?? page.paragraphs?.[0] ?? "";
  const restBullets = page.bullets ? page.bullets.slice(1) : [];
  const restParas = page.paragraphs ? page.paragraphs.slice(1) : [];

  html += `${pageOpen}<div class="frame">`;
  html += `<div class="section-mark">${String(idx + 1).padStart(2, "0")}</div>`;
  html += `<div class="section-title">${escapeHtml(title)}</div>`;
  if (lead) html += `<div class="lead">${escapeHtml(lead)}</div>`;
  html += `<div class="content">`;
  if (restParas.length) {
    html += restParas.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
  }
  if (restBullets.length) {
    html += renderBullets(restBullets);
  }
  html += `</div><div class="footer">${String(idx + 1).padStart(2, "0")}</div></div></div>`;
});

html += `</body></html>`;

fs.writeFileSync(outPath, "\uFEFF" + html, "utf8");
console.log(outPath);
