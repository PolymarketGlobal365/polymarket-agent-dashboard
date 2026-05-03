import fs from "node:fs";
import path from "node:path";

const outPath = path.resolve("output/proposal_2026_korean_artist_today_designed_editable.html");
fs.mkdirSync(path.dirname(outPath), { recursive: true });

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

const pill = (text) =>
  `<span style="display:inline-block; margin:0 6px 7px 0; padding:4px 10px; border:1px solid #cad6e2; border-radius:18px; background:#ffffff; color:#21486f; font-size:9pt;">${esc(
    text,
  )}</span>`;

const simpleTable = (headers, rows) => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin-top:8pt;">
  <tr>${headers
    .map(
      (header) =>
        `<td style="border:1px solid #c7d2dc; background:#eef4f8; color:#17375a; font-size:9.5pt; font-weight:bold; padding:7pt 8pt; vertical-align:top;">${esc(
          header,
        )}</td>`,
    )
    .join("")}</tr>
  ${rows
    .map(
      (row) => `<tr>${row
        .map(
          (cell) =>
            `<td style="border:1px solid #c7d2dc; color:#203244; font-size:9.3pt; line-height:1.65; padding:7pt 8pt; vertical-align:top;">${cell}</td>`,
        )
        .join("")}</tr>`,
    )
    .join("")}
</table>`;

const bulletList = (items) =>
  `<ul style="margin:6pt 0 0 18pt; padding:0;">${items
    .map(
      (item) =>
        `<li style="margin:0 0 5pt; color:#203244; font-size:9.6pt; line-height:1.72;">${esc(item)}</li>`,
    )
    .join("")}</ul>`;

const noteBox = (text) =>
  `<div style="margin-top:8pt; padding:9pt 11pt; border:1px dashed #b8c3cf; background:#fbfcfd; color:#5a6d80; font-size:9pt; line-height:1.72;">${esc(
    text,
  )}</div>`;

const leadBox = (text) =>
  `<div style="margin:0 0 10pt 0; padding:10pt 12pt; border-left:4px solid #396387; background:#f5f9fc; color:#29445f; font-size:10pt; line-height:1.76;">${esc(
    text,
  )}</div>`;

const quoteBox = (text) =>
  `<div style="margin-top:8pt; padding:10pt 12pt; border-left:4px solid #2c7a74; background:#f4faf9; color:#28455b; font-size:9.4pt; line-height:1.72;">${esc(
    text,
  )}</div>`;

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

let html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>2026년 코리안 아티스트 투데이 자료 기획 및 제작 대행 제안서</title>
<style>
  body { margin:0; padding:0; font-family:"Malgun Gothic", sans-serif; background:#ffffff; }
</style>
</head>
<body>`;

