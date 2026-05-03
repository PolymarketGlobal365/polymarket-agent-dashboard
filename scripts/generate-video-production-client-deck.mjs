import fs from "node:fs";
import path from "node:path";

const slideWidth = 1920;
const slideHeight = 1080;
const deckDir = path.join(
  process.cwd(),
  "assets",
  "templates",
  "video-production-client-deck",
);

const theme = {
  bg: "#111315",
  panel: "#171A1F",
  panelAlt: "#13171C",
  line: "#2A2F36",
  text: "#F5F7FA",
  muted: "#99A3B3",
  soft: "#697587",
  accent: "#E87141",
  accentSoft: "#5A2E21",
  mint: "#83E1D6",
  blue: "#9BC0FF",
  pink: "#F4A7FF",
  green: "#9EE6B1",
  amber: "#FFCC85",
};

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function svgText({
  x,
  y,
  text,
  fill = theme.text,
  size = 24,
  weight = 500,
  anchor = "start",
  family = "Pretendard, Noto Sans KR, Inter, sans-serif",
}) {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${escapeXml(text)}</text>`;
}

function svgRect({
  x,
  y,
  width,
  height,
  radius = 20,
  fill = theme.panel,
  stroke = "",
  strokeWidth = 0,
  extra = "",
}) {
  const strokeAttrs = stroke
    ? ` stroke="${stroke}" stroke-width="${strokeWidth}"`
    : "";
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}"${strokeAttrs}${extra}/>`;
}

function svgLine({ x1, y1, x2, y2, stroke, width = 2, extra = "" }) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
}

