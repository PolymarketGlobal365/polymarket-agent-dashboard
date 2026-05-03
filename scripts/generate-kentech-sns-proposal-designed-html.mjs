import fs from "node:fs";
import path from "node:path";

const outPath = path.resolve("output/proposal_2026_kentech_sns_designed.html");
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const esc = (text) =>
  String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const css = `
@page { size:A4 portrait; margin:0; }
@font-face { font-family:"ProposalKorean"; src:url("file:///C:/Windows/Fonts/malgun.ttf") format("truetype"); font-weight:400; }
@font-face { font-family:"ProposalKorean"; src:url("file:///C:/Windows/Fonts/malgunbd.ttf") format("truetype"); font-weight:700; }
:root { --ink:#112333; --muted:#607181; --navy:#153550; --blue:#1d5c88; --teal:#2f7b74; --gold:#bb9a52; --line:#d5dde6; --mist:#eef4f7; --sand:#f4f1ea; }
*{box-sizing:border-box} html,body{margin:0;padding:0;background:#d8dde2;color:var(--ink);font-family:"ProposalKorean","Malgun Gothic",sans-serif}
body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:210mm;min-height:297mm;margin:0 auto;padding:15mm 15mm 18mm;background:#fff;page-break-after:always;overflow:hidden}
.page:last-child{page-break-after:auto}
.cover{background:radial-gradient(circle at 84% 10%, rgba(29,92,136,.18), transparent 24%),radial-gradient(circle at 16% 85%, rgba(187,154,82,.12), transparent 24%),linear-gradient(135deg,#fbfbf8 0%,#f2f6f8 56%,#eaf1f6 100%)}
.cover::before,.cover::after{content:"";position:absolute;border-radius:999px;opacity:.9}
.cover::before{top:-30mm;right:-28mm;width:90mm;height:90mm;background:linear-gradient(135deg, rgba(21,53,80,.14), rgba(47,123,116,.04))}
.cover::after{left:-25mm;bottom:-32mm;width:78mm;height:78mm;background:linear-gradient(135deg, rgba(187,154,82,.10), rgba(21,53,80,.06))}
.cover-box{position:relative;min-height:263mm;border:1px solid rgba(21,53,80,.15);background:rgba(255,255,255,.78);padding:18mm 16mm 14mm}
.eyebrow,.badge,.pill,.section-kicker{display:inline-block;border-radius:999px;font-weight:700}
.eyebrow{padding:4px 10px;border:1px solid rgba(21,53,80,.22);font-size:9pt;letter-spacing:1.6px;color:var(--navy);background:rgba(255,255,255,.72)}
.cover-title{margin:18mm 0 4mm;font-size:25pt;line-height:1.3;color:var(--navy);font-weight:700}
.cover-subtitle{margin:0 0 9mm;font-size:11.4pt;color:var(--muted);line-height:1.74}
.cover-hero,.meta-grid,.grid,.toc{display:grid;gap:4mm}
.cover-hero{grid-template-columns:1.42fr .98fr;gap:8mm;margin-top:8mm}
.hero-panel,.meta-card,.card,.toc-list{border:1px solid rgba(21,53,80,.11);background:#fff}
.hero-panel{padding:7mm;background:linear-gradient(180deg, rgba(238,244,247,.94), rgba(255,255,255,.98))}
.hero-panel strong,.card-title{display:block;color:var(--navy);font-weight:700}
.hero-panel strong{margin-bottom:1.5mm;font-size:10pt}
.hero-panel p,.card p,.body,.lead,.note,.quote,.toc-list li{margin:0;line-height:1.74}
.badge-row,.pill-row{display:flex;flex-wrap:wrap;gap:6px}.badge-row{margin-top:6mm}.pill-row{margin-top:7mm}
.badge,.pill,.section-kicker{padding:4px 9px;font-size:8.5pt}
.badge{border:1px solid rgba(21,53,80,.17);background:rgba(255,255,255,.86);color:var(--blue)}
.pill{background:rgba(21,53,80,.07);color:var(--navy)}
.meta-grid,.grid-2,.toc{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-4{grid-template-columns:repeat(4,minmax(0,1fr))}
.meta-card{padding:5mm 5.5mm}.meta-card .label{display:block;margin-bottom:1.5mm;font-size:8.8pt;color:var(--muted)}.meta-card .value{font-size:10.1pt;line-height:1.65;font-weight:600}
.cover-footer,.section-footer{position:absolute;left:16mm;right:16mm;bottom:14mm;display:flex;justify-content:space-between;font-size:9pt;color:var(--muted)}
.section-cover{background:linear-gradient(180deg, rgba(244,241,234,.95), rgba(255,255,255,1) 58%),linear-gradient(90deg, rgba(21,53,80,.04), transparent 36%)}
.section-kicker{background:var(--sand);color:var(--navy);letter-spacing:.7px}
.section-number{margin:18mm 0 6mm;font-size:48pt;line-height:1;color:rgba(21,53,80,.15);font-weight:700}
.section-title{margin:0;font-size:26pt;line-height:1.18;color:var(--navy)}
.section-summary{margin-top:10mm;max-width:138mm;padding:6.5mm 7mm;background:rgba(255,255,255,.84);border-left:3.2mm solid var(--gold);font-size:11pt;line-height:1.84}
.header-band{display:flex;align-items:flex-end;justify-content:space-between;gap:8mm;margin-bottom:5mm}
.page-title{margin:0;padding-top:9mm;font-size:17pt;line-height:1.32;color:var(--navy);font-weight:700}
.page-subtitle{margin:2mm 0 0;font-size:9.2pt;color:var(--muted);line-height:1.68}
.chapter-mark{margin-top:7mm;min-width:24mm;text-align:right;font-size:10.5pt;color:var(--gold);font-weight:700}
.lead{margin:0 0 4.5mm;padding:5mm 5.5mm;background:linear-gradient(180deg, #f7fafc, #ffffff);border:1px solid rgba(21,53,80,.10);font-size:10.5pt;color:#30485d}
.block-title{margin:5mm 0 2.6mm;font-size:11pt;color:var(--navy)}
.body{margin-bottom:2.5mm;font-size:9.9pt;color:#203244}
.card{padding:4.8mm 5.2mm;background:linear-gradient(180deg, #fbfcfd, #ffffff)}
.card-title{margin-bottom:1.6mm;font-size:10.3pt}
.card p{font-size:9.3pt;color:#31475b}
.bullet-list{margin:0;padding-left:4.6mm;color:#31475b}.bullet-list li{margin-bottom:1.4mm;font-size:9.2pt;line-height:1.68}
.table{width:100%;border-collapse:collapse;margin-top:1.5mm;border:1px solid #c8d3dd}
.table th,.table td{border:1px solid #c8d3dd;padding:7px 8px;vertical-align:top;font-size:9.1pt;line-height:1.62}
.table th{background:#eef4f8;color:var(--navy);font-weight:700}.table td{color:#203244}
.toc-list{padding:5mm 5.5mm;background:linear-gradient(180deg, #fafcfd, #ffffff)}.toc-list ol{margin:0;padding-left:5.2mm}.toc-list li{margin-bottom:1.5mm;font-size:9.4pt;color:#213547}
.quote{margin-top:4mm;padding:5mm 5.6mm;background:linear-gradient(90deg, rgba(21,53,80,.06), rgba(255,255,255,1));border-left:3mm solid var(--teal);font-size:10pt;color:#27425a}
.note{margin-top:4mm;padding:4.5mm 5mm;border:1px dashed #b7c5d1;background:#fcfdfd;font-size:9.2pt;color:#556778}
.page-no{position:absolute;right:15mm;bottom:10mm;font-size:9pt;color:#6d7d8b;border-top:1px solid #d0d9e1;padding-top:3px;min-width:18mm;text-align:right}
`;