html += `
${pageOpen()}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d7dfe8; background:linear-gradient(140deg,#fbfcfe 0%,#f2f6fa 55%,#ecf2f7 100%);">
  <tr><td style="padding:24mm 16mm 18mm 16mm;">
    <div style="display:inline-block; border:1px solid #8ea0b4; color:#1e3d62; font-size:9pt; letter-spacing:1px; padding:5px 10px; margin-bottom:18mm;">OFFICIAL BID PROPOSAL / DESIGNED EDITABLE VERSION</div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px dashed #90a2b8; background:#ffffff; margin-bottom:14pt;">
      <tr><td style="padding:12pt 14pt;">
        <div style="font-size:25pt; font-weight:bold; color:#17375a; line-height:1.35; margin-bottom:8pt;">2026년 코리안 아티스트 투데이 자료 기획 및 제작 대행</div>
        <div style="font-size:12pt; color:#5b748f; line-height:1.78;">Korean Artist Today의 아카이브 운영, 기획형 발간자료 제작, 국·영문 등록, 카드뉴스 확산을 통합 수행하는 연간 실행 제안서</div>
      </td></tr>
    </table>
    <div style="margin-bottom:14pt;">
      ${[
        "기존 작가 96인 현행화",
        "신규 작가 30인 이내 발굴",
        "연 4회 기획형 발간자료",
        "회당 6건 이상 기사 발행",
        "총 필진 24명 운영",
        "카드뉴스 4회 제작",
      ]
        .map(pill)
        .join("")}
    </div>
    <table width="100%" cellpadding="0" cellspacing="12" border="0">
      <tr>
        <td valign="top" style="width:56%; border:1px solid #d3dae2; background:#f7f9fb; padding:12pt 14pt;">
          <div style="font-size:12pt; color:#17375a; font-weight:bold; margin-bottom:8pt;">제안 방향</div>
          <div style="font-size:10.2pt; color:#203244; line-height:1.8;">본 사업은 단순 원고 제작 사업이 아니라 아카이브 데이터 운영과 동시대 미술 담론 발행을 동시에 수행하는 연간 운영 사업으로 이해하였다. 이에 따라 수집형 자료 관리, 기획형 발간자료 제작, 국·영문 번역 및 등록, 카드뉴스 확산을 하나의 제작 캘린더로 통합 운영한다.</div>
        </td>
        <td valign="top" style="width:44%; border:1px solid #d3dae2; background:#ffffff; padding:12pt 14pt;">
          <div style="font-size:12pt; color:#17375a; font-weight:bold; margin-bottom:8pt;">핵심 원칙</div>
          ${bulletList([
            "정확한 자료 관리",
            "기획력 있는 발간 콘텐츠",
            "국·영문 품질관리",
            "정시 납품 가능한 운영체계",
            "저작권 및 일정 준수",
          ])}
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin-top:12pt;">
      <tr>
        <td style="width:16%; border:1px solid #c7d2dc; background:#eef4f8; padding:7pt 8pt; font-size:9.4pt; font-weight:bold;">사업명</td>
        <td style="width:34%; border:1px solid #c7d2dc; padding:7pt 8pt; font-size:9.4pt;">2026년 코리안 아티스트 투데이 자료 기획 및 제작 대행</td>
        <td style="width:16%; border:1px solid #c7d2dc; background:#eef4f8; padding:7pt 8pt; font-size:9.4pt; font-weight:bold;">제안사</td>
        <td style="width:34%; border:1px solid #c7d2dc; padding:7pt 8pt; font-size:9.4pt;">[제안사명 기입]</td>
      </tr>
      <tr>
        <td style="border:1px solid #c7d2dc; background:#eef4f8; padding:7pt 8pt; font-size:9.4pt; font-weight:bold;">과업기간</td>
        <td style="border:1px solid #c7d2dc; padding:7pt 8pt; font-size:9.4pt;">계약체결일로부터 2026.12.18.까지</td>
        <td style="border:1px solid #c7d2dc; background:#eef4f8; padding:7pt 8pt; font-size:9.4pt; font-weight:bold;">사업예산</td>
        <td style="border:1px solid #c7d2dc; padding:7pt 8pt; font-size:9.4pt;">금 80,000,000원(VAT 포함)</td>
      </tr>
    </table>
  </td></tr>
</table>
${pageClose("01")}
`;

html += contentPage(
  "02",
  "제안 요약",
  "평가자가 가장 빠르게 확인할 수 있도록 사업 이해, 운영 구조, 정량 목표를 요약 정리한다.",
  `
    ${leadBox("본 제안은 Korean Artist Today를 한국 미술의 신뢰도 높은 온라인 아카이브이자 동시대 담론 플랫폼으로 고도화하기 위한 연간 운영계획서이다.")}
    ${simpleTable(
      ["구분", "핵심 제안"],
      [
        ["운영 체계", "월간 등록과 분기 발간을 하나의 연간 캘린더로 통합 운영"],
        ["자료 관리", "기존 96인 현행화, 신규 작가 30인 이내 발굴, 전시·공간·출판물 업데이트"],
        ["발간 기획", "연 4회, 회당 6건 이상 발행 / 총 24명 필진 운영"],
        ["확산 및 품질", "카드뉴스 4회, 국·영문 번역 및 교정·교열, 저작권·일정 관리"],
      ],
    )}
    ${quoteBox("핵심 메시지는 정확한 아카이브 운영, 기획력 있는 동시대 미술 콘텐츠, 국·영문 병행 품질관리, 정시 납품 가능한 연간 운영체계의 네 가지로 일관되게 구성한다.")}
  `,
  "SUMMARY",
);