function wrapLines(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function textBlock({
  x,
  y,
  text,
  maxChars = 26,
  lineHeight = 30,
  fill = theme.text,
  size = 20,
  weight = 500,
}) {
  return wrapLines(text, maxChars)
    .map((line, index) =>
      svgText({
        x,
        y: y + index * lineHeight,
        text: line,
        fill,
        size,
        weight,
      }),
    )
    .join("\n");
}

function bulletList({ x, y, items, width = 520, color = theme.text }) {
  return items
    .map((item, index) => {
      const top = y + index * 78;
      return `
        ${svgRect({
          x,
          y: top,
          width,
          height: 62,
          radius: 18,
          fill: theme.panelAlt,
          stroke: theme.line,
          strokeWidth: 2,
        })}
        <circle cx="${x + 28}" cy="${top + 31}" r="14" fill="${theme.accentSoft}"/>
        ${svgText({
          x: x + 23,
          y: top + 37,
          text: String(index + 1),
          fill: theme.accent,
          size: 16,
          weight: 700,
          anchor: "middle",
        })}
        ${textBlock({
          x: x + 56,
          y: top + 37,
          text: item,
          maxChars: 32,
          lineHeight: 24,
          fill: color,
          size: 17,
          weight: 600,
        })}
      `;
    })
    .join("\n");
}

function sectionLabel({ x, y, label, color }) {
  return `
    ${svgRect({
      x,
      y: y - 22,
      width: 132,
      height: 34,
      radius: 12,
      fill: `${color}20`,
      stroke: color,
      strokeWidth: 1.5,
    })}
    ${svgText({ x: x + 66, y: y, text: label, fill: color, size: 14, weight: 700, anchor: "middle" })}
  `;
}

function slideBase({ index, title, subtitle, body }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${slideWidth}" height="${slideHeight}" viewBox="0 0 ${slideWidth} ${slideHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${svgRect({ x: 0, y: 0, width: slideWidth, height: slideHeight, radius: 0, fill: theme.bg })}
    <defs>
      <linearGradient id="accent-glow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <circle cx="1710" cy="160" r="240" fill="url(#accent-glow)"/>
    ${svgRect({
      x: 36,
      y: 36,
      width: slideWidth - 72,
      height: slideHeight - 72,
      radius: 28,
      fill: "transparent",
      stroke: theme.line,
      strokeWidth: 2,
    })}
    ${svgText({ x: 82, y: 104, text: `${String(index).padStart(2, "0")}`, fill: theme.accent, size: 18, weight: 700 })}
    ${svgText({ x: 82, y: 176, text: title, fill: theme.text, size: 54, weight: 700 })}
    ${svgText({ x: 82, y: 218, text: subtitle, fill: theme.muted, size: 22, weight: 500 })}
    ${svgLine({ x1: 82, y1: 248, x2: 1838, y2: 248, stroke: theme.line })}
    ${body}
    ${svgText({ x: 1838, y: 1014, text: "Production Proposal Deck", fill: theme.soft, size: 14, weight: 500, anchor: "end" })}
  </svg>`;
}

function placeholderFrame({ x, y, width, height, label }) {
  return `
    ${svgRect({
      x,
      y,
      width,
      height,
      radius: 24,
      fill: theme.panelAlt,
      stroke: theme.line,
      strokeWidth: 2,
      extra: ' stroke-dasharray="12 10" ',
    })}
    ${svgText({
      x: x + width / 2,
      y: y + height / 2 - 8,
      text: label,
      fill: theme.soft,
      size: 24,
      weight: 700,
      anchor: "middle",
    })}
    ${svgText({
      x: x + width / 2,
      y: y + height / 2 + 26,
      text: "replace with still / frame / moodboard",
      fill: theme.soft,
      size: 16,
      weight: 500,
      anchor: "middle",
    })}
  `;
}

const slides = [
  {
    file: "slide-01-cover.svg",
    title: "영상 제작 제안서",
    subtitle: "브랜드 메시지를 명확한 서사와 설계된 비주얼로 전달하는 프로덕션형 제안 덱",
    body: `
      ${svgRect({ x: 82, y: 312, width: 928, height: 612, radius: 28, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 128, y: 388, text: "Project Title", fill: theme.blue, size: 16, weight: 700 })}
      ${svgRect({ x: 128, y: 406, width: 388, height: 34, radius: 12, fill: theme.panelAlt })}
      ${svgText({ x: 128, y: 496, text: "Overview", fill: theme.blue, size: 16, weight: 700 })}
      ${textBlock({ x: 128, y: 536, text: "이 덱은 기획 의도, 타깃 설계, 서사 구조, 비주얼 방향, 제작 프로세스를 한 번에 설명하기 위한 클라이언트용 제안서입니다.", maxChars: 30, lineHeight: 34, size: 24, weight: 600 })}
      ${svgRect({ x: 128, y: 704, width: 816, height: 164, radius: 24, fill: theme.panelAlt, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 160, y: 752, text: "Deck Use", fill: theme.amber, size: 15, weight: 700 })}
      ${textBlock({ x: 160, y: 792, text: "클라이언트 공유용 / 내부 합의용 / 촬영 및 생성 파이프라인 설명용", maxChars: 38, lineHeight: 30, size: 20, weight: 600 })}
      ${placeholderFrame({ x: 1074, y: 312, width: 764, height: 612, label: "Hero Frame / Key Visual" })}
      ${svgRect({ x: 1584, y: 110, width: 190, height: 56, radius: 18, fill: theme.accentSoft })}
      ${svgText({ x: 1679, y: 146, text: "CLIENT VER.", fill: theme.accent, size: 18, weight: 700, anchor: "middle" })}
    `,
  },
  {
    file: "slide-02-project-summary.svg",
    title: "프로젝트 개요",
    subtitle: "이 영상이 왜 필요한지와 어떤 결과를 만들어야 하는지를 명확하게 정의합니다",
    body: `
      ${sectionLabel({ x: 82, y: 308, label: "PROJECT GOAL", color: theme.blue })}
      ${svgRect({ x: 82, y: 334, width: 560, height: 258, radius: 24, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${textBlock({ x: 116, y: 392, text: "브랜드/제품/공간/서비스가 전달해야 할 핵심 가치를 짧은 시간 안에 이해시키는 것", maxChars: 23, lineHeight: 34, size: 25, weight: 700 })}
      ${svgRect({ x: 82, y: 626, width: 560, height: 248, radius: 24, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 116, y: 676, text: "What This Video Must Do", fill: theme.green, size: 15, weight: 700 })}
      ${bulletList({ x: 116, y: 710, width: 490, items: ["첫 장면에서 시선을 붙잡는다", "정보보다 인상을 먼저 설계한다", "영상이 끝난 뒤 행동 포인트를 남긴다"] })}
      ${sectionLabel({ x: 690, y: 308, label: "CLIENT INPUT", color: theme.amber })}
      ${svgRect({ x: 690, y: 334, width: 546, height: 540, radius: 24, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${bulletList({ x: 726, y: 390, width: 474, items: ["브랜드/행사/제품의 현재 상황", "전달해야 할 핵심 문장 1개", "반드시 포함되어야 할 요소", "피해야 할 표현 및 리스크", "희망하는 결과물 톤과 길이"] })}
      ${sectionLabel({ x: 1284, y: 308, label: "SUCCESS VIEW", color: theme.pink })}
      ${svgRect({ x: 1284, y: 334, width: 554, height: 540, radius: 24, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${textBlock({ x: 1318, y: 394, text: "좋은 결과물은 예쁘기만 한 영상이 아니라, 보는 사람이 메시지를 바로 이해하고 다음 행동으로 이어지게 만드는 영상입니다.", maxChars: 24, lineHeight: 34, size: 24, weight: 600 })}
      ${svgRect({ x: 1318, y: 604, width: 486, height: 214, radius: 22, fill: theme.panelAlt, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 1350, y: 652, text: "Output Example", fill: theme.mint, size: 15, weight: 700 })}
      ${textBlock({ x: 1350, y: 694, text: "브랜드 인상 강화 / 공간 이해 증대 / 제품 USP 강조 / 행사 기대감 증폭", maxChars: 25, lineHeight: 30, size: 20, weight: 600 })}
    `,
  },
  {
    file: "slide-03-audience-message.svg",
    title: "타깃과 커뮤니케이션 전략",
    subtitle: "누구에게 무엇을 어떤 감정선으로 전달할지 먼저 정의합니다",
    body: `
      ${svgRect({ x: 82, y: 318, width: 560, height: 600, radius: 28, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 120, y: 376, text: "Target Audience", fill: theme.blue, size: 18, weight: 700 })}
      ${bulletList({ x: 120, y: 420, width: 484, items: ["첫 접점에서 브랜드를 처음 만나는 시청자", "짧은 시간 안에 핵심만 이해하고 싶은 실무 담당자", "공감 가능한 분위기와 신뢰감 있는 톤을 원하는 클라이언트"] })}
      ${svgRect({ x: 682, y: 318, width: 524, height: 600, radius: 28, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 720, y: 376, text: "Core Message", fill: theme.amber, size: 18, weight: 700 })}
      ${textBlock({ x: 720, y: 440, text: "우리는 이 영상을 통해 복잡한 설명 없이도 브랜드의 강점과 분위기를 직관적으로 이해시키는 것을 목표로 합니다.", maxChars: 20, lineHeight: 34, size: 25, weight: 700 })}
      ${svgRect({ x: 720, y: 694, width: 448, height: 162, radius: 22, fill: theme.panelAlt, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 752, y: 742, text: "Emotional Path", fill: theme.mint, size: 15, weight: 700 })}
      ${textBlock({ x: 752, y: 782, text: "관심 유도 → 몰입 → 신뢰 형성 → 기억에 남는 마무리", maxChars: 22, lineHeight: 30, size: 20, weight: 600 })}
      ${svgRect({ x: 1246, y: 318, width: 592, height: 600, radius: 28, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 1284, y: 376, text: "Communication Principles", fill: theme.pink, size: 18, weight: 700 })}
      ${bulletList({ x: 1284, y: 420, width: 516, items: ["말보다 이미지로 먼저 이해되게 구성", "장면마다 하나의 메시지만 남기도록 단순화", "브랜드 무드를 해치지 않는 전환과 속도 설계", "마지막에는 행동 유도 혹은 인상 정리로 마감"] })}
    `,
  },
  {
    file: "slide-04-creative-concept.svg",
    title: "크리에이티브 컨셉",
    subtitle: "영상의 전체 인상을 결정하는 큰 아이디어와 표현 원칙을 제안합니다",
    body: `
      ${svgRect({ x: 82, y: 318, width: 1756, height: 230, radius: 28, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 126, y: 376, text: "Big Idea", fill: theme.amber, size: 18, weight: 700 })}
      ${textBlock({ x: 126, y: 448, text: "정보를 나열하는 방식이 아니라, 하나의 감정과 하나의 핵심 가치가 이어지는 인상 중심 영상으로 설계합니다.", maxChars: 42, lineHeight: 40, size: 30, weight: 700 })}
      ${svgRect({ x: 82, y: 584, width: 552, height: 330, radius: 26, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 118, y: 642, text: "Mood Keywords", fill: theme.blue, size: 17, weight: 700 })}
      ${bulletList({ x: 118, y: 684, width: 480, items: ["정제된", "몰입감 있는", "세련된", "기억에 남는"] })}
      ${svgRect({ x: 684, y: 584, width: 552, height: 330, radius: 26, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 720, y: 642, text: "Narrative Device", fill: theme.green, size: 17, weight: 700 })}
      ${textBlock({ x: 720, y: 700, text: "후킹 장면으로 시작하고, 핵심 가치가 점점 분명해지도록 시선과 정보량을 단계적으로 조절합니다.", maxChars: 20, lineHeight: 34, size: 23, weight: 600 })}
      ${svgRect({ x: 1286, y: 584, width: 552, height: 330, radius: 26, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 1322, y: 642, text: "Brand Impression", fill: theme.pink, size: 17, weight: 700 })}
      ${textBlock({ x: 1322, y: 700, text: "브랜드가 직접 설명하지 않아도 ‘이런 결을 가진 곳’이라고 느껴지도록 표정과 공간과 텍스처를 관리합니다.", maxChars: 21, lineHeight: 34, size: 23, weight: 600 })}
    `,
  },
  {
    file: "slide-05-visual-direction.svg",
    title: "비주얼 디렉션",
    subtitle: "톤앤매너, 공간감, 움직임, 그래픽 사용 원칙을 사전에 설계합니다",
    body: `
      ${placeholderFrame({ x: 82, y: 318, width: 640, height: 372, label: "Reference Moodboard" })}
      ${svgRect({ x: 82, y: 724, width: 640, height: 194, radius: 24, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 118, y: 772, text: "Direction Summary", fill: theme.amber, size: 16, weight: 700 })}
      ${textBlock({ x: 118, y: 816, text: "고급스러운 어두운 베이스 위에 포인트 컬러를 제한적으로 사용해 집중도를 높입니다.", maxChars: 26, lineHeight: 32, size: 22, weight: 600 })}
      ${svgRect({ x: 770, y: 318, width: 1068, height: 600, radius: 28, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${sectionLabel({ x: 804, y: 382, label: "STYLE SYSTEM", color: theme.blue })}
      ${bulletList({ x: 804, y: 424, width: 480, items: ["조명: 콘트라스트를 살린 깊이감 있는 라이팅", "색감: 핵심 색상만 남긴 절제된 팔레트", "카메라: 느리게 밀고 당기거나 리듬감 있는 전환", "텍스트: 필요한 경우에만 짧고 명확하게 사용"] })}
      ${svgRect({ x: 1312, y: 424, width: 490, height: 422, radius: 24, fill: theme.panelAlt, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 1344, y: 472, text: "Continuity Rules", fill: theme.mint, size: 16, weight: 700 })}
      ${bulletList({ x: 1344, y: 510, width: 424, items: ["장면마다 광원 방향 유지", "브랜드 요소 노출 위치 통일", "인물/오브젝트 비율 안정화", "전환 전후 구도 충돌 방지"] })}
    `,
  },
  {
    file: "slide-06-story-structure.svg",
    title: "스토리 구조",
    subtitle: "영상의 흐름을 시작, 전개, 전환, 마무리까지 서사적으로 설계합니다",
    body: `
      ${svgRect({ x: 82, y: 336, width: 1756, height: 462, radius: 28, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgLine({ x1: 196, y1: 570, x2: 1724, y2: 570, stroke: theme.line, width: 3 })}
      ${["Hook", "Context", "Value", "Immersion", "Payoff"].map((label, index) => `
        <circle cx="${236 + index * 372}" cy="570" r="22" fill="${theme.accentSoft}"/>
        ${svgText({ x: 236 + index * 372, y: 577, text: String(index + 1), fill: theme.accent, size: 18, weight: 700, anchor: "middle" })}
        ${svgText({ x: 188 + index * 372, y: 480, text: label, fill: theme.text, size: 22, weight: 700 })}
      `).join("\n")}
      ${textBlock({ x: 152, y: 522, text: "첫 1~3초 안에 시선을 붙잡는 장면", maxChars: 16, lineHeight: 28, size: 18, weight: 600 })}
      ${textBlock({ x: 524, y: 522, text: "무엇을 보는지 바로 이해시키는 구간", maxChars: 16, lineHeight: 28, size: 18, weight: 600 })}
      ${textBlock({ x: 896, y: 522, text: "브랜드/제품/공간의 강점을 제시", maxChars: 16, lineHeight: 28, size: 18, weight: 600 })}
      ${textBlock({ x: 1268, y: 522, text: "감정과 분위기를 확장하며 몰입 유도", maxChars: 16, lineHeight: 28, size: 18, weight: 600 })}
      ${textBlock({ x: 1640, y: 522, text: "기억에 남는 장면으로 정리 및 행동 유도", maxChars: 16, lineHeight: 28, size: 18, weight: 600 })}
      ${svgRect({ x: 82, y: 836, width: 560, height: 110, radius: 22, fill: theme.panelAlt, stroke: theme.line, strokeWidth: 2 })}
      ${svgRect({ x: 680, y: 836, width: 560, height: 110, radius: 22, fill: theme.panelAlt, stroke: theme.line, strokeWidth: 2 })}
      ${svgRect({ x: 1278, y: 836, width: 560, height: 110, radius: 22, fill: theme.panelAlt, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 116, y: 882, text: "Scene Count", fill: theme.blue, size: 16, weight: 700 })}
      ${svgText({ x: 714, y: 882, text: "Estimated Runtime", fill: theme.green, size: 16, weight: 700 })}
      ${svgText({ x: 1312, y: 882, text: "Transition Rhythm", fill: theme.pink, size: 16, weight: 700 })}
      ${svgText({ x: 116, y: 920, text: "총 6~12개 장면으로 명확하게 분절", fill: theme.text, size: 20, weight: 600 })}
      ${svgText({ x: 714, y: 920, text: "15초 / 30초 / 60초 기준으로 유연하게 확장", fill: theme.text, size: 20, weight: 600 })}
      ${svgText({ x: 1312, y: 920, text: "컷, 디졸브, 매치컷을 혼합해 리듬 설계", fill: theme.text, size: 20, weight: 600 })}
    `,
  },
  {
    file: "slide-07-scene-execution.svg",
    title: "장면 구성안",
    subtitle: "실제 제작 시 어떤 컷과 흐름으로 전개할지 장면 단위로 정리합니다",
    body: `
      ${[0, 1, 2, 3, 4, 5].map((index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = 82 + col * 876;
        const y = 318 + row * 212;
        return `
          ${svgRect({ x, y, width: 794, height: 176, radius: 24, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
          <circle cx="${x + 38}" cy="${y + 38}" r="18" fill="${theme.accentSoft}"/>
          ${svgText({ x: x + 38, y: y + 45, text: String(index + 1), fill: theme.accent, size: 18, weight: 700, anchor: "middle" })}
          ${svgText({ x: x + 74, y: y + 46, text: `Scene ${String(index + 1).padStart(2, "0")}`, fill: theme.text, size: 24, weight: 700 })}
          ${svgRect({ x: x + 74, y: y + 64, width: 250, height: 24, radius: 8, fill: theme.panelAlt })}
          ${textBlock({ x: x + 74, y: y + 114, text: ["도입 훅 장면", "상황 제시", "핵심 가치 노출", "분위기 확장", "정보 정리", "엔딩/CTA"][index], maxChars: 18, lineHeight: 28, size: 20, weight: 700 })}
          ${textBlock({ x: x + 360, y: y + 112, text: ["시선 확보용 이미지", "브랜드/공간/인물의 맥락 제시", "주요 USP 혹은 감정 포인트", "몰입감 있는 텍스처와 움직임", "메시지 재정렬", "기억에 남는 마무리"][index], maxChars: 18, lineHeight: 28, size: 18, weight: 600, fill: theme.muted })}
        `;
      }).join("\n")}
    `,
  },
  {
    file: "slide-08-production-workflow.svg",
    title: "제작 프로세스",
    subtitle: "기획부터 최종 납품까지 어떤 방식으로 안전하게 결과물을 완성하는지 설명합니다",
    body: `
      ${svgRect({ x: 82, y: 326, width: 1756, height: 548, radius: 28, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${["기획", "비주얼 설계", "생성/제작", "편집/후반", "검수/납품"].map((label, index) => {
        const x = 146 + index * 332;
        return `
          <circle cx="${x}" cy="536" r="28" fill="${theme.accentSoft}"/>
          ${svgText({ x, y: 545, text: String(index + 1), fill: theme.accent, size: 22, weight: 700, anchor: "middle" })}
          ${svgText({ x: x - 42, y: 456, text: label, fill: theme.text, size: 24, weight: 700 })}
          ${index < 4 ? svgLine({ x1: x + 38, y1: 536, x2: x + 294, y2: 536, stroke: theme.line, width: 3 }) : ""}
        `;
      }).join("\n")}
      ${textBlock({ x: 98, y: 630, text: "브리프 정리 / 목표 정의 / 자료 취합", maxChars: 14, lineHeight: 28, size: 18, weight: 600 })}
      ${textBlock({ x: 430, y: 630, text: "스토리보드 / 무드보드 / 레퍼런스 설계", maxChars: 14, lineHeight: 28, size: 18, weight: 600 })}
      ${textBlock({ x: 762, y: 630, text: "컷 생성 / 소스 제작 / 필요한 촬영 또는 합성", maxChars: 14, lineHeight: 28, size: 18, weight: 600 })}
      ${textBlock({ x: 1094, y: 630, text: "리듬 편집 / 사운드 / 자막 / 색보정", maxChars: 14, lineHeight: 28, size: 18, weight: 600 })}
      ${textBlock({ x: 1426, y: 630, text: "수정 반영 / 출력 점검 / 최종 납품", maxChars: 14, lineHeight: 28, size: 18, weight: 600 })}
      ${svgRect({ x: 82, y: 908, width: 854, height: 122, radius: 24, fill: theme.panelAlt, stroke: theme.line, strokeWidth: 2 })}
      ${svgRect({ x: 984, y: 908, width: 854, height: 122, radius: 24, fill: theme.panelAlt, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 118, y: 958, text: "Why This Workflow Works", fill: theme.mint, size: 16, weight: 700 })}
      ${svgText({ x: 1020, y: 958, text: "Client Communication Point", fill: theme.blue, size: 16, weight: 700 })}
      ${textBlock({ x: 118, y: 998, text: "기획과 비주얼 설계를 먼저 고정해 불필요한 수정 비용을 줄입니다.", maxChars: 28, lineHeight: 30, size: 20, weight: 600 })}
      ${textBlock({ x: 1020, y: 998, text: "중간 단계마다 방향 확인 포인트를 두어 결과물이 어긋나지 않게 관리합니다.", maxChars: 28, lineHeight: 30, size: 20, weight: 600 })}
    `,
  },
  {
    file: "slide-09-deliverables.svg",
    title: "산출물 및 운영 기준",
    subtitle: "무엇을 어떤 형태로 전달하는지, 수정과 납품 기준은 어떻게 되는지 정리합니다",
    body: `
      ${svgRect({ x: 82, y: 318, width: 580, height: 620, radius: 28, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 120, y: 376, text: "Deliverables", fill: theme.amber, size: 18, weight: 700 })}
      ${bulletList({ x: 120, y: 418, width: 504, items: ["메인 영상 1종", "버전별 리사이즈 또는 숏폼 컷다운", "썸네일/대표 프레임", "자막 포함본 및 무자막본", "필요 시 스틸 이미지 추출본"] })}
      ${svgRect({ x: 710, y: 318, width: 544, height: 620, radius: 28, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 748, y: 376, text: "Revision Policy", fill: theme.green, size: 18, weight: 700 })}
      ${bulletList({ x: 748, y: 418, width: 468, items: ["기획 확정 후 본 제작 진행", "중간 확인 단계에서 방향성 점검", "수정은 라운드 기준으로 관리", "최종 출력 전 체크리스트 검수"] })}
      ${svgRect({ x: 1302, y: 318, width: 536, height: 620, radius: 28, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 1340, y: 376, text: "Delivery Format", fill: theme.blue, size: 18, weight: 700 })}
      ${bulletList({ x: 1340, y: 418, width: 460, items: ["16:9 / 9:16 / 1:1 등 목적별 출력", "H.264 MP4 기본 납품", "플랫폼 업로드용 권장 스펙 제공", "필요 시 피그마/PDF 설명자료 병행"] })}
    `,
  },
  {
    file: "slide-10-closing.svg",
    title: "기대 효과 및 다음 단계",
    subtitle: "이 제안이 실제로 어떤 결과를 만들고, 다음 합의는 무엇인지 명확히 마무리합니다",
    body: `
      ${svgRect({ x: 82, y: 318, width: 770, height: 600, radius: 28, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 126, y: 382, text: "Expected Outcome", fill: theme.pink, size: 18, weight: 700 })}
      ${textBlock({ x: 126, y: 458, text: "완성된 영상은 단순한 소개 영상을 넘어, 브랜드의 결을 보여주고 클라이언트가 원하는 인상을 빠르게 형성하는 역할을 하게 됩니다.", maxChars: 22, lineHeight: 36, size: 28, weight: 700 })}
      ${svgRect({ x: 126, y: 700, width: 682, height: 162, radius: 24, fill: theme.panelAlt, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 158, y: 746, text: "Best For", fill: theme.amber, size: 15, weight: 700 })}
      ${textBlock({ x: 158, y: 786, text: "브랜드 필름 / 공간 소개 / 행사 티저 / 제품 프로모션 / 투자 및 소개용 영상", maxChars: 24, lineHeight: 30, size: 20, weight: 600 })}
      ${placeholderFrame({ x: 900, y: 318, width: 938, height: 362, label: "Final Hero Still / Ending Frame" })}
      ${svgRect({ x: 900, y: 718, width: 938, height: 200, radius: 26, fill: theme.panel, stroke: theme.line, strokeWidth: 2 })}
      ${svgText({ x: 940, y: 770, text: "Next Step", fill: theme.mint, size: 18, weight: 700 })}
      ${bulletList({ x: 940, y: 808, width: 860, items: ["핵심 메시지 1문장 확정", "레퍼런스와 금지 요소 공유", "우선 제작 포맷과 러닝타임 결정"] })}
    `,
  },
];

fs.mkdirSync(deckDir, { recursive: true });

for (const slide of slides) {
  const svg = slideBase({
    index: slides.indexOf(slide) + 1,
    title: slide.title,
    subtitle: slide.subtitle,
    body: slide.body,
  });
  fs.writeFileSync(path.join(deckDir, slide.file), `${svg}\n`, "utf8");
}

const manifest = slides
  .map(
    (slide, index) =>
      `${String(index + 1).padStart(2, "0")}. ${slide.title} - ${slide.file}`,
  )
  .join("\n");

fs.writeFileSync(
  path.join(deckDir, "README.txt"),
  `Video Production Client Deck\n\nImport these SVG files into Figma in order:\n\n${manifest}\n`,
  "utf8",
);

console.log(`Generated ${slides.length} slides in ${deckDir}`);
