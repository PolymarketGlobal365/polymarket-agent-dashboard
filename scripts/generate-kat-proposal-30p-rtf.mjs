import fs from "node:fs";
import path from "node:path";

const outPath = path.resolve("output/proposal_2026_korean_artist_today_30p_editable.rtf");
fs.mkdirSync(path.dirname(outPath), { recursive: true });

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

function p(text, opts = {}) {
  const align = opts.align === "center" ? "\\qc" : opts.align === "right" ? "\\qr" : "\\ql";
  const size = opts.size ?? 16;
  const bold = opts.bold ? "\\b" : "";
  const color = opts.color ?? 1;
  const sb = opts.spaceBefore ?? 0;
  const sa = opts.spaceAfter ?? 90;
  return `{\\pard${align}\\cf${color}\\sb${sb}\\sa${sa}\\sl240\\slmult1${bold}\\fs${size} ${rtfEscape(text)}\\par}\n`;
}

function lead(text) {
  return `{\\pard\\ql\\sb30\\sa80\\brdrl\\brdrs\\brdrw20\\brdrcf3\\li180\\ri40\\cf1\\fs16 ${rtfEscape(text)}\\par}\n`;
}

function bullet(text, level = 0) {
  const left = 500 + level * 220;
  return `{\\pard\\ql\\li${left}\\fi-180\\sa40\\sl230\\slmult1\\cf1\\fs15 - ${rtfEscape(text)}\\par}\n`;
}

function badge(text) {
  return `{\\pard\\qc\\cf2\\b\\fs18 ${rtfEscape(text)}\\par}\n`;
}

function keyValue(label, value) {
  return `{\\pard\\ql\\sb10\\sa40\\cf1\\fs16 \\b ${rtfEscape(label)}\\b0  ${rtfEscape(value)}\\par}\n`;
}

function note(text) {
  return `{\\pard\\ql\\sb30\\sa60\\brdrt\\brdrs\\brdrw10\\brdrcf4\\brdrl\\brdrs\\brdrw10\\brdrcf4\\brdrb\\brdrs\\brdrw10\\brdrcf4\\brdrr\\brdrs\\brdrw10\\brdrcf4\\cf4\\fs14 ${rtfEscape(text)}\\par}\n`;
}

function divider() {
  return `{\\pard\\qr\\cf3\\fs14 ________________________________________________\\par}\n`;
}

function pageBreak() {
  return "\\page\n";
}