html += sectionCover("03", "PART 01", "사업 이해", "한국 미술의 자료 축적과 담론 확산을 동시에 실현하는 Korean Artist Today의 사업 취지를 정확히 이해하고, 이를 연간 운영 체계로 구현하는 방향을 제시한다.");

html += contentPage(
  "04",
  "사업 배경 및 추진 필요성",
  "Korean Artist Today는 한국 미술의 국내외 인지도 제고를 위한 공공 플랫폼으로서 자료의 최신성, 정확성, 해석력을 동시에 요구한다.",
  `
    ${leadBox("KAT는 단순 메뉴형 홈페이지가 아니라 아카이브, 시의성 있는 정보 업데이트, 기획 담론이 함께 움직이는 온라인 플랫폼이다.")}
    <p style="font-size:9.6pt; color:#203244; line-height:1.74; margin:0 0 8pt;">한국 미술 자료는 기관, 전시, 기사, 출판 단위로 분산되어 있어 통합적 접근성이 낮다. 이에 따라 작가 활동 이력과 전시·공간·기사·인터뷰를 유기적으로 연결하는 운영형 플랫폼의 필요성이 커지고 있다.</p>
    ${bulletList([
      "신진·중견 작가의 정보 접근성을 높여 한국 미술의 국제 노출을 확대한다.",
      "작가, 작품, 전시, 공간, 기사 정보를 통합적으로 제공해 플랫폼 신뢰도를 높인다.",
      "국·영문 병행 운영으로 해외 이용자의 검색성과 이해도를 제고한다.",
    ])}
  `,
);

html += contentPage(
  "05",
  "Korean Artist Today 플랫폼 이해",
  "플랫폼의 구조를 정확히 이해해야 수집형 자료와 기획형 발간자료를 유기적으로 연결할 수 있다.",
  simpleTable(
    ["구분", "상위 메뉴", "하위 메뉴", "역할"],
    [
      ["수집형", "Archive", "Artists / Artworks / Exhibition / Artspace / Publication", "작가 및 관련 정보의 축적·검색 기능"],
      ["수집형", "Events", "Calendar / News", "시의성 있는 정보 업데이트 기능"],
      ["기획형", "Features", "Insights / Review / Spotlights", "동시대 한국 미술의 담론 및 해석 기능"],
    ],
  ) +
    noteBox("제안사는 Archive의 정합성과 Features의 편집력을 분리하지 않고, 하나의 운영 캘린더 안에서 상호 보완적으로 관리한다."),
);

html += contentPage(
  "06",
  "과업 범위 및 정량 목표",
  "제안요청서의 요구사항을 수행 가능한 운영 지표로 재구성해 실행 가능성을 명확하게 제시한다.",
  simpleTable(
    ["영역", "정량 기준", "운영 목표"],
    [
      ["기존 자료 현행화", "기존 작가 96인 연 1회 현행화", "누락·오류 점검과 최신 활동 반영"],
      ["신규 작가 등록", "30인 이내 / 월 1회 등록", "후보군 제안, 자료 취합·검증·등록"],
      ["전시·행사·출판물", "월 1회 수집·등록", "전시, 공간, 뉴스, 출판물 정보 업데이트"],
      ["국·영문 번역", "월 1회 등록", "전문 용어 기준 번역과 감수 운영"],
      ["기획형 발간", "연 4회 / 회당 6건 이상", "총 24건 이상 기사와 24명 필진 운영"],
      ["확산", "카드뉴스 4회", "발간자료 기반 확산 콘텐츠 제작"],
    ],
  ),
);

