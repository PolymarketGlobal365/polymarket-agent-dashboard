import fs from "node:fs";
import path from "node:path";

const outPath = path.resolve("output/proposal_2026_overseas_korean_heritage_editable_designed.html");
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const esc = (text) =>
  String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const pageOpen = () => `<div style="page-break-after:always; width:100%; margin:0; padding:0;">`;
const pageClose = (pageNo) =>
  `<div style="margin-top:10pt; text-align:right; color:#6b7c8d; font-size:9pt; border-top:1px solid #d3dae2; padding-top:4pt;">${esc(
    pageNo,
  )}</div></div>`;

const coverPage = () => `
${pageOpen()}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d7dfe8; background:linear-gradient(135deg,#fbfbf8 0%,#f2f6f8 56%,#eaf1f6 100%);">
  <tr><td style="padding:24mm 16mm 18mm 16mm;">
    <div style="display:inline-block; border:1px solid #8ea0b4; color:#1e3c61; font-size:9pt; letter-spacing:1px; padding:5px 10px; margin-bottom:18mm;">OFFICIAL BID PROPOSAL / EDITABLE DESIGNED VERSION</div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px dashed #8fa1b7; background:#ffffff; margin-bottom:14pt;">
      <tr><td style="padding:12pt 14pt;">
        <div style="font-size:24pt; font-weight:bold; color:#17375a; line-height:1.35; margin-bottom:8pt;">국외 한국문화유산 자료 목록화 연구 제안서</div>
        <div style="font-size:12pt; color:#59718a; line-height:1.72;">국외 한국문화유산 관련 자료의 체계적 목록화, 독일어·수기 자료 판독, 고해상도 디지털 촬영, 보안과 보존환경을 갖춘 안전한 연구수행 체계를 하나의 실행 프레임으로 제안합니다.</div>
      </td></tr>
    </table>
    <div style="margin-bottom:16pt;">
      <span style="display:inline-block; padding:4px 10px; border:1px solid #c8d3de; border-radius:20px; background:#fff; color:#23456c; font-size:10pt; margin:0 6px 7px 0;">자료 전체 목록화</span>
      <span style="display:inline-block; padding:4px 10px; border:1px solid #c8d3de; border-radius:20px; background:#fff; color:#23456c; font-size:10pt; margin:0 6px 7px 0;">독일어 자료 판독</span>
      <span style="display:inline-block; padding:4px 10px; border:1px solid #c8d3de; border-radius:20px; background:#fff; color:#23456c; font-size:10pt; margin:0 6px 7px 0;">2,000컷 이상 촬영</span>
      <span style="display:inline-block; padding:4px 10px; border:1px solid #c8d3de; border-radius:20px; background:#fff; color:#23456c; font-size:10pt; margin:0 6px 7px 0;">항온·항습 수준 작업환경</span>
    </div>
    <table width="100%" cellpadding="0" cellspacing="14" border="0">
      <tr>
        <td valign="top" style="width:56%; border:1px solid #d3dae2; background-color:#f7f9fb; padding:12pt 14pt;">
          <div style="font-size:12pt; color:#17375a; font-weight:bold; margin-bottom:6pt;">제안 방향</div>
          <div style="font-size:10.5pt; line-height:1.8; color:#1f3552;">본 과업은 자료를 정리하는 일에 그치지 않고, 향후 연구·보존·전시·DB 구축의 기반을 만드는 일입니다. 제안사는 자료 전체의 목록화 기준을 통일하고, 독일어와 수기 자료의 해독 난이도를 관리하며, 문화유산과 문서자료의 안전을 최우선으로 고려한 촬영·보안·검수 체계를 통해 발주처가 즉시 활용 가능한 성과물을 제출하겠습니다.</div>
        </td>
        <td valign="top" style="width:44%;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="border:1px solid #d3dae2; background:#ffffff; padding:10pt 12pt;">
                <div style="font-size:9pt; color:#6a7c8d; margin-bottom:4pt;">사업명</div>
                <div style="font-size:10.5pt; color:#17375a; line-height:1.6; font-weight:bold;">국외 한국문화유산 자료 목록화 연구</div>
              </td>
              <td style="width:8pt;"></td>
              <td style="border:1px solid #d3dae2; background:#ffffff; padding:10pt 12pt;">
                <div style="font-size:9pt; color:#6a7c8d; margin-bottom:4pt;">사업기간</div>
                <div style="font-size:10.5pt; color:#17375a; line-height:1.6; font-weight:bold;">계약체결일 ~ 2026. 8. 31.</div>
              </td>
            </tr>
            <tr><td colspan="3" style="height:8pt;"></td></tr>
            <tr>
              <td style="border:1px solid #d3dae2; background:#ffffff; padding:10pt 12pt;">
                <div style="font-size:9pt; color:#6a7c8d; margin-bottom:4pt;">사업예산</div>
                <div style="font-size:10.5pt; color:#17375a; line-height:1.6; font-weight:bold;">금 35,000,000원<br>(부가가치세 포함)</div>
              </td>
              <td style="width:8pt;"></td>
              <td style="border:1px solid #d3dae2; background:#ffffff; padding:10pt 12pt;">
                <div style="font-size:9pt; color:#6a7c8d; margin-bottom:4pt;">제안사</div>
                <div style="font-size:10.5pt; color:#17375a; line-height:1.6; font-weight:bold;">[제안사명 기입]</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <div style="margin-top:8pt;">
      <span style="display:inline-block; padding:4px 10px; border-radius:20px; background:#eef3f8; color:#23456c; font-size:9.5pt; margin:0 6px 7px 0;">학술 기반 구축</span>
      <span style="display:inline-block; padding:4px 10px; border-radius:20px; background:#eef3f8; color:#23456c; font-size:9.5pt; margin:0 6px 7px 0;">디지털 보존 강화</span>
      <span style="display:inline-block; padding:4px 10px; border-radius:20px; background:#eef3f8; color:#23456c; font-size:9.5pt; margin:0 6px 7px 0;">관리·활용 기초자료 확보</span>
    </div>
  </td></tr>
</table>
${pageClose("01")}
`;

