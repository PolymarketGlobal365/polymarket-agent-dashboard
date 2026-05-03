import fs from "node:fs";
import path from "node:path";

const inputPath = path.resolve("drafts/kat_score_boost_edits.md");
const outPath = path.resolve("output/kat_score_boost_edits_editable.rtf");

if (!fs.existsSync(inputPath)) {
  throw new Error(`Input markdown not found: ${inputPath}`);
}

const source = fs.readFileSync(inputPath, "utf8").replace(/\r\n/g, "\n");

function rtfEscape(text) {
  let out = "";
  for (const ch of String(text ?? "")) {
    const code = ch.codePointAt(0);
    if (ch === "\\") out += "\\\\";
    else if (ch === "{") out += "\\{";
    else if (ch === "}") out += "\\}";
    else if (ch === "\n") out += "\\line ";
    else if (code <= 0x7f) out += ch;
    else {
      const signed = code > 32767 ? code - 65536 : code;
      out += `\\u${signed}?`;
    }
  }
  return out;
}

function para(text, opts = {}) {
  const align = opts.align === "center" ? "\\qc" : "\\ql";
  const size = opts.size ?? 19;
  const bold = opts.bold ? "\\b" : "";
  const color = opts.color ?? 1;
  const sb = opts.spaceBefore ?? 0;
  const sa = opts.spaceAfter ?? 120;
  return `{\\pard${align}\\cf${color}\\sb${sb}\\sa${sa}\\sl290\\slmult1${bold}\\fs${size} ${rtfEscape(text)}\\par}\n`;
}

function bullet(text, level = 0) {
  const left = 520 + level * 220;
  return `{\\pard\\ql\\li${left}\\fi-220\\sa80\\sl270\\slmult1\\cf1\\fs18 - ${rtfEscape(text)}\\par}\n`;
}

function lead(text) {
  return `{\\pard\\ql\\sb50\\sa130\\brdrl\\brdrs\\brdrw24\\brdrcf3\\li220\\ri60\\cf1\\fs19 ${rtfEscape(text)}\\par}\n`;
}

function note(text) {
  return `{\\pard\\ql\\sb50\\sa120\\brdrt\\brdrs\\brdrw10\\brdrcf4\\brdrl\\brdrs\\brdrw10\\brdrcf4\\brdrb\\brdrs\\brdrw10\\brdrcf4\\brdrr\\brdrs\\brdrw10\\brdrcf4\\cf4\\fs17 ${rtfEscape(text)}\\par}\n`;
}

function pageBreak() {
  return "\\page\n";
}

const sections = source
  .split(/\n(?=## )/g)
  .map((chunk) => chunk.trim())
  .filter(Boolean)
  .map((chunk) => {
    const lines = chunk.split("\n");
    const heading = lines.shift().replace(/^##\s*/, "").trim();
    const body = lines.join("\n").trim();
    const blocks = body.split(/\n\s*\n/g).map((item) => item.trim()).filter(Boolean);
    return { heading, blocks };
  });

let rtf = "{\\rtf1\\ansi\\deff0\n";
rtf += "{\\fonttbl{\\f0 Malgun Gothic;}}\n";
rtf += "{\\colortbl;\\red28\\green52\\blue78;\\red23\\green55\\blue90;\\red61\\green103\\blue143;\\red96\\green116\\blue139;}\n";
rtf += "\\paperw11906\\paperh16838\\margl850\\margr850\\margt900\\margb900\\viewkind4\\uc1\n";

rtf += para("코리안 아티스트 투데이", { align: "center", size: 30, bold: true, color: 2, spaceAfter: 40 });
rtf += para("평가점수 보강 포인트", { align: "center", size: 28, bold: true, color: 2, spaceAfter: 180 });
rtf += para("제안서 점수 보완을 위한 핵심 수정 포인트 및 바로 삽입 가능한 문안", {
  align: "center",
  size: 18,
  color: 4,
  spaceAfter: 260,
});
rtf += bullet("사업수행 역량 보강");
rtf += bullet("사업수행전략과 KPI 보강");
rtf += bullet("지원기술 및 사후관리 장 분리");
rtf += bullet("신규 작가 발굴 절차의 완결성 보강");
rtf += note("본 문서는 제안서 수정 시 바로 참고할 수 있도록 수정 포인트와 삽입 문안을 함께 정리한 작업용 보강 문서이다.");
rtf += pageBreak();

sections.forEach((section, index) => {
  rtf += para(section.heading, { size: 24, bold: true, color: 2, spaceAfter: 90 });
  const first = section.blocks[0];
  if (first) {
    rtf += lead(first);
  }
  for (const block of section.blocks.slice(1)) {
    const lines = block.split("\n");
    const bulletLines = lines.filter((line) => line.trim().startsWith("- "));
    if (bulletLines.length === lines.length) {
      bulletLines.forEach((line) => rtf += bullet(line.replace(/^- /, "").trim()));
    } else {
      rtf += para(block, { size: 19, spaceAfter: 120 });
    }
  }
  if (index < sections.length - 1) {
    rtf += pageBreak();
  }
});

rtf += "}";

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, rtf, "utf8");
console.log(outPath);