html += sectionCover("07", "PART 02", "수집형 자료 운영", "기존 등록 자료의 신뢰도를 높이고 신규 작가·전시·공간·출판물 정보를 지속 반영하기 위해 표준화된 수집·검증·등록 프로세스를 운영한다.");

html += contentPage(
  "08",
  "수집형 자료 관리·등록 총괄 계획",
  "수집형 자료의 목표는 최신 정보의 반영과 누락 없는 정합성 유지이며, 이를 위해 기존 자료 현행화와 신규 자료 수집을 병행 운영한다.",
  `
    ${leadBox("Archive와 Events 메뉴의 자료는 사이트 전체 신뢰도를 좌우하는 핵심 데이터이므로 메뉴별 관리 기준을 사전에 표준화한다.")}
    ${bulletList([
      "Artists·Artworks·Exhibition·Artspace·Publication을 유형별로 분리 관리한다.",
      "Calendar와 News는 월간 리듬으로 정기 업데이트한다.",
      "기등록 자료와 신규 자료의 운영 프로세스를 구분하되 검수 기준은 동일하게 적용한다.",
    ])}
  `,
);

html += contentPage(
  "09",
  "기존 96인 자료 현행화 프로세스",
  "기수집 작가 자료 현행화는 연 1회 일괄 추진하되 분기별 주요 변동 이력을 선제적으로 반영한다.",
  simpleTable(
    ["절차", "세부 내용"],
    [
      ["사전 진단", "기등록 자료 현황 검토 및 갱신 필요 항목 분류"],
      ["자료 요청", "센터 양식에 따라 자료 현행화 안내 및 회신 일정 관리"],
      ["보완 검토", "외부 공개 이력과 교차 확인 후 추가 보완 요청"],
      ["최종 반영", "등록 후 변경 사항 이력표로 관리"],
    ],
  ) +
    noteBox("현행화 작업은 사전 안내 → 1차 회신 → 보완 요청 → 최종 검수의 4단계 구조로 운영하여 회신 편차를 최소화한다."),
);

html += contentPage(
  "10",
  "신규 작가 발굴 기준 및 제안 리스트",
  "신규 작가는 인지도 중심이 아니라 활동 지속성과 플랫폼 적합성을 기준으로 발굴한다.",
  `
    ${bulletList([
      "만 65세 미만 신진·중견 작가 여부",
      "최근 3년 내 주요 전시 및 프로젝트 참여 실적",
      "매체·세대·지역 다양성",
      "국내외 확산 가능성과 자료 확보 가능성",
    ])}
    ${simpleTable(
      ["후보 작가", "주요 매체", "제안 사유"],
      [
        ["김아영", "리서치 기반 영상·설치", "국제 담론 확장성과 동시대성"],
        ["강서경", "조각·회화·설치", "조형 언어의 독자성"],
        ["이미래", "조각·설치", "차세대 국제 무대 확장성"],
        ["정금형", "퍼포먼스·영상", "매체 독창성과 실험성"],
        ["전현선", "회화", "국내외 전시 가시성"],
        ["노상호", "회화·디지털 이미지", "동시대 시각문화 반영"],
      ],
    )}
  `,
);

html += contentPage(
  "11",
  "Exhibition · Artspace · Publication · News 운영 방안",
  "작가 중심 데이터 외에도 전시, 공간, 출판물, 뉴스 정보가 함께 갱신되어야 플랫폼의 탐색성과 신뢰성이 높아진다.",
  simpleTable(
    ["영역", "수집 기준", "운영 방식"],
    [
      ["Exhibition", "등록 작가 참여 전시 우선, 주요 기획전 병행", "월 1회 일정·장소·참여 작가 검토 후 등록"],
      ["Artspace", "국내 주요 미술 공간 및 연계 전시장", "기존 등록 정보 점검 후 변경 항목 반영"],
      ["Publication", "한국 미술 관련 해외 출판물 서지 정보", "출판사·저자·발행연도·ISBN 등 표준 항목 관리"],
      ["News", "한국 미술 관련 국내외 주요 기사", "중복 기사 제외 및 시의성 중심 업데이트"],
    ],
  ),
);

