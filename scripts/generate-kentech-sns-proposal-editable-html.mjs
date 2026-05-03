import fs from "node:fs";
import path from "node:path";

const outPath = path.resolve("output/proposal_2026_kentech_sns_editable.html");
fs.mkdirSync(path.dirname(outPath), { recursive: true });

function esc(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pageOpen() {
  return `<div style="page-break-after:always; width:100%; margin:0; padding:0;">`;
}

function pageClose(pageNo) {
  return `<div style="margin-top:10pt; text-align:right; color:#6b7c8d; font-size:9pt; border-top:1px solid #d3dae2; padding-top:4pt;">${esc(pageNo)}</div></div>`;
}

function coverPage(data) {
  return `
${pageOpen()}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d7dfe8; background:linear-gradient(135deg,#fbfbf8 0%,#f2f6f8 56%,#eaf1f6 100%);">
  <tr><td style="padding:24mm 16mm 18mm 16mm;">
    <div style="display:inline-block; border:1px solid #8ea0b4; color:#1e3c61; font-size:9pt; letter-spacing:1px; padding:5px 10px; margin-bottom:18mm;">OFFICIAL BID PROPOSAL / SNS COMMUNICATION</div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px dashed #8fa1b7; background:#ffffff; margin-bottom:14pt;">
      <tr><td style="padding:12pt 14pt;">
        <div style="font-size:24pt; font-weight:bold; color:#17375a; line-height:1.35; margin-bottom:8pt;">${esc(data.title)}</div>
        <div style="font-size:12pt; color:#59718a; line-height:1.72;">${esc(data.subtitle)}</div>
      </td></tr>
    </table>
    <div style="margin-bottom:16pt;">
      ${data.badges.map((badge) => `<span style="display:inline-block; padding:4px 10px; border:1px solid #c8d3de; border-radius:20px; background:#fff; color:#23456c; font-size:10pt; margin:0 6px 7px 0;">${esc(badge)}</span>`).join("")}
    </div>
    <table width="100%" cellpadding="0" cellspacing="14" border="0">
      <tr>
        <td valign="top" style="width:56%; border:1px solid #d3dae2; background-color:#f7f9fb; padding:12pt 14pt;">
          <div style="font-size:12pt; color:#17375a; font-weight:bold; margin-bottom:6pt;">제안 방향</div>
          <div style="font-size:10.5pt; line-height:1.8; color:#1f3552;">${esc(data.direction)}</div>
        </td>
        <td valign="top" style="width:44%;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="border:1px solid #d3dae2; background:#ffffff; padding:10pt 12pt;">
                <div style="font-size:9pt; color:#6a7c8d; margin-bottom:4pt;">제안명</div>
                <div style="font-size:10.5pt; color:#17375a; line-height:1.6; font-weight:bold;">${esc(data.meta[0][1])}</div>
              </td>
              <td style="width:8pt;"></td>
              <td style="border:1px solid #d3dae2; background:#ffffff; padding:10pt 12pt;">
                <div style="font-size:9pt; color:#6a7c8d; margin-bottom:4pt;">제안사</div>
                <div style="font-size:10.5pt; color:#17375a; line-height:1.6; font-weight:bold;">${esc(data.meta[1][1])}</div>
              </td>
            </tr>
            <tr><td colspan="3" style="height:8pt;"></td></tr>
            <tr>
              <td style="border:1px solid #d3dae2; background:#ffffff; padding:10pt 12pt;">
                <div style="font-size:9pt; color:#6a7c8d; margin-bottom:4pt;">총괄 PM</div>
                <div style="font-size:10.5pt; color:#17375a; line-height:1.6; font-weight:bold;">${esc(data.meta[2][1])}</div>
              </td>
              <td style="width:8pt;"></td>
              <td style="border:1px solid #d3dae2; background:#ffffff; padding:10pt 12pt;">
                <div style="font-size:9pt; color:#6a7c8d; margin-bottom:4pt;">문서 성격</div>
                <div style="font-size:10.5pt; color:#17375a; line-height:1.6; font-weight:bold;">${esc(data.meta[3][1])}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <div style="margin-top:8pt;">
      ${data.pills.map((pill) => `<span style="display:inline-block; padding:4px 10px; border-radius:20px; background:#eef3f8; color:#23456c; font-size:9.5pt; margin:0 6px 7px 0;">${esc(pill)}</span>`).join("")}
    </div>
  </td></tr>
</table>
${pageClose("01")}
`;
}

function sectionCover(no, title, summary, part) {
  return `
${pageOpen()}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d7dfe8; background:linear-gradient(180deg,#f4f1ea 0%,#ffffff 72%);">
  <tr><td style="padding:28mm 18mm 22mm 18mm;">
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
}

function contentPage(pageNo, title, intro, sections) {
  let body = `
${pageOpen()}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d7dfe8; background-color:#ffffff;">
  <tr><td style="padding:16mm 14mm 14mm 14mm;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8pt;">
      <tr>
        <td valign="bottom">
          <div style="font-size:16pt; color:#17375a; font-weight:bold; margin-bottom:4pt;">${esc(title)}</div>
          <div style="font-size:9.3pt; color:#6b7c8d; line-height:1.65;">${esc(intro)}</div>
        </td>
        <td valign="bottom" width="40" style="font-size:10.5pt; color:#b9964a; text-align:right; font-weight:bold;">${esc(pageNo)}</td>
      </tr>
    </table>
`;

  for (const section of sections) {
    if (section.heading) {
      body += `<div style="font-size:11.5pt; color:#17375a; font-weight:bold; margin-top:14pt; margin-bottom:6pt;">${esc(section.heading)}</div>`;
    }
    if (section.paragraphs) {
      for (const p of section.paragraphs) {
        body += `<div style="font-size:10pt; color:#1f3552; line-height:1.78; margin-bottom:8pt;">${esc(p)}</div>`;
      }
    }
    if (section.bullets) {
      body += `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:6pt;">`;
      for (const b of section.bullets) {
        body += `<tr><td width="16" valign="top" style="font-size:10pt; color:#1f3552; line-height:1.75;">-</td><td valign="top" style="font-size:10pt; color:#1f3552; line-height:1.75; padding-bottom:4pt;">${esc(b)}</td></tr>`;
      }
      body += `</table>`;
    }
    if (section.table) {
      body += `<table width="100%" cellpadding="0" cellspacing="0" border="1" style="border-collapse:collapse; border-color:#c8d3dd; margin-top:4pt; margin-bottom:8pt;">`;
      body += `<tr>`;
      for (const h of section.table.headers) {
        body += `<td style="background-color:#eef4f8; color:#17375a; font-weight:bold; font-size:9.6pt; padding:6pt 7pt; line-height:1.55;">${esc(h)}</td>`;
      }
      body += `</tr>`;
      for (const row of section.table.rows) {
        body += `<tr>`;
        for (const cell of row) {
          body += `<td style="font-size:9.2pt; color:#1f3552; padding:6pt 7pt; line-height:1.65;">${esc(cell)}</td>`;
        }
        body += `</tr>`;
      }
      body += `</table>`;
    }
    if (section.twobox) {
      body += `<table width="100%" cellpadding="0" cellspacing="10" border="0"><tr>`;
      for (const box of section.twobox) {
        body += `<td valign="top" style="border:1px solid #d3dae2; background-color:#f7f9fb; padding:10pt 12pt;"><div style="font-size:11pt; color:#17375a; font-weight:bold; margin-bottom:5pt;">${esc(box.title)}</div><div style="font-size:9.8pt; color:#1f3552; line-height:1.76;">${esc(box.text)}</div></td>`;
      }
      body += `</tr></table>`;
    }
    if (section.note) {
      body += `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8pt;"><tr><td style="border:1px dashed #b5c0cb; background-color:#fcfcfd; padding:9pt 11pt; color:#586a7b; font-size:9.5pt; line-height:1.72;">${esc(section.note)}</td></tr></table>`;
    }
  }

  body += `</td></tr></table>${pageClose(pageNo)}`;
  return body;
}