const pages = [
  {
    title: "2026년 코리안 아티스트 투데이 자료 기획 및 제작 대행 제안서",
    subtitle: "Korean Artist Today의 아카이브 운영, 기획형 발간자료 제작, 국·영문 등록, 카드뉴스 확산을 통합 수행하는 연간 실행 제안서",
    body: [
      badge("OFFICIAL BID PROPOSAL / EDITABLE HWP VERSION"),
      p("2026년 코리안 아티스트 투데이", { align: "center", size: 34, bold: true, color: 2, spaceAfter: 80 }),
      p("자료 기획 및 제작 대행 제안서", { align: "center", size: 34, bold: true, color: 2, spaceAfter: 220 }),
      p("Korean Artist Today의 아카이브 운영, 기획형 발간자료 제작, 국·영문 등록, 카드뉴스 확산을 통합 수행하는 연간 실행 제안서", {
        align: "center",
        size: 19,
        color: 4,
        spaceAfter: 320,
      }),
      keyValue("사업명", "2026년 코리안 아티스트 투데이 자료 기획 및 제작 대행"),
      keyValue("과업기간", "계약체결일로부터 2026.12.18.까지"),
      keyValue("사업예산", "금 80,000,000원(VAT 포함)"),
      keyValue("제안사", "[제안사명 기입]"),
      p("", { spaceAfter: 260 }),
      bullet("기존 작가 96인 현행화"),
      bullet("신규 작가 30인 이내 발굴 및 등록"),
      bullet("연 4회, 회당 6건 이상 기획형 발간자료 제작"),
      bullet("총 필진 24명 운영"),
      bullet("월 1회 국·영문 번역 등록"),
      bullet("카드뉴스 4회 제작 및 확산"),
    ].join(""),
  },
  {
    title: "제안 요약",
    body: [
      lead("본 제안은 Korean Artist Today를 한국 미술의 신뢰도 높은 온라인 아카이브이자 동시대 담론 플랫폼으로 고도화하기 위한 연간 운영계획서이다."),
      p("제안사는 본 사업을 단순 기사 제작 사업이 아니라 자료 관리와 편집 기획이 결합된 운영형 사업으로 해석하였다. 이에 따라 수집형 자료와 기획형 발간자료, 번역과 확산 콘텐츠를 하나의 편집 캘린더로 통합 관리한다."),
      bullet("정확한 아카이브 운영"),
      bullet("기획력 있는 동시대 미술 콘텐츠 발행"),
      bullet("국·영문 병행 품질관리"),
      bullet("정시 납품이 가능한 연간 운영체계"),
      note("제안서 전반은 ‘가능하다’가 아닌 ‘실시한다’, ‘구축한다’, ‘운영한다’의 단정형 문장으로 작성하여 제안요청서의 작성 기준을 충족하도록 구성하였다."),
    ].join(""),
  },
  {
    title: "목차",
    body: [
      bullet("01. 사업 배경 및 추진 필요성"),
      bullet("02. Korean Artist Today 플랫폼 이해"),
      bullet("03. 과업 범위 및 정량 목표"),
      bullet("04. 제안 차별화 포인트"),
      bullet("05. 연간 운영 프레임"),
      bullet("06. 수집형 자료 관리·등록 총괄 계획"),
      bullet("07. 기존 96인 자료 현행화 프로세스"),
      bullet("08. 신규 작가 발굴 기준"),
      bullet("09. 신규 작가 제안 리스트 1"),
      bullet("10. 신규 작가 제안 리스트 2"),
      bullet("11. Exhibition·Artspace·Publication·News 운영"),
      bullet("12. 월간 수집·등록 캘린더"),
      bullet("13. 국·영문 번역 및 메타데이터 품질관리"),
      bullet("14. 기획형 발간자료 운영 방향"),
      bullet("15. 1회차 기획안"),
      bullet("16. 2회차 기획안"),
      bullet("17. 3회차 기획안"),
      bullet("18. 4회차 기획안"),
      bullet("19. 필진 섭외 및 인터뷰 운영"),
      bullet("20. 편집·디자인·사진 제작"),
      bullet("21. 카드뉴스 제작 및 확산"),
      bullet("22. 연간 추진 일정"),
      bullet("23. 보고 체계"),
      bullet("24. 수행조직 및 역할"),
      bullet("25. 리스크 대응"),
      bullet("26. 성과지표 및 기대효과"),
      bullet("27. 제출 전 보완 사항"),
      bullet("28. 신규 작가 운영 기준 보충"),
      bullet("29. 기획형 기사 세부 운영 포인트"),
      bullet("30. 최종 제안 결론"),
    ].join(""),
  },
];