html += contentPage(
  "12",
  "월간 수집·등록 및 번역 프로세스",
  "월별 리듬이 고정되어야 적체 없이 안정적으로 자료가 누적되며, 번역 품질도 함께 확보할 수 있다.",
  simpleTable(
    ["주차", "주요 일정", "산출물"],
    [
      ["1주차", "전월 변동사항 점검 및 신규 조사 계획 수립", "월간 수집 계획표"],
      ["2주차", "작가·전시·공간·출판물 자료 취합", "자료 원본, 출처 목록"],
      ["3주차", "사실 검증, 번역 초안, 등록 원고 정리", "등록 원고, 번역본, 검수표"],
      ["4주차", "최종 등록 및 월간 결과 정리", "등록 완료 목록, 월간 운영 결과표"],
    ],
  ) +
    quoteBox("국·영문 번역은 국문 정리 → 영문 번역 → 감수 → 교정·교열 → 등록의 5단계 프로세스로 운영한다."),
);

html += sectionCover("13", "PART 03", "기획형 발간자료", "기획형 발간자료는 Korean Artist Today의 담론 기능을 강화하는 핵심 영역으로, 회차별 주제 기획과 필진 운영 체계를 통해 완성도를 높인다.");

html += contentPage(
  "14",
  "기획형 발간자료 운영 방향",
  "기획형 발간자료는 연 4회 정기 발행을 기본으로 하며 회차별 6건 이상 기사 구성을 원칙으로 한다.",
  `
    ${bulletList([
      "회차별 기본 구성은 Insights 2건, Review 2건, Spotlights 2건으로 설계한다.",
      "총 24명의 필진을 주제별로 섭외·관리한다.",
      "원고 편집, 디자인, 번역, 교정·교열을 통합 관리한다.",
      "발간 이후 카드뉴스로 2차 확산을 연계한다.",
    ])}
    ${noteBox("기획형 발간자료는 정보 전달보다 한 단계 더 나아가 한국 미술의 맥락을 해석하고 읽히게 만드는 편집 구조를 갖춰야 한다.")}
  `,
);

html += contentPage(
  "15",
  "회차별 주제 기획안",
  "분기별 주제를 미리 설계해 필진 섭외, 취재, 번역, 카드뉴스 제작까지 하나의 흐름으로 연결한다.",
  simpleTable(
    ["회차", "기획 주제", "편집 방향"],
    [
      ["1회차", "2026 한국 동시대 미술의 주요 장면", "연초 이슈와 작가·기획자 인터뷰를 결합해 플랫폼 방향성을 제시"],
      ["2회차", "국제 교류와 해외 플랫폼에서의 한국 작가", "영문 확장성과 직접 연결되는 국제 교류 중심 기획"],
      ["3회차", "지역 기반 미술 생태계와 새로운 공간", "지역성과 공간성을 중심으로 미술 장면의 다양성 확보"],
      ["4회차", "차세대 작가와 2027년 전망", "결산과 전망을 동시에 담는 연말 기획"],
    ],
  ),
);

html += contentPage(
  "16",
  "필진 섭외·인터뷰·편집·디자인 계획",
  "회차별 주제의 완성도는 적합한 필진과 인터뷰 대상 섭외, 그리고 시각적 편집 완성도에서 결정된다.",
  `
    ${simpleTable(
      ["운영 항목", "세부 방안"],
      [
        ["필진 풀 구축", "비평가, 큐레이터, 연구자, 저널리스트, 기관 실무자 중심의 필진 풀 구성"],
        ["섭외 원칙", "주제 적합성, 원고 품질, 납기 준수 경험, 대외 커뮤니케이션 능력 검토"],
        ["인터뷰 운영", "질문지 사전 조율, 인용 검수, 초상권·저작권 확인"],
        ["편집·디자인", "기사 유형별 레이아웃 원칙 설정, 이미지 캡션과 인용문 강조 편집"],
      ],
    )}
    ${quoteBox("Insights는 분석형, Review는 현장 기록형, Spotlights는 인터뷰형 레이아웃으로 설계해 콘텐츠별 독자 경험을 분명하게 만든다.")}
  `,
);