const pages = [
  {
    type: "cover",
    title: "2026 한국에너지공과대학교\nSNS 홍보대행 용역 제안서",
    subtitle:
      "공공입찰 제출 형식에 맞춘 정제된 정보 구조와 대학 브랜드에 적합한 SNS 운영 전략을 결합한 제안서입니다. 학교의 미션, 연구 경쟁력, 학생 경험, 입시 커뮤니케이션을 유기적으로 연결하는 통합 홍보 체계를 제안합니다.",
    badges: ["유튜브 롱폼 6편", "유튜브 숏폼 20편", "카드뉴스 24건", "블로그 24건", "캠퍼스 취재 3회 이상", "이벤트 9회 운영"],
    hero:
      "한국에너지공과대학교 SNS는 단순 소식 전달 채널이 아니라 대학의 존재 이유와 성장 가능성을 설명하는 브랜드 플랫폼이어야 합니다. 본 제안은 전략 수립, 채널 운영, 콘텐츠 제작, 광고·이벤트, 댓글 대응, 성과 분석을 하나의 운영 루프로 구성하여 학교의 미션과 강점을 일관되게 축적하는 구조를 설계합니다.",
    meta: [
      ["제안명", "2026 한국에너지공과대학교 SNS 홍보대행 용역"],
      ["제안사", "[제안사명 기입]"],
      ["총괄 PM", "[성명 / 직위 / 연락처]"],
      ["문서 성격", "공공입찰 제출용 디자인 초안"],
    ],
    pills: ["브랜드형 SNS 구축", "정보 전달형 운영 체계", "성과 기반 개선 루프", "타깃 맞춤 메시지 설계"],
  },
  {
    type: "content",
    mark: "02",
    title: "제안 핵심 요약 및 목차",
    subtitle: "평가위원이 빠르게 구조를 이해할 수 있도록 제안 논리와 전체 구성부터 제시합니다.",
    lead:
      "본 제안은 전략 수립, 채널 운영, 콘텐츠 제작, 광고·이벤트, 성과 분석의 다섯 축을 중심으로 한국에너지공과대학교 SNS 운영 체계를 입체적으로 설계한 문서입니다.",
    sections: [
      { kind: "cards", title: "제안 핵심", cols: 2, items: [
        ["브랜드 통합", "대학의 미션과 강점을 하나의 서사로 묶어 각 채널에 일관되게 반영합니다."],
        ["채널 최적화", "유튜브, 인스타그램, 페이스북, 블로그를 동일 소재 복제 없이 역할별로 분화 운영합니다."],
        ["상시 협의 체계", "홈페이지, 부서, 학생 조직, 행사 운영팀을 연결하는 정보 수급 구조를 만듭니다."],
        ["성과 중심 운영", "콘텐츠 반응, 광고 효율, 댓글 유형, 팔로워 증감을 함께 분석해 다음 기획에 반영합니다."],
      ]},
      { kind: "toc", left: ["1. 제안 개요","2. 사업 이해 및 추진 배경","3. 홍보 목표 정의","4. 환경 분석 및 시사점","5. 타깃 분석 및 커뮤니케이션 전략","6. 제안 콘셉트 및 핵심 메시지","7. 채널 통합 운영 전략","8. 유튜브 운영 및 영상 전략","9. 인스타그램·페이스북 운영 전략","10. 네이버 블로그 운영 전략","11. 콘텐츠 체계 및 카테고리 설계","12. 월간 운영 물량 및 편성 계획"], right: ["13. 캠퍼스 취재 및 제작 프로세스","14. 정보 수급 체계 및 협의 채널","15. 광고·이벤트 운영 전략","16. 댓글·문의 대응 및 사후관리","17. 성과 분석 및 개선 체계","18. 수행 조직 및 인력 운영 계획","19. 추진 일정","20. 품질관리·리스크 대응 방안","21. 기대효과","22. 제안사 차별화 포인트","23. 결론 및 요청사항"]},
      { kind: "note", text: "실제 제출본에서는 회사 일반현황, 신용평가등급, 투입인력 실명, 포트폴리오, 유사 실적, 별첨 서식을 제안사 보유 자료로 교체합니다." },
    ],
  },
];