const extraPages = [
  {
    title: "사업 배경 및 추진 필요성",
    leadText: "Korean Artist Today는 만 65세 미만 신진·중견 작가의 활동 이력과 관련 자료를 국내외에 제공하는 공공 플랫폼으로서, 한국 미술의 국제 인지도 제고를 위한 기반 역할을 수행한다.",
    bullets: [
      "한국 미술 자료가 기관·전시·기사 단위로 분산되어 있어 통합적 접근성이 낮다.",
      "작가 활동 이력과 전시, 출판, 기사, 인터뷰를 함께 연결해 보여주는 구조가 필요하다.",
      "국·영문 병행 운영을 통해 해외 연구자와 관객의 접근성을 높여야 한다.",
    ],
  },
  {
    title: "Korean Artist Today 플랫폼 이해",
    leadText: "제안사는 KAT를 아카이브, 시의성 있는 정보 업데이트, 기획 담론이 함께 움직이는 온라인 플랫폼으로 이해한다.",
    bullets: [
      "Archive는 작가·작품·전시·공간·출판물의 기본 데이터 축적 기능을 담당한다.",
      "Events는 행사 일정과 관련 뉴스를 업데이트하는 정보 허브 역할을 수행한다.",
      "Features는 동시대 한국 미술의 해석과 확산을 담당하는 콘텐츠 허브이다.",
    ],
  },
  {
    title: "과업 범위 및 정량 목표",
    leadText: "제안요청서의 요구사항을 운영 가능한 정량 목표로 재구성하여 과업의 실행 가능성을 명확히 제시한다.",
    bullets: [
      "기존 등록 작가 96인 연 1회 현행화",
      "신규 작가 30인 이내 월 1회 수집·등록",
      "전시·행사·출판물 정보 월 1회 업데이트",
      "국·영문 번역 월 1회 등록",
      "기획형 발간자료 연 4회, 회당 6건 이상 기사 발행",
      "카드뉴스 총 4회 제작",
    ],
  },
  {
    title: "제안 차별화 포인트",
    leadText: "본 제안의 차별점은 자료 관리와 편집 기획을 별개 업무가 아니라 하나의 운영 시스템으로 설계한 데 있다.",
    bullets: [
      "수집형 자료와 기획형 발간자료를 단일 연간 캘린더로 운영한다.",
      "작가 데이터, 전시 정보, 기사 기획, 카드뉴스 확산이 서로 연결되도록 설계한다.",
      "번역·교정·교열·저작권 확인을 별도 검수 단계로 고정 운영한다.",
    ],
  },
  {
    title: "연간 운영 프레임",
    leadText: "제안사는 본 사업을 수집, 정제, 발행, 확산의 4단계 프레임으로 운영한다.",
    bullets: [
      "수집: 기존 자료 점검, 신규 후보 조사, 전시·공간·출판물 확보",
      "정제: 사실 검증, 메타데이터 정리, 번역, 감수, 교정",
      "발행: 사이트 등록, 기사 편집, 디자인, 인터뷰 제작",
      "확산: 카드뉴스 제작, 게시 일정 관리, 상시 모니터링",
    ],
  },
  {
    title: "수집형 자료 관리·등록 총괄 계획",
    leadText: "Archive와 Events의 신뢰도는 플랫폼 전체의 품질을 결정하므로 메뉴별 운영 기준을 표준화한다.",
    bullets: [
      "Artists·Artworks·Exhibition·Artspace·Publication을 유형별로 분리 관리한다.",
      "Events의 Calendar와 News는 월간 리듬으로 정기 업데이트한다.",
      "기등록 자료와 신규 자료의 운영 프로세스를 구분하되 검수 기준은 동일하게 적용한다.",
    ],
  },
  {
    title: "기존 96인 자료 현행화 프로세스",
    leadText: "기수집 작가 자료 현행화는 연 1회 일괄 추진하되 분기별 주요 변동 이력을 사전 점검한다.",
    bullets: [
      "사전 진단: 누락 항목과 최신 활동 반영 필요 항목 점검",
      "자료 요청: 작가 및 관련 기관 대상 안내 및 회신 일정 관리",
      "보완 검토: 외부 공개 자료와 교차 확인, 추가 보완 요청",
      "최종 반영: 수정 내용 이력화 및 등록 완료 확인",
    ],
  },
  {
    title: "신규 작가 발굴 기준",
    leadText: "신규 작가는 인지도 중심이 아닌 플랫폼 적합성과 활동 지속성을 기준으로 선정한다.",
    bullets: [
      "만 65세 미만 신진·중견 작가",
      "최근 3년 내 주요 개인전·기획전·프로젝트 실적 보유",
      "매체·세대·지역 다양성 확보",
      "국내외 확산 가능성과 자료 확보 가능성 검토",
    ],
  },
  {
    title: "신규 작가 제안 리스트 1",
    leadText: "아래 후보군은 제안 단계 예시안이며, 실제 제출 시 연령 기준과 기등록 여부를 최종 검증한다.",
    bullets: [
      "김아영 / 리서치 기반 영상·설치 / 국제 담론 확장성",
      "강서경 / 조각·회화·설치 / 조형 언어의 독자성",
      "이미래 / 조각·설치 / 차세대 국제 무대 확장성",
      "정금형 / 퍼포먼스·영상 / 매체 독창성",
      "전현선 / 회화 / 국내외 전시 가시성",
      "권오상 / 조각·사진 / 대중 인지도와 대표성",
    ],
  },
  {
    title: "신규 작가 제안 리스트 2",
    leadText: "후보군은 매체와 세대, 지역성과 국제 활동성을 균형 있게 고려하여 구성한다.",
    bullets: [
      "노상호 / 회화·디지털 이미지 / 동시대 시각문화 반영",
      "박보나 / 설치·리서치 / 비평 담론 연계성",
      "정윤석 / 영상 / 사회적 이슈 기반 동시대성",
      "이승애 / 애니메이션·회화 / 매체 융합형 확장성",
      "하태범 / 설치·사진 / 시각적 전달력",
      "정희민 / 회화 / 젊은 회화 흐름 반영",
    ],
  },
  {
    title: "Exhibition · Artspace · Publication · News 운영",
    leadText: "작가 중심 데이터 외에도 전시, 공간, 출판물, 뉴스 정보가 함께 갱신되어야 플랫폼의 탐색성과 신뢰성이 높아진다.",
    bullets: [
      "Exhibition은 등록 작가 연계 전시와 주요 기획전을 월 1회 정리한다.",
      "Artspace는 공간명, 주소, 위치, 운영정보 등 기본 정보를 최신화한다.",
      "Publication은 한국 미술 관련 해외 출판물 서지정보를 표준 양식으로 관리한다.",
      "News는 국내외 주요 기사 중 한국 미술 관련성이 높은 정보를 선별 등록한다.",
    ],
  },
  {
    title: "월간 수집·등록 캘린더",
    leadText: "수집형 자료는 월별 리듬이 고정되어야 적체 없이 안정적으로 누적된다.",
    bullets: [
      "1주차: 전월 변동사항 점검 및 신규 조사 계획 수립",
      "2주차: 자료 취합 및 원본 정리",
      "3주차: 사실 검증, 번역 초안, 등록 원고 정리",
      "4주차: 최종 등록 및 월간 결과 정리",
    ],
  },
  {
    title: "국·영문 번역 및 메타데이터 품질관리",
    leadText: "번역은 단순 언어 전환이 아니라 미술 전문 용어와 콘텐츠 맥락을 반영한 품질관리 절차로 운영한다.",
    bullets: [
      "국문 정리 → 영문 번역 → 감수 → 교정·교열 → 등록의 5단계 프로세스 운영",
      "작가명, 전시명, 기관명, 작품명 표기 기준표 별도 운영",
      "고유명사 표기와 메타데이터 정합성 이중 점검",
      "영문 원고 제공 시 국문 번역 포함 원칙 적용",
    ],
  },
  {
    title: "기획형 발간자료 운영 방향",
    leadText: "기획형 발간자료는 KAT의 담론 기능을 강화하는 핵심 영역으로, 분기별 편집 전략과 필진 운영 체계가 중요하다.",
    bullets: [
      "연 4회 발행, 회당 6건 이상 기사 발행",
      "Insights 2건, Review 2건, Spotlights 2건 기본 구성",
      "총 24명 필진 섭외 및 관리",
      "취재, 인터뷰, 디자인, 번역, 교열을 통합 관리",
    ],
  },
  {
    title: "1회차 기획안",
    leadText: "1회차는 2026년 한국 동시대 미술의 주요 장면을 정리하는 방향으로 구성한다.",
    bullets: [
      "Insights: 2026 한국 동시대 미술의 핵심 흐름",
      "Insights: 신진·중견 작가의 매체 변화",
      "Review: 상반기 주요 전시 리뷰",
      "Review: 공공기관·비영리 공간 기획 방향 분석",
      "Spotlights: 주목할 작가 인터뷰",
      "Spotlights: 주목할 기획자 인터뷰",
    ],
  },
  {
    title: "2회차 기획안",
    leadText: "2회차는 국제 교류와 해외 플랫폼에서의 한국 작가를 중심으로 영문 확장성과 연결되는 회차로 구성한다.",
    bullets: [
      "Insights: 해외 전시와 비엔날레에서의 한국 작가 동향",
      "Insights: 국제 레지던시와 협업 플랫폼의 변화",
      "Review: 해외 주요 행사 속 한국 관련 전시 리뷰",
      "Review: 국제 비평 지형 속 한국 미술 담론",
      "Spotlights: 해외 활동 작가 인터뷰",
      "Spotlights: 국제 네트워크 기반 기획자 인터뷰",
    ],
  },
  {
    title: "3회차 기획안",
    leadText: "3회차는 지역 기반 미술 생태계와 새로운 공간을 조명하여 KAT의 지리적 확장성을 보여준다.",
    bullets: [
      "Insights: 지역 미술 생태계 변화와 작가 활동",
      "Insights: 대안공간과 독립기획의 실험성",
      "Review: 지역 기반 주요 전시 리뷰",
      "Review: 기관·민간 공간 협력 사례 분석",
      "Spotlights: 지역 기반 작가 인터뷰",
      "Spotlights: 대안공간 운영자 인터뷰",
    ],
  },
  {
    title: "4회차 기획안",
    leadText: "4회차는 2026년 결산과 2027년 전망을 동시에 제시하는 회차로 구성한다.",
    bullets: [
      "Insights: 2026년 한국 미술 결산과 핵심 이슈",
      "Insights: 차세대 작가군과 주목할 매체 변화",
      "Review: 연말 주요 행사 및 프로젝트 리뷰",
      "Review: 비평·출판 관점에서 본 연간 쟁점",
      "Spotlights: 차세대 작가 인터뷰",
      "Spotlights: 비평가 또는 기획자 인터뷰",
    ],
  },
  {
    title: "필진 섭외 및 인터뷰 운영",
    leadText: "회차별 주제에 맞는 필진과 인터뷰 대상을 안정적으로 확보하는 것이 발간 완성도의 핵심이다.",
    bullets: [
      "비평가, 큐레이터, 연구자, 저널리스트, 기관 실무자 중심의 필진 풀 구축",
      "주제 적합성, 원고 품질, 납기 준수 경험 기준으로 섭외",
      "중간 마감과 최종 마감 이중 운영",
      "질문지 사전 조율, 인용 검수, 초상권·저작권 확인",
    ],
  },
  {
    title: "편집·디자인·사진 제작",
    leadText: "기획형 발간자료는 내용과 시각적 완성도가 함께 작동해야 하므로 기사 유형별 편집 원칙을 적용한다.",
    bullets: [
      "Insights는 분석형 기사 구조와 정보 박스 중심 편집",
      "Review는 현장감 있는 이미지와 캡션 중심 구성",
      "Spotlights는 인터뷰 흐름과 인용문 강조형 구성",
      "직접 촬영 원칙, 불가피한 경우 저작권 문제 없는 이미지 사용 및 표기",
    ],
  },
  {
    title: "카드뉴스 제작 및 확산",
    leadText: "카드뉴스는 발간자료의 2차 확산 수단으로서 핵심 메시지를 압축해 전달하는 역할을 수행한다.",
    bullets: [
      "연 4회 제작, 회당 8장 내외 구성",
      "전체 요약형, 인터뷰 인용형, 이슈 포인트형 카드뉴스 병행",
      "발간자료 기획 단계에서부터 카드뉴스 확산 포인트를 설계",
      "게시 매체 확정 후 규격과 문안 길이에 맞춘 변형본 대응",
    ],
  },
  {
    title: "연간 추진 일정",
    leadText: "계약 체결 이후 연말까지 자료 관리와 발간 기획이 병행 운영되도록 월간·분기별 일정을 설계한다.",
    bullets: [
      "착수 후 1개월: 착수보고, 기존 자료 진단, 신규 후보군 조사, 1회차 기획 확정",
      "2~3개월차: 현행화 본격화, 신규 작가 등록, 1회차 발간 및 카드뉴스 제작",
      "4~6개월차: 2회차 발간, 자료 업데이트, 중간보고 누적 운영",
      "7~9개월차: 3회차 발간, 추가 등록, 4회차 사전 기획",
      "종료 전: 4회차 발간, 최종 결과보고, 성과물 제출",
    ],
  },
  {
    title: "보고 체계",
    leadText: "정기·수시 보고를 통해 발주처와의 협업 효율을 높이고 이슈를 조기에 해소한다.",
    bullets: [
      "착수보고: 계약 후 10일 이내 / 세부 수행계획 및 기획안 보고",
      "주간보고: 매주 / 추진 현황, 특이사항, 차주 계획 제출",
      "중간보고: 매월 1회 / 발간자료·필진 운영 현황 보고",
      "최종 결과보고: 과업 완료 전 7일 내 발표, 완료 후 7일 내 결과보고서 제출",
      "문제 발생 보고: 즉시 / 원인, 영향, 대응방안, 처리결과 공유",
    ],
  },
  {
    title: "수행조직 및 역할",
    leadText: "PM 중심 총괄 관리 아래 아카이브 운영, 편집기획, 번역·교정, 디자인·확산 기능을 분리해 책임 있게 수행한다.",
    bullets: [
      "총괄 PM: 발주처 대응, 일정·품질·리스크 관리",
      "아카이브 운영 담당: 작가 자료 현행화, 신규 자료 수집, 등록 관리",
      "편집기획 담당: 주제 기획, 필진 섭외, 인터뷰, 기사 편집",
      "번역·교정 담당: 국·영문 번역, 용어집 관리, 감수 및 교열",
      "디자인·확산 담당: 기사 디자인, 카드뉴스, 확산 시안 관리",
    ],
  },
  {
    title: "리스크 대응",
    leadText: "리스크는 발생 후 대응보다 발생 이전 관리가 중요하므로, 일정·품질·저작권·회신 이슈를 선제적으로 관리한다.",
    bullets: [
      "작가 자료 회신 지연: 사전 일정 공지, 2회 이상 리마인드, 대체 공개자료 교차 확인",
      "필진 원고 지연: 예비 필진 풀 구축, 중간 마감 운영",
      "번역 품질 편차: 용어집과 스타일가이드 운영, 감수·교열 이중 검수",
      "이미지 저작권 문제: 직접 촬영 우선, 사용권 사전 확인",
      "등록 오류: 이중 검수표 운영과 수정 이력 관리",
    ],
  },
  {
    title: "성과지표 및 기대효과",
    leadText: "성과는 단순 건수 달성뿐 아니라 플랫폼 신뢰도와 콘텐츠 확산력의 강화로 측정해야 한다.",
    bullets: [
      "기존 96인 현행화 완료와 신규 30인 이내 등록을 통한 데이터 최신성 제고",
      "연 4회 기획형 발간자료 운영을 통한 담론 플랫폼 기능 강화",
      "월 1회 번역 등록을 통한 국제 이용자 접근성 향상",
      "카드뉴스 4회 제작을 통한 발간자료 도달 범위 확대",
      "정기·수시 보고 준수를 통한 발주처 협업 효율 및 신뢰도 향상",
    ],
  },
  {
    title: "제출 전 보완 사항",
    leadText: "본 초안은 제안 논리와 운영 구조를 상세하게 구성한 본문 초안이며, 실제 제출 단계에서는 제안사 고유 정보를 결합해 완성도를 높인다.",
    bullets: [
      "제안사 일반현황 및 유사사업 수행실적 반영",
      "참여인력 이력과 역할별 전문성 증빙 추가",
      "신규 작가 후보군의 연령·중복 여부 최종 검증",
      "회차별 필진 후보안 및 취재 대상 예시 보강",
      "카드뉴스 샘플 및 기사 디자인 시안 추가",
    ],
  },
  {
    title: "신규 작가 운영 기준 보충",
    leadText: "신규 작가 선정은 단순 추천 방식이 아니라 기준표에 따른 정량·정성 검토를 병행한다.",
    bullets: [
      "활동 지속성, 전시이력, 매체 다양성, 국제 확장성, 자료 확보 가능성을 종합 평가",
      "기존 등록 작가와의 중복 여부 점검",
      "지역성과 세대 균형 반영",
      "센터 협의 후 최종 후보군 확정",
    ],
  },
  {
    title: "기획형 기사 세부 운영 포인트",
    leadText: "기획형 발간자료는 주제만 정하는 것이 아니라 기사별 기획 의도와 독자 경험을 세밀하게 설계해야 한다.",
    bullets: [
      "Insights는 정보 제공과 해석을 동시에 담는 분석형 기사",
      "Review는 현장 기록과 비평적 거리두기가 균형을 이루는 기사",
      "Spotlights는 인물의 활동 맥락과 목소리가 드러나는 인터뷰 기사",
      "국문과 영문 모두에서 제목, 리드, 캡션이 정보 중심으로 읽히도록 편집",
    ],
  },
  {
    title: "최종 제안 결론",
    leadText: "제안사는 Korean Artist Today의 자료 운영과 콘텐츠 발행을 안정적으로 수행함으로써 한국 미술의 기록과 확산을 동시에 강화하는 실질적 운영 파트너가 되고자 한다.",
    bullets: [
      "정확한 자료 관리",
      "기획력 있는 발간 콘텐츠",
      "국·영문 품질관리",
      "안정적 연간 운영체계",
      "확산까지 연결되는 2차 콘텐츠 구조",
    ],
  },
];