html += contentPage(
  "17",
  "카드뉴스 확산 및 후속 운영",
  "카드뉴스는 발간자료의 요약이 아니라 플랫폼 유입을 늘리는 연결 콘텐츠로 설계한다.",
  `
    ${bulletList([
      "연 4회, 회당 8장 내외 카드뉴스 제작",
      "전체 요약형, 인터뷰 인용형, 이슈 포인트형 카드뉴스 병행",
      "게시 매체 확정 후 규격과 문안 길이에 맞춘 변형본 대응",
      "게재 이후 조회와 반응을 모니터링해 다음 회차 기획에 반영",
    ])}
    ${noteBox("발간자료 기획 단계부터 카드뉴스 확산 포인트를 함께 설계하면 콘텐츠 간 메시지 일관성이 높아지고 제작 효율도 향상된다.")}
  `,
);

html += sectionCover("18", "PART 04", "운영관리 및 보고", "월간 자료 등록과 분기 발간이 충돌 없이 운영되도록 연간 일정, 보고 체계, 수행조직, 리스크 대응 구조를 통합 관리한다.");

html += contentPage(
  "19",
  "연간 추진 일정",
  "계약 체결 이후 연말까지 자료 관리와 발간 기획이 병행 운영되도록 월간·분기별 일정을 설계한다.",
  simpleTable(
    ["기간", "주요 추진 내용"],
    [
      ["착수 후 1개월", "착수보고, 기존 자료 진단, 신규 후보군 조사, 1회차 기획 확정"],
      ["2~3개월차", "현행화 본격화, 신규 작가 등록, 1회차 발간 및 카드뉴스 제작"],
      ["4~6개월차", "2회차 발간, 자료 업데이트, 중간보고 누적 운영"],
      ["7~9개월차", "3회차 발간, 추가 등록, 4회차 사전 기획"],
      ["종료 전", "4회차 발간, 최종 결과보고, 성과물 제출"],
    ],
  ),
);

html += contentPage(
  "20",
  "보고 체계 및 커뮤니케이션 방식",
  "정기·수시 보고를 통해 발주처와의 협업 효율을 높이고 이슈를 조기에 해소한다.",
  simpleTable(
    ["보고 구분", "시기", "주요 내용", "방법"],
    [
      ["착수보고", "계약 후 10일 내", "세부 수행 계획, 추진 일정, 기획안 제출", "PM 발표"],
      ["주간보고", "매주", "추진 현황, 특이사항, 차주 계획", "전자파일 제출"],
      ["중간보고", "매월 1회", "발간자료 제작·게재 현황, 필진 운영 현황", "전자파일 제출 / 총괄관리자 발표"],
      ["최종 결과보고", "과업 완료 전 7일 내 / 완료 후 7일 내", "전체 수행 결과 및 최종 결과보고서 제출", "발표 및 전자파일 제출"],
      ["문제 발생 보고", "즉시", "원인, 영향, 대응방안, 처리 결과", "구두·서면 병행"],
    ],
  ),
);

