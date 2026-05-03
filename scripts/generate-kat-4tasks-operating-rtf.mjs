import fs from "node:fs";
import path from "node:path";

const inputPath = path.resolve("drafts/kat_4tasks_operating_text.md");
const outPath = path.resolve("output/kat_4tasks_operating_plan_editable.rtf");

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
  const align = opts.align === "center" ? "\\qc" : opts.align === "right" ? "\\qr" : "\\ql";
  const size = opts.size ?? 19;
  const bold = opts.bold ? "\\b" : "";
  const color = opts.color ?? 1;
  const sb = opts.spaceBefore ?? 0;
  const sa = opts.spaceAfter ?? 120;
  return `{\\pard${align}\\cf${color}\\sb${sb}\\sa${sa}\\sl290\\slmult1${bold}\\fs${size} ${rtfEscape(text)}\\par}\n`;
}

function lead(text) {
  return `{\\pard\\ql\\sb60\\sa140\\brdrl\\brdrs\\brdrw24\\brdrcf3\\li220\\ri60\\cf1\\fs20 ${rtfEscape(text)}\\par}\n`;
}

function bullet(text) {
  return `{\\pard\\ql\\li520\\fi-220\\sa80\\sl270\\slmult1\\cf1\\fs18 - ${rtfEscape(text)}\\par}\n`;
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
    const paragraphs = body.split(/\n\s*\n/g).map((item) => item.trim()).filter(Boolean);
    return { heading, paragraphs };
  });

let rtf = "{\\rtf1\\ansi\\deff0\n";
rtf += "{\\fonttbl{\\f0 Malgun Gothic;}}\n";
rtf += "{\\colortbl;\\red28\\green52\\blue78;\\red23\\green55\\blue90;\\red61\\green103\\blue143;\\red96\\green116\\blue139;}\n";
rtf += "\\paperw11906\\paperh16838\\margl800\\margr800\\margt850\\margb850\\viewkind4\\uc1\n";

rtf += para("코리안 아티스트 투데이", { align: "center", size: 32, bold: true, color: 2, spaceAfter: 60 });
rtf += para("4대 과업 운영방안", { align: "center", size: 30, bold: true, color: 2, spaceAfter: 200 });
rtf += para(
  "코리안 아티스트 투데이 자료 제작 및 관리 계획 수립, 수집형 자료 관리 및 등록 운영, 기획형 발간자료 제작 및 게재, 발간자료 확산 운영에 대한 상세 실행 방안",
  { align: "center", size: 18, color: 4, spaceAfter: 280 },
);
rtf += bullet("코리안 아티스트 투데이 자료 제작 및 관리 계획 수립");
rtf += bullet("수집형 자료 관리 및 등록 운영 방안");
rtf += bullet("기획형 발간자료 제작 및 게재 운영 방안");
rtf += bullet("코리안 아티스트 투데이 발간자료 확산 운영 방안");
rtf += note("본 문서는 제안서 본문에 삽입하거나 별도 부속 문서로 제출할 수 있도록 수정 가능한 한글 파일 기준으로 구성하였다.");
rtf += pageBreak();

sections.forEach((section, index) => {
  rtf += para(section.heading, { size: 26, bold: true, color: 2, spaceAfter: 100 });
  if (section.paragraphs.length > 0) {
    rtf += lead(section.paragraphs[0]);
    for (const paragraph of section.paragraphs.slice(1)) {
      rtf += para(paragraph, { size: 19, spaceAfter: 120 });
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
