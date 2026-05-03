import fs from "node:fs";
import path from "node:path";

const baseHtmlPath = path.resolve("output/proposal_2026_korean_artist_today_designed_editable.html");
const markdownPath = path.resolve("drafts/kat_4tasks_operating_text.md");
const outPath = path.resolve("output/unitmedia_korean_artist_today_designed_editable_with_4tasks.html");

if (!fs.existsSync(baseHtmlPath)) {
  throw new Error(`Base HTML not found: ${baseHtmlPath}`);
}

if (!fs.existsSync(markdownPath)) {
  throw new Error(`Markdown not found: ${markdownPath}`);
}

const baseHtml = fs.readFileSync(baseHtmlPath, "utf8");
const markdown = fs.readFileSync(markdownPath, "utf8").replace(/\r\n/g, "\n");

const esc = (text) =>
  String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const pageOpen = () => `<div style="page-break-after:always; width:100%; margin:0; padding:0;">`;
const pageClose = (pageNo) =>
  `<div style="margin-top:10pt; text-align:right; color:#6d7e90; font-size:9pt; border-top:1px solid #d3dbe4; padding-top:4pt;">${esc(
    pageNo,
  )}</div></div>`;

const sectionCover = (pageNo, part, title, summary) => `
${pageOpen()}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d7dfe8; background:#ffffff;">
  <tr><td style="height:10mm; background:#17375a; font-size:0; line-height:0;"></td></tr>
  <tr><td style="padding:24mm 18mm 22mm 18mm; background:linear-gradient(180deg,#f1f5f8 0%,#ffffff 72%);">
    <div style="font-size:9pt; color:#234f78; font-weight:bold; letter-spacing:0.6px;">${esc(part)}</div>
    <div style="font-size:38pt; color:#d8e3ed; font-weight:bold; line-height:1; margin-top:8mm;">${esc(pageNo)}</div>
    <div style="font-size:22pt; color:#17375a; font-weight:bold; margin-top:8pt;">${esc(title)}</div>
    <table width="86%" cellpadding="0" cellspacing="0" border="0" style="margin-top:18pt;">
      <tr>
        <td style="border-left:4px solid #b7c6d5; background:#fbfcfd; padding:10pt 12pt; color:#405a73; font-size:11pt; line-height:1.82;">
          ${esc(summary)}
        </td>
      </tr>
    </table>
  </td></tr>
</table>
${pageClose(pageNo)}
`;

const contentPage = (pageNo, title, intro, contentHtml, tag = "") => `
${pageOpen()}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d7dfe8; background:#ffffff;">
  <tr><td style="height:10mm; background:#17375a; font-size:0; line-height:0;"></td></tr>
  <tr><td style="padding:15mm 14mm 13mm 14mm;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8pt;">
      <tr>
        <td valign="bottom">
          <div style="font-size:19pt; color:#17375a; font-weight:bold; margin-bottom:4pt;">${esc(title)}</div>
          <div style="font-size:9.6pt; color:#687b8f; line-height:1.72;">${esc(intro)}</div>
        </td>
        <td valign="bottom" width="90" style="text-align:right;">
          ${tag ? `<div style="font-size:9.5pt; color:#b08f48; font-weight:bold; margin-bottom:4pt;">${esc(tag)}</div>` : ""}
          <div style="font-size:10.5pt; color:#b08f48; font-weight:bold;">${esc(pageNo)}</div>
        </td>
      </tr>
    </table>
    ${contentHtml}
  </td></tr>
</table>
${pageClose(pageNo)}
`;

const leadBox = (text) =>
  `<div style="margin:0 0 10pt 0; padding:10pt 12pt; border-left:4px solid #396387; background:#f5f9fc; color:#29445f; font-size:10pt; line-height:1.76;">${esc(
    text,
  )}</div>`;

const noteBox = (text) =>
  `<div style="margin-top:8pt; padding:9pt 11pt; border:1px dashed #b8c3cf; background:#fbfcfd; color:#5a6d80; font-size:9pt; line-height:1.72;">${esc(
    text,
  )}</div>`;

const paragraph = (text) =>
  `<p style="font-size:9.7pt; color:#203244; line-height:1.78; margin:0 0 9pt;">${esc(text)}</p>`;

const sections = markdown
  .split(/\n(?=## )/g)
  .map((chunk) => chunk.trim())
  .filter(Boolean)
  .map((chunk) => {
    const lines = chunk.split("\n");
    const heading = lines.shift().replace(/^##\s*/, "").trim();
    const body = lines.join("\n").trim();
    const paragraphs = body.split(/\n\s*\n/g).map((item) => item.trim()).filter(Boolean);
    return { heading, paragraphs };
  });

let appendHtml = "";

appendHtml += sectionCover(
  "25",
  "PART 05",
  "4대 과업 운영방안",
  "제안서의 핵심 수행 내용인 자료 제작 및 관리 계획 수립, 수집형 자료 운영, 기획형 발간자료 제작, 발간자료 확산 과업을 실제 실행 관점에서 구체화한 운영방안을 별도 장으로 정리한다.",
);

let pageNo = 26;
for (const section of sections) {
  const [lead, ...rest] = section.paragraphs;
  appendHtml += contentPage(
    String(pageNo),
    section.heading.replace(/^\d+\.\s*/, ""),
    "실제 운영 단계에서 적용할 절차, 일정, 역할, 품질관리 및 리스크 대응을 중심으로 정리한 실행 문안이다.",
    `${lead ? leadBox(lead) : ""}${rest.map(paragraph).join("")}${noteBox("본 장의 문안은 제안서 본문 삽입 또는 별도 부속 문서 활용이 가능하도록 서술형으로 구성하였다.")}`,
    "OPERATIONS",
  );
  pageNo += 1;
}

const combined = baseHtml.replace("</body></html>", `${appendHtml}\n</body></html>`);
fs.writeFileSync(outPath, combined, "utf8");
console.log(outPath);