html += contentPage(
  "21",
  "수행조직 및 역할 분담",
  "PM 중심의 총괄 관리 아래 아카이브 운영, 편집기획, 번역·교정, 디자인·확산 기능을 분리해 책임 있게 수행한다.",
  simpleTable(
    ["구성", "주요 역할"],
    [
      ["총괄 PM", "사업 총괄, 발주처 대응, 일정·품질·리스크 관리"],
      ["아카이브 운영 담당", "작가 자료 현행화, 신규 자료 수집, 등록 관리"],
      ["편집기획 담당", "주제 기획, 필진 섭외, 인터뷰, 기사 편집"],
      ["번역·교정 담당", "국·영문 번역, 용어집 관리, 감수 및 교열"],
      ["디자인·확산 담당", "기사 디자인, 카드뉴스, 확산 시안 관리"],
    ],
  ) +
    noteBox("실제 제출본에는 참여인력별 경력과 유사사업 수행실적을 별첨 양식으로 보강하는 것을 권장한다."),
);

html += contentPage(
  "22",
  "품질관리·저작권·리스크 대응",
  "리스크는 발생 이후 대응보다 발생 이전 관리가 중요하므로, 일정·품질·저작권·회신 이슈를 선제적으로 관리한다.",
  simpleTable(
    ["리스크", "사전 대응", "발생 시 대응"],
    [
      ["작가 자료 회신 지연", "사전 일정 공지, 2회 이상 리마인드", "대체 공개자료 검토 후 우선 등록, 후속 보완"],
      ["필진 원고 지연", "예비 필진 풀 확보, 중간 마감 운영", "대체 필진 즉시 투입"],
      ["번역 품질 편차", "용어집·스타일가이드 운영", "감수·교열 재진행 후 등록"],
      ["이미지 저작권 문제", "직접 촬영 우선, 사용권 사전 확인", "대체 이미지 및 출처 재정비"],
      ["등록 오류", "이중 검수표 운영", "수정 이력 관리 후 즉시 반영"],
    ],
  ),
);

html += contentPage(
  "23",
  "성과지표 및 기대효과",
  "성과는 단순 건수 달성뿐 아니라 플랫폼 신뢰도와 콘텐츠 확산력의 강화로 측정해야 한다.",
  simpleTable(
    ["영역", "성과지표", "기대효과"],
    [
      ["자료 관리", "기존 96인 현행화 완료, 신규 30인 이내 등록", "플랫폼 데이터 최신성 제고"],
      ["콘텐츠 발행", "연 4회 / 회당 6건 이상 기사 발행", "KAT의 기획형 콘텐츠 기능 강화"],
      ["번역 품질", "월 1회 국·영문 등록", "국제 이용자 접근성 향상"],
      ["확산", "카드뉴스 4회 제작", "발간자료 도달 범위 확대"],
      ["운영 안정성", "정기·수시 보고 준수", "발주처 협업 효율 및 신뢰도 향상"],
    ],
  ) +
    quoteBox("본 제안사는 데이터 운영의 정확성과 콘텐츠 제작의 완성도를 동시에 확보하는 연간 운영 체계를 통해 Korean Artist Today를 한국 미술의 신뢰도 높은 온라인 아카이브이자 담론 플랫폼으로 고도화하겠다."),
);

html += contentPage(
  "24",
  "최종 제안 정리",
  "본 문서는 수정 가능한 편집형 한글 파일을 목표로 재구성한 디자인 버전이며, 실제 제출 단계에서는 제안사 고유 정보를 결합해 완성도를 높일 수 있다.",
  `
    ${bulletList([
      "제안사 일반현황 및 유사사업 수행실적 반영",
      "참여인력 이력과 역할별 전문성 증빙 추가",
      "신규 작가 후보군의 연령·중복 여부 최종 검증",
      "회차별 필진 후보안 및 취재 대상 예시 보강",
      "카드뉴스 샘플 및 기사 디자인 시안 추가",
    ])}
    ${noteBox("본 편집형 디자인본은 내용 수정 가능성을 우선하면서도 표지, 파트 표지, 정보 박스, 표, 강조문을 반영해 실제 제안서다운 레이아웃을 갖추도록 구성하였다.")}
  `,
);

html += "</body></html>";

fs.writeFileSync(outPath, "\uFEFF" + html, "utf8");
console.log(outPath);