pages.push(
  {
    type: "section",
    mark: "03",
    kicker: "PART 01",
    title: "제안 개요",
    summary: "본 장에서는 한국에너지공과대학교 SNS 홍보대행 용역의 목적을 재정의하고, 제안의 핵심 방향과 기대 역할을 공공입찰 문서의 언어로 정리합니다.",
  },
  {
    type: "content",
    mark: "04",
    title: "제안 개요",
    subtitle: "학교의 미션, 채널 운영 목적, 실무 수행 범위를 하나의 문장으로 통합합니다.",
    lead: "한국에너지공과대학교는 에너지 과학기술과 산업 생태계 혁신을 주도할 고급 인재 양성을 목표로 하는 국내 유일의 에너지 특화 대학입니다.",
    sections: [
      { kind: "text", paragraphs: [
        "이번 SNS 홍보대행 용역은 학교의 미션과 강점을 선명하게 전달하는 브랜드형 콘텐츠를 만들고, 입시와 학사일정, 연구 성과, 학생생활을 적시에 게시하며, 지속적인 반응 관리와 성과 분석을 통해 채널 관심도를 높이는 통합 운영 사업입니다.",
        "따라서 수행사는 단순 콘텐츠 제작사가 아니라 전략 수립자, 콘텐츠 제작 파트너, 채널 운영자, 데이터 분석자 역할을 동시에 수행해야 하며, 대학 담당자와 상시 협의 가능한 운영 구조를 갖추어야 합니다.",
      ]},
      { kind: "cards", title: "제안 목표", cols: 3, items: [
        ["목표 1. 브랜드 강화", "한국에너지공과대학교만의 정체성과 존재 이유를 명확히 보이는 SNS 체계를 구축합니다."],
        ["목표 2. 적시 운영", "학사 일정, 특강, 행사, 입시 정보를 시의성 있게 게시하여 정보 공백을 최소화합니다."],
        ["목표 3. 관심도 증대", "광고, 이벤트, 반응 관리, 댓글 대응을 통해 팔로워와 구독자의 실제 참여를 유도합니다."],
      ]},
    ],
  },
  {
    type: "content",
    mark: "05",
    title: "사업 이해 및 추진 배경",
    subtitle: "왜 지금 한국에너지공과대학교에 맞춤형 SNS 전략이 필요한지를 정의합니다.",
    lead: "대학 SNS는 더 이상 단순 공지판이 아니라 수험생, 학부모, 산업계, 유관기관이 학교를 처음 경험하는 브랜드 접점입니다.",
    sections: [
      { kind: "cards", title: "과업 배경", cols: 2, items: [
        ["브랜드 설명 필요", "에너지 특화 대학이라는 차별점은 강력하지만, 이를 타깃별 언어로 설명하지 않으면 인식 전환까지 이어지기 어렵습니다."],
        ["시의성 관리 필요", "입시 일정, 특강, 학생행사, 연구성과는 적시에 게시될 때만 정보 가치와 반응성이 확보됩니다."],
        ["상시 협의 필요", "부서별 수요와 의견을 빠르게 반영할 수 있는 협의 채널이 있어야 현장감 있는 SNS가 유지됩니다."],
        ["전문 운영 필요", "콘텐츠 기획, 영상 제작, 디자인, 업로드, 댓글 대응, 광고 집행까지 전문화된 분업 구조가 요구됩니다."],
      ]},
      { kind: "quote", text: "이번 과업의 본질은 단순 홍보물이 아니라 한국에너지공과대학교를 살아 있는 대학 브랜드로 지속적으로 보여주는 운영 시스템을 만드는 것입니다." },
    ],
  },
  {
    type: "section",
    mark: "06",
    kicker: "PART 02",
    title: "사업 이해 및 환경 분석",
    summary: "본 장에서는 대학 홍보 시장 환경, SNS 이용 패턴, 한국에너지공과대학교의 고유 강점을 분석하고, 어떤 방향의 콘텐츠가 실효성을 가질지를 도출합니다.",
  },
  {
    type: "content",
    mark: "07",
    title: "환경 분석 및 시사점",
    subtitle: "대학 SNS 경쟁 환경과 이용자 소비 방식의 변화를 분석합니다.",
    lead: "현재 대학 홍보는 짧은 정보 소비, 현장 중심 콘텐츠, 검색 기반 탐색, 반복 노출을 통한 친숙도 형성이 동시에 요구되는 구조로 바뀌고 있습니다.",
    sections: [
      { kind: "cards", title: "주요 환경 변화", cols: 2, items: [
        ["숏폼 중심 확산", "짧은 영상은 발견성과 도달을 높이며, 특히 예비 수험생과 재학생 접점에서 강력한 반응을 유도합니다."],
        ["검색형 정보 탐색 지속", "네이버 블로그와 검색 노출은 입시, 대학생활, 진로 탐색 과정에서 여전히 강한 영향력을 가집니다."],
        ["현장감 있는 콘텐츠 선호", "학생의 실제 경험, 연구실과 캠퍼스 현장, 프로젝트 과정은 정적 홍보문보다 높은 공감을 얻습니다."],
        ["대학 간 경쟁 심화", "유사한 포맷의 홍보물이 넘치는 상황에서 대학 고유의 철학과 장점을 시각적으로 차별화해야 합니다."],
      ]},
      { kind: "note", text: "한국에너지공과대학교는 '에너지 특화', '혁신 교육', '연구 중심', '미래 산업 연계'라는 강력한 고유 자산을 보유하고 있어, 이를 콘텐츠화하는 전략이 중요합니다." },
    ],
  },
  {
    type: "content",
    mark: "08",
    title: "타깃 분석 및 커뮤니케이션 전략",
    subtitle: "타깃별 질문에 맞춰 메시지를 분리해야 설득력이 높아집니다.",
    lead: "동일한 학교 정보라도 누가 보느냐에 따라 기대하는 답은 다릅니다. 따라서 메시지 구조 역시 수험생, 학부모, 산업계, 교내 구성원 기준으로 달라져야 합니다.",
    sections: [
      { kind: "table", title: "타깃별 메시지 구조", headers: ["타깃", "주요 관심사", "권장 메시지 톤", "주요 채널"], rows: [
        ["수험생", "전공, 진로, 학생 경험, 캠퍼스 분위기", "명확하고 직관적인 미래 지향 톤", "유튜브 숏폼, 인스타그램, 블로그"],
        ["학부모", "교육 품질, 진학 안정성, 대학 신뢰도", "정돈되고 신뢰감 있는 설명 톤", "블로그, 페이스북, 롱폼 영상"],
        ["유관기관·산업계", "연구 역량, 협력 가능성, 특화성", "전문적이고 공신력 있는 톤", "유튜브 롱폼, 페이스북"],
        ["재학생·교내 구성원", "참여감, 행사, 소속감, 소통", "친근하고 반응성 높은 톤", "인스타그램, 유튜브 숏폼"],
      ]},
      { kind: "quote", text: "타깃별 메시지는 달라도 최종적으로는 '에너지의 미래를 배우고 만들고 연결하는 대학'이라는 하나의 브랜드 문장으로 수렴되어야 합니다." },
    ],
  },
  {
    type: "content",
    mark: "09",
    title: "한국에너지공과대학교 SWOT 및 홍보 시사점",
    subtitle: "대학의 고유 경쟁력을 SNS 운영 전략으로 번역합니다.",
    lead: "학교의 차별점은 이미 존재합니다. 중요한 것은 그것을 사람들이 이해하기 쉬운 장면과 표현으로 바꾸는 일입니다.",
    sections: [
      { kind: "bullet-cards", title: "SWOT 분석", cols: 4, items: [
        { title: "Strength", bullets: ["에너지 분야 특화 대학", "혁신적 공학교육 모델", "연구 경쟁력과 미래산업 연계성"] },
        { title: "Weakness", bullets: ["대중 인지도 추가 확장 필요", "학교 철학을 쉽게 설명하는 콘텐츠 보강 필요"] },
        { title: "Opportunity", bullets: ["에너지 전환 이슈 확대", "미래 기술·진로 관심 증가", "숏폼 기반 확산성 확대"] },
        { title: "Threat", bullets: ["대학 홍보 콘텐츠의 유사화", "입시 시즌 경쟁 심화", "짧은 주목 시간"] },
      ]},
      { kind: "note", text: "시사점: 학교 소개를 추상적으로 길게 설명하기보다, 실제 수업·연구·학생 경험 장면을 짧고 분명하게 보여주는 전략이 가장 효과적입니다." },
    ],
  },
  {
    type: "content",
    mark: "10",
    title: "기존 채널 진단 프레임",
    subtitle: "착수 단계에서 실제 계정 운영 진단을 이 프레임으로 수행합니다.",
    lead: "과업지시서가 요구하는 SNS 홍보 현황 진단 및 실태 분석은 운영 방식, 콘텐츠 유형, 반응도, 채널 역할, 이미지 일관성까지 함께 다뤄야 합니다.",
    sections: [
      { kind: "table", title: "채널 진단 항목", headers: ["진단 항목", "세부 질문", "주요 지표", "개선 방향"], rows: [
        ["운영 방식", "정기 업로드가 유지되고 있는가", "월별 게시 수, 업로드 간격", "월간 캘린더 정착"],
        ["콘텐츠 유형", "무엇이 반복되고 무엇이 부족한가", "포맷별 비중, 주제 분포", "카테고리 재설계"],
        ["반응도", "어떤 포맷이 관심을 얻는가", "조회, 저장, 공유, 댓글", "반응형 포맷 확대"],
        ["채널 역할", "채널별 차별성이 있는가", "중복도, 클릭 흐름", "역할 분리 운영"],
        ["브랜드 일관성", "학교의 인상이 한 문장으로 설명되는가", "디자인·카피 일관성", "통합 가이드 구축"],
      ]},
      { kind: "text", paragraphs: ["착수 후 실제 채널 데이터를 기반으로 현황을 재진단한 뒤, 본 제안서의 전략을 계정 현실에 맞게 조정하여 실행하겠습니다."] },
    ],
  },
  {
    type: "section",
    mark: "11",
    kicker: "PART 03",
    title: "콘텐츠 및 채널 전략",
    summary: "본 장에서는 채널별 역할, 핵심 메시지, 콘텐츠 카테고리, 영상 전략, 카드뉴스 및 블로그 설계까지 실제 운영 단위로 제시합니다.",
  },
  {
    type: "content",
    mark: "12",
    title: "제안 콘셉트 및 핵심 메시지",
    subtitle: "학교의 정체성을 모든 채널에 일관되게 반영하기 위한 메인 콘셉트입니다.",
    lead: "본 제안의 통합 콘셉트는 '에너지의 미래를 배우고, 만들고, 연결하는 대학'입니다.",
    sections: [
      { kind: "text", paragraphs: [
        "한국에너지공과대학교는 에너지 분야를 배우는 공간을 넘어, 미래 산업 문제를 해결하기 위해 교육과 연구, 실험과 협업이 하나로 연결되는 대학이라는 인식을 만들어야 합니다.",
      ]},
      { kind: "cards", title: "핵심 메시지", cols: 2, items: [
        ["핵심 메시지 1", "한국에너지공과대학교는 에너지 특화 미래 대학이다."],
        ["핵심 메시지 2", "학생은 수업과 프로젝트, 연구와 캠퍼스 경험을 통해 실전형 성장을 경험한다."],
        ["핵심 메시지 3", "연구 성과와 교육 혁신이 실제 산업과 진로로 연결된다."],
        ["핵심 메시지 4", "학교의 주요 소식과 일정은 빠르고 정확하게 전달된다."],
      ]},
    ],
  },
  {
    type: "content",
    mark: "13",
    title: "채널 통합 운영 전략",
    subtitle: "4개 채널을 같은 소재 반복이 아닌 역할 분담 구조로 설계합니다.",
    lead: "동일 소재를 모든 채널에 그대로 복제하면 효율은 높아 보이지만 반응은 낮아집니다. 따라서 채널별 사용 맥락에 맞는 재가공이 필요합니다.",
    sections: [
      { kind: "table", title: "채널별 역할", headers: ["채널", "핵심 역할", "주요 포맷", "운영 포인트"], rows: [
        ["유튜브", "브랜드 서사와 신뢰 형성", "롱폼, 숏폼, 썸네일, 채널 스킨", "학교의 차별성과 스토리를 깊이 있게 전달"],
        ["인스타그램", "공감, 빠른 전달, 참여 유도", "릴스, 카드뉴스, 이벤트 포스트", "학생 타깃 중심 반응형 운영"],
        ["페이스북", "공식 정보 재확산 및 기관형 전달", "요약형 포스트, 행사·성과 콘텐츠", "신뢰감 있는 정보 구조 유지"],
        ["네이버 블로그", "검색형 정보 축적", "장문형 설명 콘텐츠", "입시·학교생활 탐색 수요 흡수"],
      ]},
      { kind: "note", text: "운영 기준: 하나의 이슈를 각 채널에 맞는 문법으로 재편집하고, 최종적으로는 학교 홈페이지 또는 관련 채널로 유입을 유도합니다." },
    ],
  },
  {
    type: "content",
    mark: "14",
    title: "콘텐츠 카테고리 및 시리즈 체계",
    subtitle: "과업지시서의 범위를 실제 제작 단위로 분해합니다.",
    lead: "콘텐츠는 대학 관련, 입시 관련, 교육 관련, 학생 생활 관련, 기타의 5대 카테고리로 운영하되, 연재감 있는 시리즈 단위로 재구성해 채널 기억도를 높입니다.",
    sections: [
      { kind: "bullet-cards", title: "카테고리 체계", cols: 3, items: [
        { title: "대학 관련", bullets: ["학교 소개", "공식 행사", "미션·비전", "언론보도", "연구혁신 사례"] },
        { title: "입시 관련", bullets: ["학생 모집 일정", "대학원 정보", "연구트랙 소개", "면접 안내"] },
        { title: "교육 관련", bullets: ["프로젝트 성과", "RC 프로그램", "수업 혁신", "학술활동·수상"] },
        { title: "학생 생활 관련", bullets: ["축제·체육대회", "동아리", "해외 프로그램", "캠퍼스 일상"] },
        { title: "기타", bullets: ["시설 소개", "주변 인프라", "이벤트", "이미지 제고형 콘텐츠"] },
        { title: "대표 시리즈 예시", bullets: ["학생의 하루", "KENTECH 연구 한 컷", "입시 한눈에 보기", "캠퍼스 스팟"] },
      ]},
    ],
  },
  {
    type: "content",
    mark: "15",
    title: "유튜브 운영 및 영상 전략",
    subtitle: "브랜드를 설명하는 롱폼과 확산을 담당하는 숏폼을 동시에 운영합니다.",
    lead: "유튜브는 학교의 서사를 가장 밀도 있게 전달할 수 있는 중심 채널입니다. 따라서 롱폼과 숏폼의 역할을 명확히 구분하겠습니다.",
    sections: [
      { kind: "bullet-cards", title: "유튜브 실행 전략", cols: 2, items: [
        { title: "롱폼 6편", bullets: ["학교 미션과 비전", "교육 혁신", "연구 성과", "입시 안내", "학생 프로젝트", "캠퍼스 라이프"] },
        { title: "숏폼 20편", bullets: ["행사 하이라이트", "짧은 공간 소개", "학생 인터뷰", "교수·연구자 한마디", "입시 알림"] },
        { title: "영상 제작 원칙", bullets: ["첫 3초 메시지 명확화", "자막 가독성 강화", "후킹 포인트 선제 배치", "행동 유도 문구 삽입"] },
        { title: "채널 디자인", bullets: ["시즌별 스킨 3종", "통일형 썸네일 시스템", "학교 이미지에 맞는 타이포 구조"] },
      ]},
      { kind: "quote", text: "롱폼은 신뢰를 만들고, 숏폼은 발견을 만든다는 원칙으로 역할을 분리하면 채널의 성장이 안정적입니다." },
    ],
  },
  {
    type: "content",
    mark: "16",
    title: "인스타그램·페이스북 운영 전략",
    subtitle: "감도 높은 확산 채널과 공식 정보 확산 채널을 분리해 운영합니다.",
    lead: "인스타그램은 학생과 예비 수험생의 시선에 맞춰 감도와 속도를 높이고, 페이스북은 정돈된 정보성과 공식성을 유지하는 방향으로 설계합니다.",
    sections: [
      { kind: "table", title: "플랫폼별 운영 구분", headers: ["구분", "인스타그램", "페이스북"], rows: [
        ["핵심 역할", "반응 유도·참여 확대", "정보 재확산·신뢰 확보"],
        ["주요 포맷", "릴스, 카드뉴스, 이벤트", "요약형 게시물, 성과 소개, 행사 안내"],
        ["타깃", "수험생, 재학생", "학부모, 기관, 교직원"],
        ["운영 포인트", "짧은 카피, 강한 시각 후킹, 저장·공유 유도", "정제된 문장, 핵심 정보 요약, 공신력 유지"],
      ]},
      { kind: "text", paragraphs: ["단문 콘텐츠 24건은 월별 핵심 이슈에 맞춰 배치하고, 입시와 행사 시즌에는 광고와 이벤트를 병행해 도달과 참여를 함께 높이겠습니다."] },
    ],
  },
  {
    type: "content",
    mark: "17",
    title: "네이버 블로그 운영 전략",
    subtitle: "검색을 통해 학교를 알아보는 사용자에게 깊이 있는 정보를 제공합니다.",
    lead: "블로그는 빠른 반응보다 신뢰와 검색 노출, 체류시간이 중요한 채널입니다. 따라서 정리력과 정보 구조화가 핵심입니다.",
    sections: [
      { kind: "bullet-cards", title: "블로그 운영 원칙", cols: 2, items: [
        { title: "운영 목표", bullets: ["학교 탐색형 정보 축적", "입시 관련 검색 유입 확보", "학부모 설득 자료화"] },
        { title: "주요 콘텐츠", bullets: ["모집 일정", "연구트랙 설명", "학생생활 안내", "시설·캠퍼스 소개", "행사 후기"] },
        { title: "검색 최적화", bullets: ["키워드 구조화", "소제목 분리", "FAQ형 문단 구성", "이미지 캡션 정리"] },
        { title: "운영 물량", bullets: ["총 24건", "월 2건 이상 정기 발행", "핵심 시즌 증량 운영"] },
      ]},
      { kind: "note", text: "블로그는 단순 홍보문이 아니라 '질문 하나에 답하는 문서'로 쓰는 것이 중요하며, 이는 입시 탐색 단계의 설득력으로 이어집니다." },
    ],
  }
);