const sectionCover = (no, title, summary, part) => `
${pageOpen()}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d7dfe8; background:#ffffff;">
  <tr><td style="height:10mm; background:#17375a; font-size:0; line-height:0;"></td></tr>
  <tr><td style="padding:24mm 18mm 22mm 18mm; background:linear-gradient(180deg,#f4f1ea 0%,#ffffff 72%);">
    <div style="font-size:9pt; color:#17375a; font-weight:bold; letter-spacing:0.6px;">${esc(part)}</div>
    <div style="font-size:38pt; color:#d9e3ee; font-weight:bold; line-height:1; margin-top:10mm;">${esc(no)}</div>
    <div style="font-size:22pt; color:#17375a; font-weight:bold; margin-top:6pt;">${esc(title)}</div>
    <table width="86%" cellpadding="0" cellspacing="0" border="0" style="margin-top:18pt;">
      <tr>
        <td style="border-left:4px solid #bb9a52; background-color:#fcfcfb; padding:10pt 12pt; color:#425b74; font-size:11pt; line-height:1.82;">
          ${esc(summary)}
        </td>
      </tr>
    </table>
  </td></tr>
</table>
${pageClose(no)}
`;

const contentPage = (pageNo, title, intro, contentHtml, tag = "") => `
${pageOpen()}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d7dfe8; background-color:#ffffff;">
  <tr><td style="height:10mm; background:#17375a; font-size:0; line-height:0;"></td></tr>
  <tr><td style="padding:16mm 14mm 14mm 14mm;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8pt;">
      <tr>
        <td valign="bottom">
          <div style="font-size:18pt; color:#17375a; font-weight:bold; margin-bottom:4pt;">${esc(title)}</div>
          <div style="font-size:9.6pt; color:#6b7c8d; line-height:1.7;">${esc(intro)}</div>
        </td>
        <td valign="bottom" width="78" style="text-align:right;">
          ${tag ? `<div style="font-size:10pt; color:#b9964a; font-weight:bold; margin-bottom:4pt;">${esc(tag)}</div>` : ""}
          <div style="font-size:10.5pt; color:#b9964a; text-align:right; font-weight:bold;">${esc(pageNo)}</div>
        </td>
      </tr>
    </table>
    ${contentHtml}
  </td></tr>
</table>
${pageClose(pageNo)}
`;

const cardGrid = (items, columns = 2) => {
  const width = columns === 3 ? "33.33%" : columns === 4 ? "25%" : "50%";
  const rows = [];
  for (let i = 0; i < items.length; i += columns) {
    const slice = items.slice(i, i + columns);
    rows.push(`<tr>${
      slice.map((item) => `<td valign="top" style="width:${width}; border:1px solid #d3dae2; background:#fbfcfd; padding:10pt 11pt;">
        <div style="font-size:10.5pt; color:#17375a; font-weight:bold; margin-bottom:4pt;">${esc(item.title)}</div>
        <div style="font-size:9.2pt; color:#31475b; line-height:1.72;">${esc(item.body)}</div>
      </td>`).join('<td style="width:8pt;border:none;background:none;padding:0;"></td>')
    }</tr>`);
  }
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0">${rows.join('<tr><td colspan="7" style="height:8pt;border:none;background:none;padding:0;"></td></tr>')}</table>`;
};