for (const page of extraPages) {
  pages.push({
    title: page.title,
    body: [
      lead(page.leadText),
      ...page.bullets.map((item) => bullet(item)),
      divider(),
    ].join(""),
  });
}

while (pages.length < 30) {
  pages.push({
    title: `보충 페이지 ${pages.length + 1}`,
    body: [
      lead("실제 제출 단계에서는 제안사 실적, 참여인력 이력, 유사사업 경험, 카드뉴스 시안 등 별첨 정보를 결합하여 완성도를 높인다."),
      bullet("유사사업 실적 정리"),
      bullet("참여인력 역할별 경력 추가"),
      bullet("기사 샘플 또는 카드뉴스 시안 추가"),
      bullet("제안사 고유 강점 문안 반영"),
    ].join(""),
  });
}

let rtf = "{\\rtf1\\ansi\\deff0\n";
rtf += "{\\fonttbl{\\f0 Malgun Gothic;}}\n";
rtf += "{\\colortbl;\\red23\\green50\\blue79;\\red23\\green55\\blue90;\\red63\\green103\\blue143;\\red95\\green117\\blue144;}\n";
rtf += "\\paperw11906\\paperh16838\\margl600\\margr600\\margt650\\margb650\\viewkind4\\uc1\n";

pages.forEach((page, index) => {
  if (index === 0) {
    rtf += page.body;
  } else {
    rtf += p(page.title, { size: 22, bold: true, color: 2, spaceAfter: 50 });
    rtf += page.body;
  }
  if (index < pages.length - 1) {
    rtf += pageBreak();
  }
});

rtf += "}";

fs.writeFileSync(outPath, rtf, "utf8");
console.log(outPath);