pages.push(
  {
    type: "section",
    mark: "18",
    kicker: "PART 04",
    title: "운영 계획 및 실행 체계",
    summary: "본 장에서는 월간 편성, 캠퍼스 취재, 정보 수급, 협의 채널, 광고·이벤트, 댓글 대응까지 실제 운영 프로세스를 제시합니다.",
  },
  {
    type: "content",
    mark: "19",
    title: "월간 운영 물량 및 편성 계획",
    subtitle: "최소 수행 물량을 충족하면서도 시기별 중요도를 반영한 편성 구조입니다.",
    lead: "본 과업은 요구 물량을 단순 분배하는 방식이 아니라, 입시·행사·연구 이슈의 밀도를 반영한 달력형 편성이 중요합니다.",
    sections: [
      { kind: "table", title: "운영 물량 계획", headers: ["매체", "수량", "운영 방식", "비고"], rows: [
        ["유튜브 롱폼", "6개", "분기별 핵심 주제 집중 편성", "최소 5분 이상"],
        ["유튜브 숏폼", "20개", "월별 상시 운영 + 시즌 증량", "확산형 콘텐츠"],
        ["인스타그램·페이스북 단문 콘텐츠", "24개", "월 2건 이상 핵심 이슈 중심", "카드뉴스 등"],
        ["네이버 블로그", "24개", "월 2건 이상 정기 발행", "검색형 정보 아카이브"],
        ["캠퍼스 현장 영상 취재", "최소 3회", "행사·학생생활·입시 시즌 중심", "현장 촬영 기반"],
        ["이벤트", "9회", "주요 일정 연계", "채널 활성화용"],
      ]},
      { kind: "text", paragraphs: ["월간 계획안은 사전 협의 후 확정하고, 주간 실행안은 갑작스러운 일정 변경이나 현장 이슈를 반영해 탄력적으로 조정하겠습니다."] },
    ],
  },
  {
    type: "content",
    mark: "20",
    title: "캠퍼스 현장 취재 및 제작 프로세스",
    subtitle: "현장성이 살아 있는 대학 홍보를 위해 최소 3회 이상 직접 취재를 수행합니다.",
    lead: "정적인 자료 재편집만으로는 학교의 온도와 생동감을 충분히 전달하기 어렵습니다. 따라서 캠퍼스 현장 취재는 반드시 운영 전략 안에 포함되어야 합니다.",
    sections: [
      { kind: "cards", title: "현장 취재 배치", cols: 3, items: [
        ["1차 취재", "브랜드 핵심 장면 확보. 캠퍼스 전경, 수업 공간, 학생 인터뷰, 연구 환경 중심 아카이브 구축."],
        ["2차 취재", "주요 행사·프로그램 중심 촬영. 특강, 축제, 프로젝트 발표, RC 프로그램 등 시의성 강화."],
        ["3차 취재", "입시와 관심 집중 시점 촬영. 연구트랙, 학교생활, 면접 안내 등 전환형 콘텐츠 집중 제작."],
      ]},
      { kind: "note", text: "취재 전에는 컷리스트, 인터뷰 질문지, 촬영 동선표를 제출하고, 촬영 후에는 프리뷰 컷 및 편집 방향을 대학 담당자와 즉시 공유합니다." },
    ],
  },
  {
    type: "content",
    mark: "21",
    title: "정보 수급 체계 및 상시 협의 채널",
    subtitle: "좋은 SNS 운영은 촘촘한 정보 수급 구조에서 시작됩니다.",
    lead: "과업지시서가 요구한 1차 정보와 2차 정보 수집 구조를 실제 운영 가능한 프로세스로 전환합니다.",
    sections: [
      { kind: "table", title: "정보 수급 구조", headers: ["구분", "주요 채널", "수집 목적", "운영 방식"], rows: [
        ["1차 정보", "대학 홈페이지, 공지사항, 보도자료, 게시판", "공식 일정 및 기본 정보 확보", "상시 모니터링"],
        ["2차 정보", "부서 담당자, 연구실, 학생조직, 홍보대사", "현장감 있는 소재 확보", "주간 안건 수집"],
        ["실시간 협의", "메신저 협의방", "긴급 요청 및 확인", "상시 운영"],
        ["정기 협의", "월간 회의", "운영 계획 및 실적 공유", "월 1회 이상"],
      ]},
      { kind: "quote", text: "정보가 모이는 구조를 만들면 콘텐츠 제작이 쉬워지고, 콘텐츠가 쌓이면 채널이 살아납니다." },
    ],
  },
  {
    type: "content",
    mark: "22",
    title: "광고·이벤트 운영 전략",
    subtitle: "주요 일정에 관심을 집중시키는 증폭 장치를 설계합니다.",
    lead: "이벤트와 광고는 단순한 활성화 수단이 아니라, 입시와 브랜드 이슈를 타깃에게 정확하게 도달시키는 보조 전략입니다.",
    sections: [
      { kind: "bullet-cards", title: "실행 전략", cols: 2, items: [
        { title: "유튜브 타깃 광고", bullets: ["롱폼 주요 편", "숏폼 핵심 메시지 영상", "입시 시즌 관심 타깃 세분화"] },
        { title: "인스타그램 광고", bullets: ["카드뉴스 노출 강화", "이벤트 참여 확대", "수험생·재학생 세그먼트 운영"] },
        { title: "이벤트 9회 운영", bullets: ["개교기념일", "입시면접", "수능 이후 탐색 시기", "교내 대표 행사 연계"] },
        { title: "후속 업무", bullets: ["당첨자 발표", "경품 발송", "결과 리포트", "재참여 유도 장치 설계"] },
      ]},
      { kind: "text", paragraphs: ["광고 집행은 콘텐츠 목적에 따라 도달형, 관심 유도형, 일정 안내형으로 나누고, 이벤트는 일정성 이벤트와 참여형 이벤트를 조합해 운영하겠습니다."] },
    ],
  },
  {
    type: "content",
    mark: "23",
    title: "댓글·문의 대응 및 사후관리",
    subtitle: "게시물 발행 이후의 응대 품질이 채널 신뢰도를 결정합니다.",
    lead: "질문형 댓글과 메시지에 대한 빠른 대응은 단순 CS가 아니라 학교에 대한 신뢰를 만드는 중요한 접점입니다.",
    sections: [
      { kind: "bullet-cards", title: "운영 원칙", cols: 2, items: [
        { title: "응대 원칙", bullets: ["당일 처리 원칙", "민감 이슈 단계별 대응", "공식 정보 우선 확인"] },
        { title: "매뉴얼화", bullets: ["자주 묻는 질문 유형화", "부서 확인 루트 정리", "승인 기준 명확화"] },
        { title: "운영 로그", bullets: ["질문 빈도 분석", "오해 포인트 추적", "다음 콘텐츠 기획 반영"] },
        { title: "사후관리", bullets: ["반응 모니터링", "게시물 유형별 개선", "팔로워·구독자 증감 관리"] },
      ]},
    ],
  },
  {
    type: "section",
    mark: "24",
    kicker: "PART 05",
    title: "성과관리 및 수행 체계",
    summary: "본 장에서는 정량·정성 지표, 월간 리포팅 방식, 수행 조직, 추진 일정, 리스크 관리 체계를 제시하여 실행 가능성을 뒷받침합니다.",
  },
  {
    type: "content",
    mark: "25",
    title: "성과 분석 및 개선 체계",
    subtitle: "조회수 집계를 넘어 어떤 포맷이 어떤 타깃에 반응했는지 해석합니다.",
    lead: "성과 분석은 잘한 게시물을 칭찬하는 작업이 아니라, 다음 달 편성 전략을 더 정확하게 만드는 피드백 구조여야 합니다.",
    sections: [
      { kind: "table", title: "채널별 성과 분석 구조", headers: ["구분", "주요 지표", "분석 포인트", "활용 방식"], rows: [
        ["유튜브", "조회수, 시청지속시간, 구독 전환", "주제별 유지율과 후킹 구간", "영상 길이·편집 방식 보정"],
        ["인스타그램", "도달수, 저장, 공유, 댓글", "공감형 포맷과 정보형 포맷 비교", "카드뉴스·릴스 비중 조정"],
        ["페이스북", "도달, 링크 클릭, 반응", "공식형 콘텐츠 반응 추이", "재확산용 포스트 개선"],
        ["블로그", "조회수, 유입 키워드, 체류시간", "검색형 수요와 정보 구조 적합성", "SEO형 주제 강화"],
      ]},
      { kind: "note", text: "월간 보고서는 채널별 실적표, 주요 반응 게시물 분석, 광고 효율, 이벤트 결과, 다음 달 개선안까지 포함하는 의사결정 자료로 구성합니다." },
    ],
  },
  {
    type: "content",
    mark: "26",
    title: "수행 조직 및 인력 운영 계획",
    subtitle: "전략, 제작, 운영, 데이터 분석이 분리되면서도 PM 아래 유기적으로 연결되는 구조입니다.",
    lead: "대학 SNS는 빠른 협의와 높은 품질을 동시에 요구하므로, 업무 분장이 명확하면서도 의사결정 구조가 단순해야 합니다.",
    sections: [
      { kind: "bullet-cards", title: "수행 조직 구성", cols: 2, items: [
        { title: "총괄 PM", bullets: ["대학 커뮤니케이션", "일정·품질 총괄", "이슈 대응", "보고 체계 관리"] },
        { title: "콘텐츠 기획 리드", bullets: ["월간 캘린더", "시리즈 설계", "카피 방향", "승인안 정리"] },
        { title: "영상 제작 파트", bullets: ["롱폼·숏폼 기획", "촬영", "편집", "자막·썸네일 제작"] },
        { title: "디자인·운영·분석 파트", bullets: ["카드뉴스·커버 제작", "업로드·댓글 대응", "성과 리포트", "광고 효율 분석"] },
      ]},
      { kind: "text", paragraphs: ["실제 제출본에는 참여인력 조직도, 역할별 경력 요약, 포트폴리오 제작자 실투입 계획을 별첨 서식에 맞춰 삽입하겠습니다."] },
    ],
  },
  {
    type: "content",
    mark: "27",
    title: "추진 일정 및 보고 체계",
    subtitle: "착수부터 최종보고까지 단계별로 관리합니다.",
    lead: "계약 이후에는 초기 진단과 운영 가이드 수립, 월간 실행, 중간 점검, 최종 보고의 4단계 흐름으로 프로젝트를 운영합니다.",
    sections: [
      { kind: "table", title: "단계별 추진 계획", headers: ["단계", "주요 내용", "핵심 산출물"], rows: [
        ["착수", "채널 진단, 타깃 정의, 운영 프레임 수립", "착수보고서, 운영 가이드, 초기 캘린더"],
        ["실행", "콘텐츠 제작·배포, 광고·이벤트 운영", "월간 콘텐츠, 업로드 내역, 이벤트 결과"],
        ["점검", "반응 분석, 이슈 조정, 포맷 개선", "월간 성과 보고서, 개선안"],
        ["보고", "중간·최종 보고, 산출물 정리", "최종 보고서, 원본 파일, 기록 매체"],
      ]},
      { kind: "cards", title: "보고 체계", cols: 2, items: [
        ["정기 보고", "월 1회 서면 보고 및 필요 시 회의 보고를 통해 진행 현황과 개선안을 공유합니다."],
        ["수시 협의", "긴급 일정, 중요 행사, 민감 이슈는 메신저와 유선 커뮤니케이션을 통해 즉시 대응합니다."],
      ]},
    ],
  },
  {
    type: "content",
    mark: "28",
    title: "품질관리 및 리스크 대응 방안",
    subtitle: "공공기관 수준의 문서 정확성과 현장 대응성을 동시에 확보합니다.",
    lead: "대학 SNS 운영에서는 작은 정보 오류도 신뢰도 저하로 이어질 수 있으므로, 일반 홍보보다 높은 수준의 검수 구조가 필요합니다.",
    sections: [
      { kind: "bullet-cards", title: "리스크 대응 체계", cols: 2, items: [
        { title: "정확성 관리", bullets: ["사실관계 확인", "담당부서 재확인", "입시·행사 일정 검증"] },
        { title: "시각 품질 관리", bullets: ["통합 디자인 가이드", "채널별 템플릿 관리", "가독성 중심 편집"] },
        { title: "권리 관리", bullets: ["초상권 동의", "외부 소스 사용 기준", "저작권 이슈 예방"] },
        { title: "긴급 이슈 대응", bullets: ["수정 공지", "게시물 교체", "댓글 안내", "담당자 핫라인 운영"] },
      ]},
    ],
  },
  {
    type: "content",
    mark: "29",
    title: "기대효과 및 제안사 차별화 포인트",
    subtitle: "운영 결과가 학교 브랜드에 어떤 변화를 만들지 제시합니다.",
    lead: "본 과업이 안정적으로 수행되면 한국에너지공과대학교 SNS는 단순한 홍보 채널이 아니라 대학 브랜드 경험의 중심축으로 기능하게 됩니다.",
    sections: [
      { kind: "cards", title: "핵심 정리", cols: 2, items: [
        ["기대효과", "대학의 미션과 강점이 채널 전반에 선명하게 축적되고, 입시·연구·교육·학생생활 정보가 정기적으로 제공되며, 팔로워·구독자와 관심도가 함께 상승합니다."],
        ["차별화 포인트", "전략-제작-운영-분석이 끊기지 않는 구조, 대학의 공공성과 학생 타깃 감각을 동시에 고려한 카피 설계, 상시 정보수급 체계를 강점으로 합니다."],
      ]},
      { kind: "quote", text: "좋은 대학 SNS는 보기 좋은 게시물 몇 개가 아니라, 학교를 더 잘 설명하게 만드는 운영 구조에서 나옵니다." },
    ],
  },
  {
    type: "content",
    mark: "30",
    title: "결론 및 요청사항",
    subtitle: "제안의 최종 요약과 제출용 후속 보완 포인트를 정리합니다.",
    lead: "한국에너지공과대학교 SNS 홍보는 더 많이 게시하는 문제가 아니라, 더 선명하게 설명하고 더 빠르게 반응하는 문제입니다.",
    sections: [
      { kind: "text", paragraphs: [
        "본 제안은 학교의 미션과 강점, 입시와 교육, 연구와 학생생활, 정보 제공과 관심도 증대를 하나의 운영 체계 안에 담는 것을 목표로 설계하였습니다.",
        "계약 후에는 신속한 착수보고를 통해 채널 진단 결과와 연간 운영 프레임을 먼저 공유하고, 이후 월간 실행과 데이터 기반 개선을 병행해 채널의 존재감을 체계적으로 키워가겠습니다.",
      ]},
      { kind: "note", text: "최종 제출 전 반영 권장 항목: 회사 일반현황, 대표실적 3~5건, 포트폴리오 이미지, 투입인력 실명 및 경력, 신용평가등급, 별첨 서식, 예산 배분표." },
    ],
  }
);