const html = `
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>2026 한국에너지공과대학교 SNS 홍보대행 용역 제안서</title>
</head>
<body style="margin:0; padding:0; background:#ffffff; font-family:'Malgun Gothic',sans-serif; color:#1f3552; font-size:11pt; line-height:1.75;">

${coverPage({
  title: "2026 한국에너지공과대학교 SNS 홍보대행 용역 제안서",
  subtitle:
    "공공입찰 제출 형식에 맞춘 정제된 정보 구조와 대학 브랜드에 적합한 SNS 운영 전략을 결합한 편집형 제안서입니다. 학교의 미션, 연구 경쟁력, 학생 경험, 입시 커뮤니케이션을 유기적으로 연결하는 통합 홍보 체계를 제안합니다.",
  badges: ["유튜브 롱폼 6편", "유튜브 숏폼 20편", "카드뉴스 24건", "블로그 24건", "캠퍼스 취재 3회 이상", "이벤트 9회 운영"],
  direction:
    "한국에너지공과대학교 SNS는 단순 소식 전달 채널이 아니라 대학의 존재 이유와 성장 가능성을 설명하는 브랜드 플랫폼이어야 합니다. 본 제안은 전략 수립, 채널 운영, 콘텐츠 제작, 광고·이벤트, 댓글 대응, 성과 분석을 하나의 운영 루프로 구성하여 학교의 미션과 강점을 일관되게 축적하는 구조를 설계합니다.",
  meta: [
    ["제안명", "2026 한국에너지공과대학교 SNS 홍보대행 용역"],
    ["제안사", "[제안사명 기입]"],
    ["총괄 PM", "[성명 / 직위 / 연락처]"],
    ["문서 성격", "편집형 HWP 제출 초안"],
  ],
  pills: ["브랜드형 SNS 구축", "정보 전달형 운영 체계", "성과 기반 개선 루프", "타깃 맞춤 메시지 설계"],
})}

${contentPage("02", "제안 핵심 요약 및 목차", "평가위원이 빠르게 구조를 이해할 수 있도록 제안 논리와 전체 구성을 먼저 제시합니다.", [
  { heading: "제안 핵심", twobox: [
    { title: "브랜드 통합", text: "대학의 미션과 강점을 하나의 서사로 묶어 각 채널에 일관되게 반영합니다." },
    { title: "채널 최적화", text: "유튜브, 인스타그램, 페이스북, 블로그를 동일 소재 복제 없이 역할별로 분화 운영합니다." },
  ]},
  { twobox: [
    { title: "상시 협의 체계", text: "홈페이지, 부서, 학생 조직, 행사 운영팀을 연결하는 정보 수급 구조를 만듭니다." },
    { title: "성과 중심 운영", text: "콘텐츠 반응, 광고 효율, 댓글 유형, 팔로워 증감을 함께 분석해 다음 기획에 반영합니다." },
  ]},
  { heading: "목차", table: {
    headers: ["구분", "세부 항목"],
    rows: [
      ["1부", "제안 개요 / 사업 이해 및 추진 배경 / 홍보 목표 정의 / 환경 분석 및 시사점"],
      ["2부", "타깃 분석 및 커뮤니케이션 전략 / 제안 콘셉트 및 핵심 메시지 / 채널 통합 운영 전략"],
      ["3부", "유튜브 운영 및 영상 전략 / 인스타그램·페이스북 운영 전략 / 네이버 블로그 운영 전략"],
      ["4부", "콘텐츠 체계 및 카테고리 설계 / 월간 운영 물량 및 편성 계획 / 캠퍼스 취재 및 제작 프로세스"],
      ["5부", "정보 수급 체계 / 광고·이벤트 운영 전략 / 댓글·문의 대응 및 사후관리 / 성과 분석 및 개선 체계"],
      ["6부", "수행 조직 및 인력 운영 계획 / 추진 일정 및 보고 체계 / 품질관리·리스크 대응 방안 / 결론"],
    ],
  }},
  { note: "실제 제출본에서는 회사 일반현황, 신용평가등급, 투입인력 실명, 포트폴리오, 유사 실적, 별첨 서식을 제안사 보유 자료로 교체합니다." },
])}

${sectionCover("03", "제안 개요", "본 장에서는 한국에너지공과대학교 SNS 홍보대행 용역의 목적을 재정의하고, 제안의 핵심 방향과 기대 역할을 공공입찰 문서의 언어로 정리합니다.", "PART 01")}

${contentPage("04", "제안 개요", "학교의 미션, 채널 운영 목적, 실무 수행 범위를 하나의 문장으로 통합합니다.", [
  { paragraphs: [
    "한국에너지공과대학교는 에너지 과학기술과 산업 생태계 혁신을 주도할 고급 인재 양성을 목표로 하는 국내 유일의 에너지 특화 대학입니다.",
    "이번 SNS 홍보대행 용역은 학교의 미션과 강점을 선명하게 전달하는 브랜드형 콘텐츠를 만들고, 입시와 학사일정, 연구 성과, 학생생활을 적시에 게시하며, 지속적인 반응 관리와 성과 분석을 통해 채널 관심도를 높이는 통합 운영 사업입니다.",
    "따라서 수행사는 단순 콘텐츠 제작사가 아니라 전략 수립자, 콘텐츠 제작 파트너, 채널 운영자, 데이터 분석자 역할을 동시에 수행해야 하며, 대학 담당자와 상시 협의 가능한 운영 구조를 갖추어야 합니다.",
  ]},
  { heading: "제안 목표", table: {
    headers: ["목표", "내용"],
    rows: [
      ["브랜드 강화", "한국에너지공과대학교만의 정체성과 존재 이유를 명확히 보이는 SNS 체계를 구축합니다."],
      ["적시 운영", "학사 일정, 특강, 행사, 입시 정보를 시의성 있게 게시하여 정보 공백을 최소화합니다."],
      ["관심도 증대", "광고, 이벤트, 반응 관리, 댓글 대응을 통해 팔로워와 구독자의 실제 참여를 유도합니다."],
    ],
  }},
])}

${contentPage("05", "사업 이해 및 추진 배경", "왜 지금 한국에너지공과대학교에 맞춤형 SNS 전략이 필요한지를 정의합니다.", [
  { paragraphs: [
    "대학 SNS는 더 이상 단순 공지판이 아니라 수험생, 학부모, 산업계, 유관기관이 학교를 처음 경험하는 브랜드 접점입니다.",
  ]},
  { heading: "과업 배경", table: {
    headers: ["항목", "배경 설명"],
    rows: [
      ["브랜드 설명 필요", "에너지 특화 대학이라는 차별점은 강력하지만, 이를 타깃별 언어로 설명하지 않으면 인식 전환까지 이어지기 어렵습니다."],
      ["시의성 관리 필요", "입시 일정, 특강, 학생행사, 연구성과는 적시에 게시될 때만 정보 가치와 반응성이 확보됩니다."],
      ["상시 협의 필요", "부서별 수요와 의견을 빠르게 반영할 수 있는 협의 채널이 있어야 현장감 있는 SNS가 유지됩니다."],
      ["전문 운영 필요", "콘텐츠 기획, 영상 제작, 디자인, 업로드, 댓글 대응, 광고 집행까지 전문화된 분업 구조가 요구됩니다."],
    ],
  }},
  { note: "이번 과업의 본질은 단순 홍보물이 아니라 한국에너지공과대학교를 살아 있는 대학 브랜드로 지속적으로 보여주는 운영 시스템을 만드는 것입니다." },
])}

${sectionCover("06", "사업 이해 및 환경 분석", "본 장에서는 대학 홍보 시장 환경, SNS 이용 패턴, 한국에너지공과대학교의 고유 강점을 분석하고, 어떤 방향의 콘텐츠가 실효성을 가질지를 도출합니다.", "PART 02")}

${contentPage("07", "환경 분석 및 시사점", "대학 SNS 경쟁 환경과 이용자 소비 방식의 변화를 분석합니다.", [
  { heading: "주요 환경 변화", table: {
    headers: ["환경 변화", "시사점"],
    rows: [
      ["숏폼 중심 확산", "짧은 영상은 발견성과 도달을 높이며, 특히 예비 수험생과 재학생 접점에서 강력한 반응을 유도합니다."],
      ["검색형 정보 탐색 지속", "네이버 블로그와 검색 노출은 입시, 대학생활, 진로 탐색 과정에서 여전히 강한 영향력을 가집니다."],
      ["현장감 있는 콘텐츠 선호", "학생의 실제 경험, 연구실과 캠퍼스 현장, 프로젝트 과정은 정적 홍보문보다 높은 공감을 얻습니다."],
      ["대학 간 경쟁 심화", "유사한 포맷의 홍보물이 넘치는 상황에서 대학 고유의 철학과 장점을 시각적으로 차별화해야 합니다."],
    ],
  }},
  { note: "한국에너지공과대학교는 '에너지 특화', '혁신 교육', '연구 중심', '미래 산업 연계'라는 강력한 고유 자산을 보유하고 있어, 이를 콘텐츠화하는 전략이 중요합니다." },
])}

${contentPage("08", "타깃 분석 및 커뮤니케이션 전략", "타깃별 질문에 맞춰 메시지를 분리해야 설득력이 높아집니다.", [
  { paragraphs: [
    "동일한 학교 정보라도 누가 보느냐에 따라 기대하는 답은 다릅니다. 따라서 메시지 구조 역시 수험생, 학부모, 산업계, 교내 구성원 기준으로 달라져야 합니다.",
  ]},
  { heading: "타깃별 메시지 구조", table: {
    headers: ["타깃", "주요 관심사", "권장 메시지 톤", "주요 채널"],
    rows: [
      ["수험생", "전공, 진로, 학생 경험, 캠퍼스 분위기", "명확하고 직관적인 미래 지향 톤", "유튜브 숏폼, 인스타그램, 블로그"],
      ["학부모", "교육 품질, 진학 안정성, 대학 신뢰도", "정돈되고 신뢰감 있는 설명 톤", "블로그, 페이스북, 롱폼 영상"],
      ["유관기관·산업계", "연구 역량, 협력 가능성, 특화성", "전문적이고 공신력 있는 톤", "유튜브 롱폼, 페이스북"],
      ["재학생·교내 구성원", "참여감, 행사, 소속감, 소통", "친근하고 반응성 높은 톤", "인스타그램, 유튜브 숏폼"],
    ],
  }},
])}

${contentPage("09", "한국에너지공과대학교 SWOT 및 홍보 시사점", "대학의 고유 경쟁력을 SNS 운영 전략으로 번역합니다.", [
  { heading: "SWOT 분석", table: {
    headers: ["구분", "핵심 내용"],
    rows: [
      ["Strength", "에너지 분야 특화 대학, 혁신적 공학교육 모델, 연구 경쟁력과 미래산업 연계성"],
      ["Weakness", "대중 인지도 추가 확장 필요, 학교 철학을 쉽게 설명하는 콘텐츠 보강 필요"],
      ["Opportunity", "에너지 전환 이슈 확대, 미래 기술·진로 관심 증가, 숏폼 기반 확산성 확대"],
      ["Threat", "대학 홍보 콘텐츠의 유사화, 입시 시즌 경쟁 심화, 짧은 주목 시간"],
    ],
  }},
  { note: "시사점: 학교 소개를 추상적으로 길게 설명하기보다, 실제 수업·연구·학생 경험 장면을 짧고 분명하게 보여주는 전략이 가장 효과적입니다." },
])}

${contentPage("10", "기존 채널 진단 프레임", "착수 단계에서 실제 계정 운영 진단을 이 프레임으로 수행합니다.", [
  { heading: "채널 진단 항목", table: {
    headers: ["진단 항목", "세부 질문", "주요 지표", "개선 방향"],
    rows: [
      ["운영 방식", "정기 업로드가 유지되고 있는가", "월별 게시 수, 업로드 간격", "월간 캘린더 정착"],
      ["콘텐츠 유형", "무엇이 반복되고 무엇이 부족한가", "포맷별 비중, 주제 분포", "카테고리 재설계"],
      ["반응도", "어떤 포맷이 관심을 얻는가", "조회, 저장, 공유, 댓글", "반응형 포맷 확대"],
      ["채널 역할", "채널별 차별성이 있는가", "중복도, 클릭 흐름", "역할 분리 운영"],
      ["브랜드 일관성", "학교의 인상이 한 문장으로 설명되는가", "디자인·카피 일관성", "통합 가이드 구축"],
    ],
  }},
])}

${sectionCover("11", "콘텐츠 및 채널 전략", "본 장에서는 채널별 역할, 핵심 메시지, 콘텐츠 카테고리, 영상 전략, 카드뉴스 및 블로그 설계까지 실제 운영 단위로 제시합니다.", "PART 03")}

${contentPage("12", "제안 콘셉트 및 핵심 메시지", "학교의 정체성을 모든 채널에 일관되게 반영하기 위한 메인 콘셉트입니다.", [
  { paragraphs: [
    "본 제안의 통합 콘셉트는 '에너지의 미래를 배우고, 만들고, 연결하는 대학'입니다.",
    "한국에너지공과대학교는 에너지 분야를 배우는 공간을 넘어, 미래 산업 문제를 해결하기 위해 교육과 연구, 실험과 협업이 하나로 연결되는 대학이라는 인식을 만들어야 합니다.",
  ]},
  { heading: "핵심 메시지", bullets: [
    "한국에너지공과대학교는 에너지 특화 미래 대학이다.",
    "학생은 수업과 프로젝트, 연구와 캠퍼스 경험을 통해 실전형 성장을 경험한다.",
    "연구 성과와 교육 혁신이 실제 산업과 진로로 연결된다.",
    "학교의 주요 소식과 일정은 빠르고 정확하게 전달된다.",
  ]},
])}

${contentPage("13", "채널 통합 운영 전략", "4개 채널을 같은 소재 반복이 아닌 역할 분담 구조로 설계합니다.", [
  { heading: "채널별 역할", table: {
    headers: ["채널", "핵심 역할", "주요 포맷", "운영 포인트"],
    rows: [
      ["유튜브", "브랜드 서사와 신뢰 형성", "롱폼, 숏폼, 썸네일, 채널 스킨", "학교의 차별성과 스토리를 깊이 있게 전달"],
      ["인스타그램", "공감, 빠른 전달, 참여 유도", "릴스, 카드뉴스, 이벤트 포스트", "학생 타깃 중심 반응형 운영"],
      ["페이스북", "공식 정보 재확산 및 기관형 전달", "요약형 포스트, 행사·성과 콘텐츠", "신뢰감 있는 정보 구조 유지"],
      ["네이버 블로그", "검색형 정보 축적", "장문형 설명 콘텐츠", "입시·학교생활 탐색 수요 흡수"],
    ],
  }},
  { note: "운영 기준: 하나의 이슈를 각 채널에 맞는 문법으로 재편집하고, 최종적으로는 학교 홈페이지 또는 관련 채널로 유입을 유도합니다." },
])}

${contentPage("14", "콘텐츠 카테고리 및 시리즈 체계", "과업지시서의 범위를 실제 제작 단위로 분해합니다.", [
  { heading: "카테고리 체계", table: {
    headers: ["구분", "주요 내용"],
    rows: [
      ["대학 관련", "학교 소개, 공식 행사, 미션·비전, 언론보도, 연구혁신 사례"],
      ["입시 관련", "학생 모집 일정, 대학원 정보, 연구트랙 소개, 면접 안내"],
      ["교육 관련", "프로젝트 성과, RC 프로그램, 수업 혁신, 학술활동·수상"],
      ["학생 생활 관련", "축제·체육대회, 동아리, 해외 프로그램, 캠퍼스 일상"],
      ["기타", "시설 소개, 주변 인프라, 이벤트, 이미지 제고형 콘텐츠"],
    ],
  }},
  { heading: "대표 시리즈 예시", bullets: ["학생의 하루", "KENTECH 연구 한 컷", "입시 한눈에 보기", "캠퍼스 스팟", "행사 스케치", "교수에게 묻다"] },
])}

${contentPage("15", "유튜브 운영 및 영상 전략", "브랜드를 설명하는 롱폼과 확산을 담당하는 숏폼을 동시에 운영합니다.", [
  { heading: "유튜브 실행 전략", table: {
    headers: ["구분", "주요 내용"],
    rows: [
      ["롱폼 6편", "학교 미션과 비전, 교육 혁신, 연구 성과, 입시 안내, 학생 프로젝트, 캠퍼스 라이프"],
      ["숏폼 20편", "행사 하이라이트, 공간 소개, 학생 인터뷰, 교수·연구자 한마디, 입시 알림"],
      ["영상 제작 원칙", "첫 3초 메시지 명확화, 자막 가독성 강화, 후킹 포인트 선제 배치, 행동 유도 문구 삽입"],
      ["채널 디자인", "시즌별 스킨 3종, 통일형 썸네일 시스템, 학교 이미지에 맞는 타이포 구조"],
    ],
  }},
  { note: "롱폼은 신뢰를 만들고, 숏폼은 발견을 만든다는 원칙으로 역할을 분리하면 채널의 성장이 안정적입니다." },
])}

${contentPage("16", "인스타그램·페이스북 운영 전략", "감도 높은 확산 채널과 공식 정보 확산 채널을 분리해 운영합니다.", [
  { heading: "플랫폼별 운영 구분", table: {
    headers: ["구분", "인스타그램", "페이스북"],
    rows: [
      ["핵심 역할", "반응 유도·참여 확대", "정보 재확산·신뢰 확보"],
      ["주요 포맷", "릴스, 카드뉴스, 이벤트", "요약형 게시물, 성과 소개, 행사 안내"],
      ["타깃", "수험생, 재학생", "학부모, 기관, 교직원"],
      ["운영 포인트", "짧은 카피, 강한 시각 후킹, 저장·공유 유도", "정제된 문장, 핵심 정보 요약, 공신력 유지"],
    ],
  }},
  { paragraphs: ["단문 콘텐츠 24건은 월별 핵심 이슈에 맞춰 배치하고, 입시와 행사 시즌에는 광고와 이벤트를 병행해 도달과 참여를 함께 높이겠습니다."] },
])}

${contentPage("17", "네이버 블로그 운영 전략", "검색을 통해 학교를 알아보는 사용자에게 깊이 있는 정보를 제공합니다.", [
  { heading: "블로그 운영 원칙", table: {
    headers: ["구분", "주요 내용"],
    rows: [
      ["운영 목표", "학교 탐색형 정보 축적, 입시 관련 검색 유입 확보, 학부모 설득 자료화"],
      ["주요 콘텐츠", "모집 일정, 연구트랙 설명, 학생생활 안내, 시설·캠퍼스 소개, 행사 후기"],
      ["검색 최적화", "키워드 구조화, 소제목 분리, FAQ형 문단 구성, 이미지 캡션 정리"],
      ["운영 물량", "총 24건, 월 2건 이상 정기 발행, 핵심 시즌 증량 운영"],
    ],
  }},
  { note: "블로그는 단순 홍보문이 아니라 '질문 하나에 답하는 문서'로 쓰는 것이 중요하며, 이는 입시 탐색 단계의 설득력으로 이어집니다." },
])}

${sectionCover("18", "운영 계획 및 실행 체계", "본 장에서는 월간 편성, 캠퍼스 취재, 정보 수급, 협의 채널, 광고·이벤트, 댓글 대응까지 실제 운영 프로세스를 제시합니다.", "PART 04")}

${contentPage("19", "월간 운영 물량 및 편성 계획", "최소 수행 물량을 충족하면서도 시기별 중요도를 반영한 편성 구조입니다.", [
  { heading: "운영 물량 계획", table: {
    headers: ["매체", "수량", "운영 방식", "비고"],
    rows: [
      ["유튜브 롱폼", "6개", "분기별 핵심 주제 집중 편성", "최소 5분 이상"],
      ["유튜브 숏폼", "20개", "월별 상시 운영 + 시즌 증량", "확산형 콘텐츠"],
      ["인스타그램·페이스북 단문 콘텐츠", "24개", "월 2건 이상 핵심 이슈 중심", "카드뉴스 등"],
      ["네이버 블로그", "24개", "월 2건 이상 정기 발행", "검색형 정보 아카이브"],
      ["캠퍼스 현장 영상 취재", "최소 3회", "행사·학생생활·입시 시즌 중심", "현장 촬영 기반"],
      ["이벤트", "9회", "주요 일정 연계", "채널 활성화용"],
    ],
  }},
])}

${contentPage("20", "캠퍼스 현장 취재 및 제작 프로세스", "현장성이 살아 있는 대학 홍보를 위해 최소 3회 이상 직접 취재를 수행합니다.", [
  { heading: "현장 취재 배치", table: {
    headers: ["회차", "목적", "주요 장면"],
    rows: [
      ["1차 취재", "브랜드 핵심 장면 확보", "캠퍼스 전경, 수업 공간, 학생 인터뷰, 연구 환경"],
      ["2차 취재", "주요 행사·프로그램 중심 촬영", "특강, 축제, 프로젝트 발표, RC 프로그램"],
      ["3차 취재", "입시·관심 집중 시점 촬영", "연구트랙, 학교생활, 면접 안내, 학생 경험"],
    ],
  }},
  { note: "취재 전에는 컷리스트, 인터뷰 질문지, 촬영 동선표를 제출하고, 촬영 후에는 프리뷰 컷 및 편집 방향을 대학 담당자와 즉시 공유합니다." },
])}

${contentPage("21", "정보 수급 체계 및 상시 협의 채널", "좋은 SNS 운영은 촘촘한 정보 수급 구조에서 시작됩니다.", [
  { heading: "정보 수급 구조", table: {
    headers: ["구분", "주요 채널", "수집 목적", "운영 방식"],
    rows: [
      ["1차 정보", "대학 홈페이지, 공지사항, 보도자료, 게시판", "공식 일정 및 기본 정보 확보", "상시 모니터링"],
      ["2차 정보", "부서 담당자, 연구실, 학생조직, 홍보대사", "현장감 있는 소재 확보", "주간 안건 수집"],
      ["실시간 협의", "메신저 협의방", "긴급 요청 및 확인", "상시 운영"],
      ["정기 협의", "월간 회의", "운영 계획 및 실적 공유", "월 1회 이상"],
    ],
  }},
  { note: "정보가 모이는 구조를 만들면 콘텐츠 제작이 쉬워지고, 콘텐츠가 쌓이면 채널이 살아납니다." },
])}

${contentPage("22", "광고·이벤트 운영 전략", "주요 일정에 관심을 집중시키는 증폭 장치를 설계합니다.", [
  { heading: "실행 전략", table: {
    headers: ["구분", "주요 내용"],
    rows: [
      ["유튜브 타깃 광고", "롱폼 주요 편, 숏폼 핵심 메시지 영상, 입시 시즌 관심 타깃 세분화"],
      ["인스타그램 광고", "카드뉴스 노출 강화, 이벤트 참여 확대, 수험생·재학생 세그먼트 운영"],
      ["이벤트 9회 운영", "개교기념일, 입시면접, 수능 이후 탐색 시기, 교내 대표 행사 연계"],
      ["후속 업무", "당첨자 발표, 경품 발송, 결과 리포트, 재참여 유도 장치 설계"],
    ],
  }},
])}

${contentPage("23", "댓글·문의 대응 및 사후관리", "게시물 발행 이후의 응대 품질이 채널 신뢰도를 결정합니다.", [
  { heading: "운영 원칙", table: {
    headers: ["구분", "주요 내용"],
    rows: [
      ["응대 원칙", "당일 처리 원칙, 민감 이슈 단계별 대응, 공식 정보 우선 확인"],
      ["매뉴얼화", "자주 묻는 질문 유형화, 부서 확인 루트 정리, 승인 기준 명확화"],
      ["운영 로그", "질문 빈도 분석, 오해 포인트 추적, 다음 콘텐츠 기획 반영"],
      ["사후관리", "반응 모니터링, 게시물 유형별 개선, 팔로워·구독자 증감 관리"],
    ],
  }},
])}

${sectionCover("24", "성과관리 및 수행 체계", "본 장에서는 정량·정성 지표, 월간 리포팅 방식, 수행 조직, 추진 일정, 리스크 관리 체계를 제시하여 실행 가능성을 뒷받침합니다.", "PART 05")}

${contentPage("25", "성과 분석 및 개선 체계", "조회수 집계를 넘어 어떤 포맷이 어떤 타깃에 반응했는지 해석합니다.", [
  { heading: "채널별 성과 분석 구조", table: {
    headers: ["구분", "주요 지표", "분석 포인트", "활용 방식"],
    rows: [
      ["유튜브", "조회수, 시청지속시간, 구독 전환", "주제별 유지율과 후킹 구간", "영상 길이·편집 방식 보정"],
      ["인스타그램", "도달수, 저장, 공유, 댓글", "공감형 포맷과 정보형 포맷 비교", "카드뉴스·릴스 비중 조정"],
      ["페이스북", "도달, 링크 클릭, 반응", "공식형 콘텐츠 반응 추이", "재확산용 포스트 개선"],
      ["블로그", "조회수, 유입 키워드, 체류시간", "검색형 수요와 정보 구조 적합성", "SEO형 주제 강화"],
    ],
  }},
  { note: "월간 보고서는 채널별 실적표, 주요 반응 게시물 분석, 광고 효율, 이벤트 결과, 다음 달 개선안까지 포함하는 의사결정 자료로 구성합니다." },
])}

${contentPage("26", "수행 조직 및 인력 운영 계획", "전략, 제작, 운영, 데이터 분석이 분리되면서도 PM 아래 유기적으로 연결되는 구조입니다.", [
  { heading: "수행 조직 구성", table: {
    headers: ["구분", "주요 역할"],
    rows: [
      ["총괄 PM", "대학 커뮤니케이션, 일정·품질 총괄, 이슈 대응, 보고 체계 관리"],
      ["콘텐츠 기획 리드", "월간 캘린더, 시리즈 설계, 카피 방향, 승인안 정리"],
      ["영상 제작 파트", "롱폼·숏폼 기획, 촬영, 편집, 자막·썸네일 제작"],
      ["디자인·운영·분석 파트", "카드뉴스·커버 제작, 업로드·댓글 대응, 성과 리포트, 광고 효율 분석"],
    ],
  }},
  { note: "실제 제출본에는 참여인력 조직도, 역할별 경력 요약, 포트폴리오 제작자 실투입 계획을 별첨 서식에 맞춰 삽입하겠습니다." },
])}

${contentPage("27", "추진 일정 및 보고 체계", "착수부터 최종보고까지 단계별로 관리합니다.", [
  { heading: "단계별 추진 계획", table: {
    headers: ["단계", "주요 내용", "핵심 산출물"],
    rows: [
      ["착수", "채널 진단, 타깃 정의, 운영 프레임 수립", "착수보고서, 운영 가이드, 초기 캘린더"],
      ["실행", "콘텐츠 제작·배포, 광고·이벤트 운영", "월간 콘텐츠, 업로드 내역, 이벤트 결과"],
      ["점검", "반응 분석, 이슈 조정, 포맷 개선", "월간 성과 보고서, 개선안"],
      ["보고", "중간·최종 보고, 산출물 정리", "최종 보고서, 원본 파일, 기록 매체"],
    ],
  }},
  { heading: "보고 체계", bullets: [
    "월 1회 서면 보고 및 필요 시 회의 보고를 통해 진행 현황과 개선안을 공유합니다.",
    "긴급 일정, 중요 행사, 민감 이슈는 메신저와 유선 커뮤니케이션을 통해 즉시 대응합니다.",
  ]},
])}

${contentPage("28", "품질관리 및 리스크 대응 방안", "공공기관 수준의 문서 정확성과 현장 대응성을 동시에 확보합니다.", [
  { heading: "리스크 대응 체계", table: {
    headers: ["구분", "세부 내용"],
    rows: [
      ["정확성 관리", "사실관계 확인, 담당부서 재확인, 입시·행사 일정 검증"],
      ["시각 품질 관리", "통합 디자인 가이드, 채널별 템플릿 관리, 가독성 중심 편집"],
      ["권리 관리", "초상권 동의, 외부 소스 사용 기준, 저작권 이슈 예방"],
      ["긴급 이슈 대응", "수정 공지, 게시물 교체, 댓글 안내, 담당자 핫라인 운영"],
    ],
  }},
])}

${contentPage("29", "기대효과 및 제안사 차별화 포인트", "운영 결과가 학교 브랜드에 어떤 변화를 만들지 제시합니다.", [
  { heading: "핵심 정리", table: {
    headers: ["구분", "내용"],
    rows: [
      ["기대효과", "대학의 미션과 강점이 채널 전반에 선명하게 축적되고, 입시·연구·교육·학생생활 정보가 정기적으로 제공되며, 팔로워·구독자와 관심도가 함께 상승합니다."],
      ["차별화 포인트", "전략-제작-운영-분석이 끊기지 않는 구조, 대학의 공공성과 학생 타깃 감각을 동시에 고려한 카피 설계, 상시 정보수급 체계를 강점으로 합니다."],
    ],
  }},
  { note: "좋은 대학 SNS는 보기 좋은 게시물 몇 개가 아니라, 학교를 더 잘 설명하게 만드는 운영 구조에서 나옵니다." },
])}

${contentPage("30", "결론 및 요청사항", "제안의 최종 요약과 제출용 후속 보완 포인트를 정리합니다.", [
  { paragraphs: [
    "한국에너지공과대학교 SNS 홍보는 더 많이 게시하는 문제가 아니라, 더 선명하게 설명하고 더 빠르게 반응하는 문제입니다.",
    "본 제안은 학교의 미션과 강점, 입시와 교육, 연구와 학생생활, 정보 제공과 관심도 증대를 하나의 운영 체계 안에 담는 것을 목표로 설계하였습니다.",
    "계약 후에는 신속한 착수보고를 통해 채널 진단 결과와 연간 운영 프레임을 먼저 공유하고, 이후 월간 실행과 데이터 기반 개선을 병행해 채널의 존재감을 체계적으로 키워가겠습니다.",
  ]},
  { note: "최종 제출 전 반영 권장 항목: 회사 일반현황, 대표실적 3~5건, 포트폴리오 이미지, 투입인력 실명 및 경력, 신용평가등급, 별첨 서식, 예산 배분표." },
])}

</body></html>
`;

fs.writeFileSync(outPath, "\uFEFF" + html, "utf8");
console.log(outPath);