const simpleTable = (headers, rows) => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin-top:6pt;">
  <tr>${headers.map((h) => `<td style="border:1px solid #c8d3dd; background:#eef4f8; padding:7pt 8pt; font-size:9.2pt; font-weight:bold; color:#17375a;">${esc(h)}</td>`).join("")}</tr>
  ${rows.map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid #c8d3dd; padding:7pt 8pt; font-size:9.1pt; color:#203244; line-height:1.62;" valign="top">${cell}</td>`).join("")}</tr>`).join("")}
</table>
`;

const noteBox = (text) => `<div style="margin-top:8pt; padding:9pt 11pt; border:1px dashed #b5c0cb; background:#fcfcfd; color:#586a7b; font-size:9.2pt; line-height:1.72;">${esc(text)}</div>`;
const quoteBox = (text) => `<div style="margin-top:8pt; padding:9pt 11pt; border-left:4px solid #2f7b74; background:#f5faf9; color:#27425a; font-size:9.6pt; line-height:1.74;">${esc(text)}</div>`;
const leadBox = (text) => `<div style="margin:0 0 8pt 0; padding:9pt 11pt; border:1px solid #d3dae2; background:#f7fafc; color:#30475c; font-size:10pt; line-height:1.74;">${esc(text)}</div>`;

const bulletList = (items) =>
  `<ul style="margin:0 0 8pt 18pt; padding:0;">${items
    .map((item) => `<li style="margin:0 0 4pt; color:#203244; font-size:9.5pt; line-height:1.7;">${esc(item)}</li>`)
    .join("")}</ul>`;

const pages = [];

pages.push(coverPage());

pages.push(
  contentPage(
    "02",
    "제안 요약 및 목차",
    "평가위원이 전체 구조와 메시지를 빠르게 파악할 수 있도록 제안의 핵심과 30페이지 구성을 먼저 제시합니다.",
    `
      ${leadBox("본 제안은 정확한 목록화, 안전한 디지털화, 독일어 자료 판독, 장기 활용 가능한 성과물 구조화를 4대 원칙으로 설계되었습니다.")}
      ${cardGrid([
        { title: "핵심 약속", body: "자료 전체에 대한 통일 메타데이터 기준 수립, 2,000컷 이상 고해상도 촬영, 원자료 안전 확보, 편집 가능한 최종 파일 납품을 약속합니다." },
        { title: "평가 대응 방향", body: "연구역량에는 독일어 판독·문화유산 조사·디지털 아카이빙 역량을, 연구계획에는 방법론·일정·실행성·활용성을 집중적으로 반영했습니다." },
      ], 2)}
      <div style="font-size:11pt; color:#17375a; font-weight:bold; margin:10pt 0 6pt;">목차</div>
      ${simpleTable(
        ["구성 1", "구성 2"],
        [
          [
            "1. 제안 요약 및 목차<br>2. 사업 개요<br>3. 사업 목적과 핵심과업 이해<br>4. 평가항목 대응전략<br>5. 수행 프레임<br>6. 목록화 기준<br>7. 독일어·수기 자료 판독 방법<br>8. 디지털 촬영 계획<br>9. 보안·보존·백업 계획<br>10. 수행 조직과 역할<br>11. 소통·보고 체계<br>12. 상세 수행 프로세스<br>13. 품질관리 및 리스크 대응<br>14. 추진 일정 및 성과물",
            "15. 연구 목적 및 필요성<br>16. 연구내용 및 범위<br>17. 추진전략 및 방법<br>18. 기대성과 및 활용방안<br>19. 연구원 편성표<br>20. 참여연구원 작성안<br>21. 연구비 소요명세서 작성안<br>22. 제안참여 신청서 반영안<br>23. 청렴·확약·보안서약 반영안<br>24. 실적증명 및 마감 체크리스트<br>25~30. 서식 반영 및 최종정리 페이지"
          ]
        ],
      )}
      ${noteBox("원본 제출본에서는 회사명, 대표자, 실적, 연구원 실명, 직인, 예산 세부산식 등 회사 고유정보를 최종 반영합니다. 평가용 제출본은 식별정보를 삭제한 버전으로 별도 편집합니다.")}
    `,
  ),
);

pages.push(sectionCover("03", "사업이해 및 제안개요", "본 장에서는 사업목적과 과업의 본질을 재정의하고, 제안의 방향을 평가항목 중심으로 정리합니다.", "PART 01"));

const pageDefs = [
  {
    no: "04",
    title: "사업 개요",
    intro: "사업명, 목적, 범위, 기간, 예산 등 발주처가 제시한 핵심 요건을 제안 구조에 맞춰 정리합니다.",
    html: `
      ${leadBox("국외 한국문화유산 자료 목록화 연구는 자료의 체계적 정리, 디지털 보존, 향후 활용기반 마련을 동시에 달성해야 하는 조사·연구·보존 복합형 과업입니다.")}
      ${simpleTable(
        ["항목", "내용"],
        [
          ["사업명", "국외 한국문화유산 자료 목록화 연구"],
          ["사업목적", "1910~20년대 한국에 체류한 외국인 연구자가 1970년대까지 남긴 자료를 체계적으로 정리하여 학술적 기반을 구축하고, 관리·활용 및 디지털 보존의 기초자료를 확보"],
          ["핵심 과업", "자료 전체 목록화, 기본 정보 정리, 간략 해제 작성, 디지털 이미지 확보, 검수 및 보고서 제출"],
          ["촬영 기준", "전문가에 의한 2,000컷 이상 촬영, 6천만 화소 이상, 300dpi 이상"],
          ["특수 요구", "독일어 및 수기 자료 판독 전문성, 문화유산 안전 취급, 항온·항습 및 보안대책 확보"],
          ["사업기간", "계약체결일로부터 2026년 8월 31일까지"],
          ["사업예산", "금 35,000,000원(부가가치세 포함)"],
        ],
      )}
      ${noteBox("본 과업은 단순 사무정리형 용역이 아니라 연구, 기록화, 촬영, 검수, 보안이 결합된 고난도 학술연구용역입니다.")}
    `,
  },
  {
    no: "05",
    title: "사업 목적과 핵심과업 이해",
    intro: "발주처가 왜 이 사업을 추진하는지, 무엇이 가장 중요한지부터 제안의 논리를 시작합니다.",
    html: `
      <p style="font-size:9.7pt; line-height:1.74; color:#203244; margin:0 0 7pt;">이번 과업의 1차 목적은 자료군 전체의 구조를 파악하고 체계적으로 목록화하는 데 있습니다. 중요한 것은 개별 자료의 단편적 설명이 아니라, 향후 데이터베이스 구축과 후속 연구에 재사용 가능한 수준의 메타데이터를 확보하는 일입니다.</p>
      <p style="font-size:9.7pt; line-height:1.74; color:#203244; margin:0 0 7pt;">2차 목적은 실물자료의 보존 부담을 줄이면서 안전하게 활용할 수 있는 디지털 이미지를 확보하는 데 있습니다. 회화, 도자, 사진, 가구, 문서가 혼재한 자료군의 특성상 유형별 촬영 방식과 취급 기준이 달라야 하며, 이 차이를 관리하는 것이 실무 성패를 좌우합니다.</p>
      <p style="font-size:9.7pt; line-height:1.74; color:#203244; margin:0 0 8pt;">3차 목적은 독일어와 수기 자료를 포함한 문서군의 해독 기반을 마련하는 데 있습니다. 단순 OCR이나 일반 사무인력 중심 접근으로는 정확한 판독과 해제 작성이 어렵기 때문에 전문 인력과 검수 체계가 필수적입니다.</p>
      ${cardGrid([
        { title: "핵심과업 1", body: "자료 전체 목록화와 기본 정보 정리" },
        { title: "핵심과업 2", body: "전문가 고해상도 디지털 촬영" },
        { title: "핵심과업 3", body: "판독·해독, 검수, 활용 가능한 성과물 구조화" },
      ], 3)}
    `,
  },
  {
    no: "06",
    title: "평가항목 대응전략",
    intro: "기술능력 80점 중 연구역량 30점, 연구계획 50점의 배점 논리에 맞춰 제안 포인트를 정리합니다.",
    html: simpleTable(
      ["평가영역", "세부평가항목", "본 제안의 대응 포인트"],
      [
        ["연구역량", "연구실적", "문화유산 조사·목록화·학술연구·디지털 아카이빙 실적을 선별하여 유사용역 중심으로 제시"],
        ["연구역량", "연구능력", "독일어 자료 판독, 기록화, 메타데이터 설계, 디지털 촬영·파일관리까지 포함하는 복합 전문성 구조 제시"],
        ["연구역량", "연구진 구성", "책임연구원-공동연구원-연구원-보조원-외부전문가로 역할을 분리하고 교차검토 구조 설계"],
        ["연구계획", "계획서 부합성", "과업내용서의 목록화, 판독, 촬영, 보안, 성과물 요건을 모두 반영"],
        ["연구계획", "연구목적·내용·방법·실행", "3대 목적, 4단계 프로세스, 5개월 내 수행 가능한 일정과 활용방향을 구체적으로 제시"],
      ],
    ) + quoteBox("제안서의 강점은 예쁘게 보이는 문장이 아니라, 과업을 끝까지 수행할 수 있는 실행 체계에 있어야 합니다."),
  },
];

for (const def of pageDefs) {
  pages.push(contentPage(def.no, def.title, def.intro, def.html, def.label ?? ""));
}

pages.push(sectionCover("07", "조사설계 및 연구방법론", "본 장에서는 목록화, 판독, 촬영, 보안, 검수까지 이어지는 실제 수행 프레임을 제시합니다.", "PART 02"));

const laterPages = [
  {
    no: "08",
    title: "수행 프레임",
    intro: "착수부터 납품까지 4단계 프레임으로 과업을 운영하여 일정과 품질을 동시에 관리합니다.",
    html:
      leadBox("본 연구는 착수 및 기준 설계 → 목록화·판독·촬영 본작업 → 보완 및 중간점검 → 최종 검수 및 납품의 4단계 구조로 수행합니다.") +
      simpleTable(
        ["단계", "주요 기간", "핵심업무", "주요 산출물"],
        [
          ["1단계", "착수 ~ 1개월차", "작업기준 수립, 목록화 항목 정의, 시범목록화, 시범촬영, 위험요인 점검", "착수계획, 기준표, 체크리스트"],
          ["2단계", "2~3개월차", "전체 자료 목록화, 독일어·수기자료 판독, 본촬영, 주간 검수", "엑셀 목록, 촬영대장, 판독 메모"],
          ["3단계", "4개월차", "누락 보완, 재촬영, 해제 고도화, 중간보고, 의견반영", "중간보고서, 수정이력표"],
          ["4단계", "5개월차", "최종 검수, 보고서 작성, 저장매체 정리, 최종보고회 및 납품", "최종보고서, 편집본, 외장저장매체 2개"],
        ],
      ) +
      noteBox("최종보고서 초안은 계약만료 15일 전까지 제출하는 기준으로 내부 마감일을 별도로 운영합니다."),
  },
  {
    no: "09",
    title: "목록화 기준",
    intro: "자료 전체 목록화는 향후 검색과 활용의 기반이므로 항목 정의와 표기원칙을 먼저 통일합니다.",
    html:
      cardGrid([
        { title: "메타데이터 핵심 항목", body: "관리번호, 자료명, 유형, 재질, 크기, 제작·작성 시기, 작성 언어, 수기 여부, 간략 해제, 소장처 정보, 비고" },
        { title: "표기 원칙", body: "명칭은 현행 사용명과 원제·원어 병기를 병행하고, 시기와 인명·지명은 확인 가능한 범위 내에서 근거 중심으로 표기합니다." },
      ]) +
      simpleTable(
        ["분류 기준", "적용 방식"],
        [
          ["유형 분류", "회화, 도자, 사진, 가구, 문서 등 1차 분류 후 세부 매체별 하위분류 적용"],
          ["관리번호 체계", "자료군-유형-일련번호 구조의 고유 식별번호를 부여하여 목록·이미지·검수표를 연계"],
          ["간략 해제", "자료의 내용, 맥락, 주요 키워드, 판독 난이도 및 활용 가능성을 3~5문장 내외로 정리"],
          ["검수 필드", "필수항목 누락 여부, 표기 일관성, 이미지 연계 여부, 판독상태, 비고 입력 여부를 함께 점검"],
        ],
      ),
  },
  {
    no: "10",
    title: "독일어·수기 자료 판독 방법",
    intro: "문서자료의 난이도를 반영하여 단계별 판독과 교차검토 체계를 운영합니다.",
    html:
      leadBox("판독 대상 문서는 원문 확인 → 초벌 판독 → 핵심 정보 추출 → 책임연구원 검토의 4단계로 관리하며, 불명확 구간은 무리하게 단정하지 않고 주석 처리합니다.") +
      simpleTable(
        ["단계", "수행 내용"],
        [
          ["원문 확인", "촬영 전후 문서 상태, 페이지 순서, 누락 여부를 확인하고 자료 식별정보를 목록과 연계"],
          ["초벌 판독", "독일어와 수기 판독이 가능한 연구인력이 가독 가능한 부분을 우선 전사하고 핵심어를 추출"],
          ["정보 구조화", "인명, 지명, 연대, 사건, 문헌 성격, 주제어 등을 구조화하여 간략 해제와 목록 항목에 반영"],
          ["교차검토", "판독 난이도가 높은 문서는 공동연구원 또는 외부전문가 검토를 거쳐 오독 가능성을 축소"],
        ],
      ),
  },
  {
    no: "11",
    title: "디지털 촬영 계획",
    intro: "매체별 특성에 맞춘 촬영 계획과 파일관리 기준을 동시에 설계합니다.",
    html:
      cardGrid([
        { title: "촬영 기준", body: "6천만 화소 이상, 300dpi 이상, 유형별 조명과 배경 조건 최적화" },
        { title: "촬영 물량", body: "회화, 도자, 사진, 문서 등 전체 대상에 대해 2,000컷 이상 확보" },
        { title: "파일 구조", body: "원본보존용 / 작업용 / 보고서 삽입용으로 분리 저장" },
      ], 3) +
      simpleTable(
        ["자료 유형", "촬영 포인트", "파일 관리"],
        [
          ["회화·가구", "전면, 측면, 세부 디테일, 훼손·특이부위 기록", "정면컷, 디테일컷, 보조컷 구분"],
          ["도자", "전체 형상, 바닥면, 문양·명문부 촬영", "회전각도별 컷 분리"],
          ["사진", "원본 상태와 정보가 드러나는 가장자리·뒷면까지 확인", "앞면/뒷면 연동 저장"],
          ["문서", "전체면과 중요 세부면 촬영, 페이지 순서 유지", "페이지 번호 기반 연속 파일명 부여"],
        ],
      ),
  },
  {
    no: "12",
    title: "보안·보존·백업 계획",
    intro: "자료 안전을 최우선에 두고 작업환경, 접근권한, 저장체계를 함께 관리합니다.",
    html:
      leadBox("문화유산과 문서자료의 안전을 위해 작업공간, 인력, 장비, 데이터 모두에 보안과 보존 기준을 적용합니다.") +
      cardGrid([
        { title: "작업환경", body: "항온·항습 및 보안대책을 갖춘 공간 또는 동등 수준의 작업환경을 확보하고, 자료 이동 최소화 원칙을 적용합니다." },
        { title: "접근권한", body: "참여연구진별 접근권한을 구분하고, 보안서약서 제출, 외부저장장치 사용 통제, 대외 공유 금지 원칙을 운영합니다." },
        { title: "데이터 백업", body: "원본 파일은 작업본과 분리하고 저장장치 이중화와 주기적 백업으로 분실·손상 위험을 줄입니다." },
        { title: "사고 대응", body: "자료 훼손, 분실, 누출, 파일 손상 가능성에 대비해 즉시 보고체계와 복구 우선순위를 문서화합니다." },
      ], 2) +
      quoteBox("원자료의 안전은 품질보다 앞서는 전제조건입니다. 본 제안은 모든 작업이 안전 확보 후 수행되도록 설계합니다."),
  },
];

for (const def of laterPages) {
  pages.push(contentPage(def.no, def.title, def.intro, def.html, def.label ?? ""));
}

pages.push(sectionCover("13", "수행체계 및 운영관리", "본 장에서는 실제 과업을 움직이는 조직, 보고 체계, 품질관리, 일정 운영 방식을 보여줍니다.", "PART 03"));

const morePages = [
  {
    no: "14",
    title: "수행 조직과 역할",
    intro: "책임연구원을 중심으로 목록화, 판독, 촬영, 검수, 행정지원이 유기적으로 연결되는 구조를 설계합니다.",
    html: simpleTable(
      ["구분", "인원", "주요 역할"],
      [
        ["책임연구원", "[기입]명", "과업 총괄, 대외 협의, 최종 검수, 연구방법론 관리, 보고서 총괄"],
        ["공동연구원", "[기입]명", "자료 분류·목록화 관리, 독일어 자료 판독, 간략 해제 작성, 교차검토"],
        ["연구원", "[기입]명", "기초 목록 입력, 자료 조사, 이미지 정리, 메타데이터 점검, 재촬영 보완"],
        ["연구보조원", "[기입]명", "촬영대장 정리, 파일 정리, 회의자료 편집, 행정지원"],
        ["외부전문가", "[필요시]", "독일어 고문서 판독 자문, 문화유산 촬영 및 보존 환경 자문"],
      ],
    ) + cardGrid([
      { title: "총괄 원칙", body: "의사결정은 책임연구원 단일창구로 관리하되, 품질검수는 교차검토 체계로 운영합니다." },
      { title: "현장 대응", body: "자료 유형별 책임자를 지정하여 촬영·목록·판독 간 의사소통 지연을 줄입니다." },
    ]),
  },
  {
    no: "15",
    title: "소통·보고 체계",
    intro: "발주처와의 협의, 내부 점검, 이슈관리, 중간·최종보고의 흐름을 명확히 설정합니다.",
    html: cardGrid([
      { title: "착수회의", body: "사업범위, 기준표, 일정, 보안유의사항, 성과물 구조 확정" },
      { title: "주간 점검", body: "진척도, 누락자료, 판독 난이도, 재촬영 필요 여부 공유" },
      { title: "중간보고", body: "진행현황과 보완 필요사항을 발주처와 협의하여 후반 일정에 반영" },
    ], 3) + simpleTable(
      ["보고 단계", "주요 내용", "운영 방식"],
      [
        ["수시 보고", "일정 지연 가능성, 특이사항, 자료 안전 관련 이슈 즉시 공유", "책임연구원 단일창구 보고"],
        ["정기 공유", "주간 진척도, 작업량, 검수결과, 다음 주 계획 공유", "주간 보고서 또는 메일"],
        ["중간보고", "목록화 진행률, 촬영률, 판독 현황, 보완계획 제시", "보고서 + 회의"],
        ["최종보고", "성과물 설명, 활용 제언, 향후 후속과제 제시", "최종보고회 + 납품"],
      ],
    ),
  },
  {
    no: "16",
    title: "상세 수행 프로세스",
    intro: "기획에서 납품까지 전 공정의 흐름을 하나의 프로세스로 정리합니다.",
    html: simpleTable(
      ["단계", "주요 업무", "체크포인트"],
      [
        ["1. 기준 수립", "항목 정의, 파일명 규칙, 관리번호 체계, 작업지침서 작성", "발주처 협의 완료 여부"],
        ["2. 예비조사", "자료군 사전 파악, 유형 분류, 우선순위 설정", "누락 없는 대상목록 확보"],
        ["3. 목록화", "기본정보 입력, 간략 해제 작성, 언어·수기 여부 표기", "필수항목 누락 여부"],
        ["4. 판독", "독일어·수기자료 전사, 핵심정보 추출, 주석 처리", "오독 위험 자료 별도표시"],
        ["5. 촬영", "유형별 촬영, 파일 저장, 촬영대장 기록", "재촬영 필요컷 확인"],
        ["6. 품질검수", "목록-이미지 연계 점검, 오탈자·중복·누락 수정", "검수표 작성 완료"],
        ["7. 보고서 작성", "중간·최종 보고서, 목록표, 활용 제언 작성", "내부 검토 완료 여부"],
        ["8. 납품", "편집가능 파일, 이미지 원본, 저장장치 2개 제출", "납품 체크리스트 충족"],
      ],
    ) + noteBox("프로세스의 핵심은 각 공정을 분절하지 않고, 목록·판독·촬영·검수가 항상 서로 대조되도록 운영하는 데 있습니다."),
  },
  {
    no: "17",
    title: "품질관리 및 리스크 대응",
    intro: "오류와 누락을 줄이기 위한 검수 체계와 주요 위험요인에 대한 대응방안을 제시합니다.",
    html: cardGrid([
      { title: "품질관리 4단계", body: "입력 검수 → 판독 검수 → 이미지 검수 → 납품 전 종합검수의 4단계 체계를 운영합니다." },
      { title: "검수 도구", body: "필수항목 점검표, 촬영대장, 수정이력표, 납품 체크리스트를 함께 운영합니다." },
    ]) + simpleTable(
      ["예상 리스크", "대응방안"],
      [
        ["독일어 수기자료 판독 난이도 증가", "이중 판독, 외부전문가 자문, 불명확 구간 주석 처리"],
        ["자료 유형별 촬영 난이도 차이", "시범촬영 후 본작업, 자료군별 촬영 체크리스트 운영"],
        ["자료 훼손 및 안전사고 우려", "취급교육, 장갑·받침대 사용, 접근권한 통제, 이동 최소화 원칙 적용"],
        ["누락·중복·파일명 오류", "관리번호 기반 연계, 일일 검수표, 주간 점검회의로 즉시 수정"],
        ["납품 직전 일정 지연", "내부 마감일을 법정기한보다 앞당겨 설정하고, 초안은 만료 15일 전 제출 기준으로 역산 관리"],
      ],
    ),
  },
  {
    no: "18",
    title: "추진 일정 및 성과물",
    intro: "계약기간을 기준으로 5개월 내외 집중 수행형 일정과 제출 성과물을 정리합니다.",
    html: simpleTable(
      ["세부연구내용", "1개월차", "2개월차", "3개월차", "4개월차", "5개월차"],
      [
        ["착수협의 및 기준 수립", "●", "●", "", "", ""],
        ["자료 예비조사 및 분류 확정", "●", "●", "", "", ""],
        ["전체 목록화 본작업", "", "●", "●", "●", ""],
        ["독일어·수기자료 판독", "", "●", "●", "●", "●"],
        ["고해상도 촬영", "", "●", "●", "●", "●"],
        ["중간 점검 및 보완", "", "", "●", "●", ""],
        ["최종보고서 초안 작성", "", "", "", "●", "●"],
        ["최종보고회 및 납품", "", "", "", "", "●"],
      ],
    ) + cardGrid([
      { title: "중간보고 단계", body: "중간보고서 인쇄본 10부, 진행현황 자료, 보완계획" },
      { title: "최종보고 단계", body: "최종보고서 초안 10부, 최종보고서 인쇄본 10부, 편집가능 파일, 원본파일, 저장장치 2개" },
    ]),
  },
];

for (const def of morePages) {
  pages.push(contentPage(def.no, def.title, def.intro, def.html, def.label ?? ""));
}

pages.push(sectionCover("19", "제3호 서식 반영용 연구계획서", "본 장은 제안요청서 제3호 서식의 핵심 항목을 그대로 살리되, 수정 가능한 레이아웃으로 재구성한 페이지입니다.", "PART 04"));

const formPages = [
  {
    no: "20",
    title: "연구 목적 및 필요성",
    intro: "제3호 서식 1번 항목에 대응하는 본문입니다.",
    html:
      leadBox("본 연구의 목적은 국외 한국문화유산 관련 자료군의 전모를 체계적으로 정리하여 학술적 기반을 구축하고, 향후 관리·활용 및 디지털 보존을 위한 실질적 기초자료를 확보하는 데 있습니다.") +
      `<p style="font-size:9.7pt; line-height:1.74; color:#203244; margin:0 0 7pt;">1910~20년대 한국에 체류하며 한국학 연구를 수행한 외국인 연구자가 1970년대까지 남긴 자료는 한국문화유산 연구의 사료적 가치가 높지만, 자료군 전체를 통합적으로 정리한 기반이 부족합니다. 따라서 자료의 체계적 목록화는 학술연구의 출발점이자 향후 보존·활용 정책의 기반이 됩니다.</p>
      <p style="font-size:9.7pt; line-height:1.74; color:#203244; margin:0 0 7pt;">대상 자료에는 회화, 도자, 사진, 가구, 문서가 혼재되어 있어 자료별 관리와 활용 방식이 달라질 수밖에 없습니다. 이 차이를 구조적으로 정리하지 않으면 목록화의 활용도와 디지털 보존의 효율이 떨어집니다.</p>
      <p style="font-size:9.7pt; line-height:1.74; color:#203244; margin:0 0 7pt;">특히 문서자료는 독일어와 수기 자료가 다수 포함되어 있어 일반적 서지정리 수준을 넘어선 전문성이 요구됩니다. 따라서 본 과업은 문화유산 조사, 기록화, 독일어 판독, 디지털 촬영, 보안과 보존 환경 이해를 모두 갖춘 접근이 필요합니다.</p>`,
  },
  {
    no: "21",
    title: "연구내용 및 범위",
    intro: "제3호 서식 2번 항목에 대응하는 본문입니다.",
    html:
      simpleTable(
        ["구분", "주요 내용", "산출물"],
        [
          ["기초 설계", "목록화 기준 수립, 관리번호 체계 정의, 촬영·보안 체크리스트 마련", "기준표, 작업지침서"],
          ["자료 목록화", "명칭, 크기, 재질, 시기, 언어, 수기 여부, 간략 해제 등 기본 정보 정리", "엑셀 목록, 메타데이터 시트"],
          ["판독 및 해제", "독일어·수기자료의 판독, 핵심 정보 추출, 비고 및 주석 처리", "판독 메모, 간략 해제안"],
          ["디지털 촬영", "유형별 촬영 계획에 따른 고해상도 이미지 확보, 파일명 규칙 적용", "원본 이미지, 촬영대장"],
          ["검수 및 보고", "목록-이미지 연계 검수, 중간보고, 최종보고회, 편집본 납품", "검수표, 보고서, 저장장치"],
        ],
      ) +
      noteBox("연구보고서의 예상 목차는 연구 개요, 대상 자료의 성격과 분류 기준, 목록화 방법론, 독일어·수기 자료 판독 기준, 유형별 촬영 방법, 구축 결과, 향후 활용 제언으로 구성합니다."),
  },
  {
    no: "22",
    title: "추진전략 및 방법",
    intro: "제3호 서식 3번 항목에 대응하는 본문입니다.",
    html:
      cardGrid([
        { title: "전략 1. 통일 기준", body: "목록화 항목, 표기원칙, 파일명 규칙, 관리번호 체계를 먼저 확정하여 전체 작업의 일관성을 확보합니다." },
        { title: "전략 2. 전문가 중심 판독", body: "독일어와 수기자료 판독 역량을 갖춘 인력을 배치하고, 난이도 높은 자료는 교차검토와 자문을 병행합니다." },
        { title: "전략 3. 유형별 촬영", body: "회화·도자·사진·문서 등 자료 특성별로 촬영 세팅과 취급 방식을 차등 적용합니다." },
        { title: "전략 4. 다층 검수", body: "입력, 판독, 이미지, 납품 전 종합검수의 4단계 품질관리 체계를 운영합니다." },
      ]) +
      `<p style="font-size:9.7pt; line-height:1.74; color:#203244; margin:8pt 0 7pt;">관련정보 수집은 발주처 협의, 내부 기준 설계, 자료 예비조사, 촬영대장과 검수표 구축을 통해 선행합니다. 전문가 확보는 책임연구원과 공동연구원을 중심으로 수행하되, 필요 시 외부전문가 자문체계를 연동합니다. 국내외 타 기관과의 협조가 필요한 사항은 발주처와 사전 협의를 거쳐 단계별로 추진합니다.</p>
      <p style="font-size:9.7pt; line-height:1.74; color:#203244; margin:0 0 7pt;">접근방법은 자료군 파악 → 목록화 → 판독 → 촬영 → 검수 → 보고서 및 납품의 순차 구조이나, 실무상으로는 목록·판독·촬영이 서로 대조되도록 병행 운영하는 방식으로 설계합니다.</p>`,
  },
  {
    no: "23",
    title: "기대성과 및 활용방안",
    intro: "제3호 서식 4번 항목에 대응하는 본문입니다.",
    html:
      leadBox("본 과제의 기대성과는 단순 결과보고서 제출이 아니라, 발주처가 이후에도 재사용할 수 있는 연구·관리·보존의 기초 기반을 만드는 데 있습니다.") +
      simpleTable(
        ["기대성과", "활용방안"],
        [
          ["자료 전체 구조의 가시화", "후속 학술연구, 조사 확대, 추가 과제 발굴의 기초자료로 활용"],
          ["메타데이터 기반 확보", "목록 DB, 검색 시스템, 아카이브 구축의 기반자료로 활용"],
          ["고해상도 디지털 이미지 확보", "실물 접근 부담을 줄이고 전시·교육·연구용 디지털 대체자료로 활용"],
          ["독일어·수기자료 판독 기초 마련", "후속 번역·심화 해제·학술논문 작성의 출발점으로 활용"],
          ["관리체계 표준화", "장기 보존정책, 우선순위 설정, 자료 관리 매뉴얼 정비에 활용"],
        ],
      ) +
      quoteBox("연구결과의 실제적 활용 가능성은 읽을 수 있는 보고서가 아니라 다시 쓰일 수 있는 데이터와 이미지를 남기는 데서 나옵니다."),
  },
  {
    no: "24",
    title: "연구원 편성표",
    intro: "제3호 서식 5번 항목에 대응하는 본문입니다.",
    html:
      simpleTable(
        ["부문", "구성", "주요 역할"],
        [
          ["총괄·품질관리 부문", "책임연구원, 공동연구원", "과업 총괄, 대외 협의, 최종 검수, 품질관리 기준 확정"],
          ["자료 목록화 부문", "공동연구원, 연구원", "분류체계 적용, 메타데이터 입력, 간략 해제 작성"],
          ["독일어 판독 부문", "공동연구원", "원문 확인, 판독, 핵심 정보 추출, 주석 처리"],
          ["디지털 촬영 부문", "연구원, 연구보조원", "유형별 촬영, 파일 저장, 촬영대장 관리"],
          ["행정·편집 부문", "연구보조원", "회의자료, 보고서 편집, 저장장치 정리, 납품 행정"],
        ],
      ) +
      cardGrid([
        { title: "책임연구원 요건", body: "문화유산 조사·기록화 경험과 연구총괄 능력을 갖춘 인력을 배치합니다." },
        { title: "공동연구원 요건", body: "독일어 자료 해독, 간략 해제, 메타데이터 관리가 가능한 인력을 우선 배치합니다." },
      ]),
  },
  {
    no: "25",
    title: "참여연구원 작성안",
    intro: "책임연구원·공동연구원·연구원·연구보조원 이력기재를 위한 반영 포인트를 정리합니다.",
    html:
      `<p style="font-size:9.7pt; line-height:1.74; color:#203244; margin:0 0 7pt;">실제 제출본에서는 책임연구원, 공동연구원, 연구원, 연구보조원, 외부 위촉연구원 순으로 제안요청서 양식을 복사하여 인원별로 기재합니다. 최근 5년 관련 실적은 문화유산 조사, 해외자료 목록화, 디지털 아카이빙, 독일어 자료 연구, 고문서 판독 등 유사성이 높은 실적 중심으로 10개 이내 선별하는 것이 바람직합니다.</p>` +
      simpleTable(
        ["기재 항목", "작성 포인트"],
        [
          ["인적사항", "실제 제출본 기준 성명, 영문명, 직위, 소속, 연락처를 정확히 반영"],
          ["학력", "고등학교 이상 학력 중 연구 주제와의 관련성이 드러나는 학력 우선 정리"],
          ["주요 경력", "문화유산 조사, 기록물 관리, 해외자료 연구, 디지털화, 촬영 관련 경력 중심으로 요약"],
          ["주요 연구 실적", "관련 분야 실적 10개 이내, 역할과 과업 유사성이 드러나도록 기재"],
        ],
      ) +
      noteBox("평가용 제안서에는 참여연구원 실명과 기관 식별정보를 노출하지 않는 편집본을 별도 제작해야 합니다."),
  },
  {
    no: "26",
    title: "연구비 소요명세서 작성안",
    intro: "제3호 서식 7번 항목에 대응하는 작성 가이드형 페이지입니다.",
    html:
      leadBox("예산 총액은 35,000천원 기준으로 유지하되, 실제 제출 전에는 기관 단가표·참여율·실투입 인력·간접비 기준에 따라 정교하게 확정해야 합니다.") +
      simpleTable(
        ["비목", "작성 포인트"],
        [
          ["인건비", "책임연구원, 공동연구원, 연구원, 연구보조원의 월급여·참여개월수·참여율을 근거로 산정"],
          ["경비", "출장여비, 인쇄복사비, 전문가활용비, 자료수집비, 회의비, 번역·통역·속기료 등 세부 기준 명시"],
          ["간접비", "(인건비+경비) x 6% 이하 기준 준수"],
          ["부가가치세", "기관 특성과 계약기준에 따라 산정하되 총사업예산 범위 내에서 정합성 확보"],
        ],
      ) +
      cardGrid([
        { title: "권장 항목", body: "독일어 판독 자문, 고해상도 촬영, 저장장치, 보고서 인쇄, 검수회의 운영 비용을 누락 없이 반영" },
        { title: "주의사항", body: "과도한 수치나 근거 없는 일괄배분은 피하고, 실제 수행 가능한 계획과 일치하도록 작성" },
      ]),
  },
];

for (const def of formPages) {
  pages.push(contentPage(def.no, def.title, def.intro, def.html, "FORM 3"));
}

pages.push(sectionCover("27", "서식 반영 및 제출 마감", "본 장에서는 제안서 제출 시 필요한 서식, 서약서, 실적증명, 최종 점검사항을 정리합니다.", "PART 05"));

const finalPages = [
  {
    no: "28",
    title: "제안참여 신청서 및 신청서 반영안",
    intro: "제1호·제3호 서식 입력 시 바로 치환해야 할 항목을 정리합니다.",
    html: simpleTable(
      ["서식", "필수 기입사항", "유의사항"],
      [
        ["제1호 서식 / 제안참여 신청서", "업체명, 사업자등록번호, 대표자, 전화번호, 소재지, 대표자 직인", "원본 제안서에만 실명과 직인 반영"],
        ["제2호 서식 / 표지", "접수번호 공란, 기관명, 대표자", "평가용은 업체 식별정보 삭제"],
        ["제3호 서식 / 학술연구용역 신청서", "책임연구원, 소속, 전공, 연구기간, 참여인원, 기관장 직인", "실제 인력과 증빙자료 일치 여부 확인"],
      ],
    ) + noteBox("현재 문서에는 회사 고유정보를 [기입] 형태로 남겨 두었습니다. 실제 제출본에서는 사업자등록증, 법인등기부등본, 조달청 등록증, 중소기업확인서 등 별첨자료와 동일한 값으로 치환해야 합니다."),
  },
  {
    no: "29",
    title: "청렴·확약·보안서약 및 실적증명 반영안",
    intro: "제4호~제7호 서식과 증빙자료 정합성을 맞추기 위한 체크 포인트를 정리합니다.",
    html:
      cardGrid([
        { title: "청렴계약이행서약서", body: "대표자 직인, 날짜, 서약 문구를 원문 그대로 유지하고 회사명만 정확히 반영합니다." },
        { title: "확약서·보안서약서", body: "대표자명, 회사명, 주소, 연락처, 법인등록번호 등 기본정보의 일치 여부를 확인합니다." },
      ]) +
      simpleTable(
        ["항목", "체크 포인트"],
        [
          ["실적증명서", "문화유산 조사·목록화·해외자료 연구·디지털 아카이빙 등 과업 유사성이 높은 실적 중심으로 선별"],
          ["민간실적 증빙", "계약서, 세금계산서, 발주처 확인서 등 근거자료 동시 제출"],
          ["중소기업·소상공인 확인서", "제출마감일 전일까지 유효한 증빙인지 확인"],
          ["사용인감계", "조달청 등록 인감과 실제 날인 인감이 다를 경우 반드시 추가 제출"],
        ],
      ) +
      quoteBox("서식은 별첨이지만, 제안서 본문과 증빙자료의 수치·명칭·직위가 어긋나면 신뢰도가 즉시 떨어집니다. 최종 제출 전 교차점검이 필수입니다."),
  },
  {
    no: "30",
    title: "최종 마감 체크리스트",
    intro: "제출 직전 반드시 확인해야 할 편집·서식·증빙·평가용 분리 항목을 정리합니다.",
    html:
      leadBox("현재 문서는 디자인을 유지하면서도 텍스트 수정이 가능하도록 한글이 잘 받아들이는 표·문단 중심 레이아웃으로 재구성한 버전입니다.") +
      cardGrid([
        { title: "본문 체크", body: "목차와 실제 페이지 흐름 일치 여부, 사업명·기간·예산 오기 여부, 독일어 판독·보안·촬영 기준 문구 반영 여부, 연구계획서 항목 누락 여부를 점검합니다." },
        { title: "증빙 체크", body: "실적증명서, 사업자등록증, 등기부등본, 중소기업확인서, 청렴계약이행서약서, 확약서, 보안서약서, 직인 및 대표자명 일치 여부를 점검합니다." },
      ]) +
      `<p style="font-size:9.7pt; line-height:1.74; color:#203244; margin:8pt 0 7pt;">다음 단계에서는 회사 정보 반영, 원본/평가용 분리 편집, 실적증명 첨부, 발표자료 요약본 제작 순으로 이어가면 효율적입니다.</p>`,
  },
];

for (const def of finalPages) {
  pages.push(contentPage(def.no, def.title, def.intro, def.html, def.label ?? ""));
}

if (pages.length !== 30) {
  throw new Error(`Expected 30 pages, got ${pages.length}`);
}

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>국외 한국문화유산 자료 목록화 연구 제안서</title>
<style>
body{margin:0;padding:0;background:#fff;color:#1f3552;font-family:'Batang','Malgun Gothic',sans-serif;font-size:10pt;line-height:1.75}
</style>
</head>
<body>
${pages.join("\n")}
</body>
</html>`;

fs.writeFileSync(outPath, "\uFEFF" + html, "utf8");
console.log(outPath);