function ul(items) {
  return `<ul class="bullet-list">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
}

function sectionHtml(section) {
  if (section.kind === "cards") {
    return `<h3 class="block-title">${esc(section.title)}</h3><div class="grid grid-${section.cols || 2}">${section.items.map(([title, text]) => `<article class="card"><div class="card-title">${esc(title)}</div><p>${esc(text)}</p></article>`).join("")}</div>`;
  }
  if (section.kind === "bullet-cards") {
    return `<h3 class="block-title">${esc(section.title)}</h3><div class="grid grid-${section.cols || 2}">${section.items.map((item) => `<article class="card"><div class="card-title">${esc(item.title)}</div>${ul(item.bullets)}</article>`).join("")}</div>`;
  }
  if (section.kind === "table") {
    return `<h3 class="block-title">${esc(section.title)}</h3><table class="table"><thead><tr>${section.headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${section.rows.map((row) => `<tr>${row.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  }
  if (section.kind === "text") {
    return `${section.title ? `<h3 class="block-title">${esc(section.title)}</h3>` : ""}${section.paragraphs.map((p) => `<p class="body">${esc(p)}</p>`).join("")}`;
  }
  if (section.kind === "quote") return `<div class="quote">${esc(section.text)}</div>`;
  if (section.kind === "note") return `<div class="note">${esc(section.text)}</div>`;
  if (section.kind === "toc") {
    return `<div class="toc"><div class="toc-list"><ol>${section.left.map((i) => `<li>${esc(i)}</li>`).join("")}</ol></div><div class="toc-list"><ol start="13">${section.right.map((i) => `<li>${esc(i)}</li>`).join("")}</ol></div></div>`;
  }
  return "";
}

function render(page) {
  if (page.type === "cover") {
    return `<section class="page cover"><div class="cover-box"><div class="eyebrow">OFFICIAL BID PROPOSAL / SNS COMMUNICATION</div><h1 class="cover-title">${esc(page.title).replace("\n", "<br>")}</h1><p class="cover-subtitle">${esc(page.subtitle)}</p><div class="badge-row">${page.badges.map((b) => `<span class="badge">${esc(b)}</span>`).join("")}</div><div class="cover-hero"><div class="hero-panel"><strong>제안 방향</strong><p>${esc(page.hero)}</p></div><div class="meta-grid">${page.meta.map(([label, value]) => `<div class="meta-card"><span class="label">${esc(label)}</span><div class="value">${esc(value)}</div></div>`).join("")}</div></div><div class="pill-row">${page.pills.map((p) => `<span class="pill">${esc(p)}</span>`).join("")}</div><div class="cover-footer"><span>KOREA INSTITUTE OF ENERGY TECHNOLOGY SNS PROPOSAL</span><span>01</span></div></div></section>`;
  }
  if (page.type === "section") {
    return `<section class="page section-cover"><div class="section-kicker">${esc(page.kicker)}</div><div class="section-number">${esc(page.mark)}</div><h1 class="section-title">${esc(page.title)}</h1><div class="section-summary">${esc(page.summary)}</div><div class="section-footer"><span>2026 한국에너지공과대학교 SNS 홍보대행 용역 제안서</span><span>${esc(page.mark)}</span></div></section>`;
  }
  return `<section class="page"><div class="header-band"><div><h2 class="page-title">${esc(page.title)}</h2>${page.subtitle ? `<p class="page-subtitle">${esc(page.subtitle)}</p>` : ""}</div><div class="chapter-mark">${esc(page.mark)}</div></div>${page.lead ? `<div class="lead">${esc(page.lead)}</div>` : ""}${page.sections.map(sectionHtml).join("")}<div class="page-no">${esc(page.mark)}</div></section>`;
}

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>2026 한국에너지공과대학교 SNS 홍보대행 용역 제안서</title><style>${css}</style></head><body>${pages.map(render).join("")}</body></html>`;

fs.writeFileSync(outPath, html, "utf8");
console.log(outPath);
