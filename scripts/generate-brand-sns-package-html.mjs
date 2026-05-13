import fs from "node:fs";
import path from "node:path";

const outPath = path.resolve("output/brand-sns-packages-4p.html");
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const esc = (text) =>
  String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const css = `
@page { size: A4 portrait; margin: 0; }
@font-face { font-family: "ProposalKorean"; src: url("file:///C:/Windows/Fonts/malgun.ttf") format("truetype"); font-weight: 400; }
@font-face { font-family: "ProposalKorean"; src: url("file:///C:/Windows/Fonts/malgunbd.ttf") format("truetype"); font-weight: 700; }
:root{
  --ink:#16222d;
  --muted:#657687;
  --line:#d7dee6;
  --paper:#f5f1ea;
  --navy:#19354a;
  --teal:#1f6d67;
  --amber:#c69043;
  --rose:#a45757;
  --mist:#eef4f6;
  --start:#e9f4ef;
  --brand:#eef2fb;
  --premium:#f8efe5;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#d4dbe2;color:var(--ink);font-family:"ProposalKorean","Malgun Gothic",sans-serif}
body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:210mm;min-height:297mm;margin:0 auto;background:#fff;page-break-after:always;overflow:hidden}
.page:last-child{page-break-after:auto}
.page-shell{padding:16mm 15mm 16mm}
.cover{
  background:
    radial-gradient(circle at 86% 12%, rgba(198,144,67,.18), transparent 22%),
    radial-gradient(circle at 12% 85%, rgba(31,109,103,.12), transparent 24%),
    linear-gradient(135deg, #faf7f0 0%, #f3f6f8 50%, #edf2f4 100%);
}
.cover::before,.cover::after,.package-page::before{
  content:"";
  position:absolute;
  border-radius:999px;
}
.cover::before{top:-28mm;right:-24mm;width:88mm;height:88mm;background:linear-gradient(135deg, rgba(25,53,74,.14), rgba(198,144,67,.06))}
.cover::after{left:-20mm;bottom:-28mm;width:72mm;height:72mm;background:linear-gradient(135deg, rgba(31,109,103,.12), rgba(25,53,74,.04))}
.package-page::before{top:-18mm;right:-18mm;width:58mm;height:58mm;background:linear-gradient(135deg, rgba(25,53,74,.07), rgba(255,255,255,0))}
.eyebrow,.tag,.price-chip,.tone-badge,.step-no,.step-label{display:inline-flex;align-items:center;justify-content:center}
.eyebrow,.tag,.tone-badge{border-radius:999px;font-weight:700}
.eyebrow{padding:4px 10px;border:1px solid rgba(25,53,74,.18);font-size:8.8pt;letter-spacing:1.5px;color:var(--navy);background:rgba(255,255,255,.8)}
.cover-title{margin:16mm 0 4mm;font-size:28pt;line-height:1.2;color:var(--navy);font-weight:700;letter-spacing:-.02em}
.cover-subtitle{margin:0;max-width:132mm;font-size:11.5pt;line-height:1.8;color:#415362}
.hero-grid,.summary-grid,.package-grid,.step-grid{display:grid;gap:5mm}
.hero-grid{grid-template-columns:1.15fr .85fr;margin-top:11mm}
.hero-card,.summary-card,.panel,.quote-box,.step-card{border:1px solid rgba(25,53,74,.10);background:rgba(255,255,255,.92)}
.hero-card{padding:8mm;border-radius:8mm;background:linear-gradient(180deg, rgba(238,244,246,.95), rgba(255,255,255,.98))}
.hero-card h2,.section-title,.panel-title,.mini-title,.column-title{margin:0;color:var(--navy);font-weight:700}
.hero-card h2{font-size:12pt;margin-bottom:2mm}
.hero-card p,.summary-card p,.panel p,.quote-box p,.step-card p,.bullet-list li,.mini-list li{margin:0;line-height:1.72}
.tag-row,.price-row{display:flex;flex-wrap:wrap;gap:7px}
.tag-row{margin-top:5mm}
.tag{padding:4px 9px;background:rgba(25,53,74,.06);color:var(--navy);font-size:8.6pt}
.summary-grid{grid-template-columns:1fr}
.summary-card{padding:5.5mm;border-radius:6mm}
.summary-card strong{display:block;margin-bottom:1.5mm;color:var(--navy);font-size:10.5pt}
.cover-footer,.page-no{position:absolute;font-size:9pt;color:var(--muted)}
.cover-footer{left:16mm;right:16mm;bottom:12mm;display:flex;justify-content:space-between}
.page-no{right:15mm;bottom:10mm;border-top:1px solid var(--line);padding-top:3px;min-width:18mm;text-align:right}
.package-page{background:linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%)}
.page-shell.package-shell{padding-top:14mm}
.tone-strip{height:10mm;margin:-14mm -15mm 8mm;border-bottom:1px solid rgba(25,53,74,.08)}
.tone-start{background:linear-gradient(90deg, rgba(33,120,84,.18), rgba(233,244,239,.8))}
.tone-brand{background:linear-gradient(90deg, rgba(63,96,179,.16), rgba(238,242,251,.82))}
.tone-premium{background:linear-gradient(90deg, rgba(198,144,67,.18), rgba(248,239,229,.84))}
.tone-badge{padding:4px 10px;font-size:8.8pt;letter-spacing:.8px}
.tone-start .tone-badge{background:rgba(33,120,84,.12);color:#1e6a4e}
.tone-brand .tone-badge{background:rgba(63,96,179,.11);color:#365192}
.tone-premium .tone-badge{background:rgba(198,144,67,.14);color:#8c6225}
.header-row{display:flex;justify-content:space-between;align-items:flex-start;gap:8mm}
.section-title{font-size:25pt;line-height:1.15;letter-spacing:-.03em}
.section-subtitle{margin:3mm 0 0;font-size:11pt;line-height:1.75;color:#46596b}
.price-row{margin-top:5mm;align-items:center}
.price-chip{padding:5px 12px;border-radius:999px;background:var(--navy);color:#fff;font-size:9pt;font-weight:700;letter-spacing:.5px}
.price{font-size:24pt;line-height:1;color:var(--navy);font-weight:700;letter-spacing:-.04em}
.package-grid{grid-template-columns:1.1fr .9fr;margin-top:7mm}
.panel{padding:6mm;border-radius:7mm}
.lead-box{padding:6mm 6.5mm;border-left:3.2mm solid var(--navy);background:linear-gradient(180deg, var(--mist), #fff)}
.lead-box p{font-size:10.4pt;color:#314556}
.mini-title,.column-title{font-size:10.4pt;margin-bottom:2mm}
.bullet-list,.mini-list{margin:0;padding-left:4.6mm}
.bullet-list li,.mini-list li{margin-bottom:1.5mm;font-size:9.45pt;color:#314556}
.quote-box{margin-top:5mm;padding:5mm 5.5mm;border-radius:7mm}
.quote-box p{font-size:10pt;color:#2b4256}
.step-grid{grid-template-columns:1fr;margin-top:5mm}
.step-card{display:grid;grid-template-columns:13mm 1fr;gap:4mm;padding:4.8mm;border-radius:6mm;align-items:start}
.step-no{width:11mm;height:11mm;border-radius:999px;background:var(--navy);color:#fff;font-size:9pt;font-weight:700}
.step-label{justify-content:flex-start;font-size:9.7pt;font-weight:700;color:var(--navy);margin-bottom:1.2mm}
.start-accent{border-color:rgba(33,120,84,.16)}
.brand-accent{border-color:rgba(63,96,179,.16)}
.premium-accent{border-color:rgba(198,144,67,.18)}
`;

const packages = [
  {
    tone: "start",
    badge: "ENTRY PACKAGE",
    name: "START PACKAGE",
    price: "₩790,000 / 월",
    subtitle: "브랜드의 SNS 시작과 기본 콘텐츠 운영을 위한 패키지",
    intro:
      "채널을 처음 여는 단계에서 필요한 기획, 무드 정리, 기본 숏폼 제작을 한 번에 묶은 스타터 패키지입니다. 운영 부담을 낮추면서도 브랜드의 첫인상을 안정적으로 세팅하는 데 초점을 둡니다.",
    features: [
      "인스타그램 채널 세팅 및 방향성 기획",
      "브랜드 무드 및 레퍼런스 제안",
      "릴스 콘텐츠 월 4건 제작",
      "숏폼 편집 및 자막/BGM 구성",
      "업로드용 세로형 콘텐츠 제작",
      "간단한 해시태그 및 업로드 가이드 제공",
      "수정 2회 포함",
    ],
    targets: [
      "SNS를 처음 운영하는 브랜드",
      "지역 브랜드 및 전통 브랜드",
      "소규모 브랜드 홍보 시작 단계",
    ],
    process: [
      "브랜드 미팅 및 방향성 정리",
      "콘텐츠 레퍼런스 기획",
      "영상 제작 및 수정",
      "최종 콘텐츠 전달",
    ],
    note:
      "작게 시작하되 화면의 톤과 운영 감도를 빠르게 잡아야 하는 팀에 적합합니다.",
  },
  {
    tone: "brand",
    badge: "CORE PACKAGE",
    name: "BRAND PACKAGE",
    price: "₩1,890,000 / 월",
    subtitle: "브랜드의 스토리와 감도를 SNS 콘텐츠로 확장하는 메인 패키지",
    intro:
      "단순 업로드를 넘어 브랜드 감도와 메시지를 스토리텔링 방식으로 축적하는 메인 패키지입니다. 영상 수량과 기획 깊이를 동시에 확보해 지속적으로 브랜드 인식을 키웁니다.",
    features: [
      "AI 브랜드 필름 제작 (월 1건)",
      "릴스/숏폼 콘텐츠 월 8건 제작",
      "SNS 운영 방향 및 콘텐츠 기획",
      "브랜드 맞춤형 스토리텔링 구성",
      "관광·지역 연계 홍보 콘텐츠 기획",
      "썸네일 및 카피라이팅 제작",
      "업로드용 최적화 편집",
      "수정 3회 포함",
    ],
    targets: [
      "브랜드 감도를 강화하고 싶은 기업",
      "관광/문화/전통 기반 브랜드",
      "바이럴형 SNS 콘텐츠 운영이 필요한 브랜드",
    ],
    process: [
      "브랜드 분석 및 콘텐츠 전략 회의",
      "월간 콘텐츠 캘린더 기획",
      "AI 영상 및 숏폼 콘텐츠 제작",
      "피드백 반영 및 최종 운영안 전달",
    ],
    note:
      "브랜드 서사를 정리하면서 숏폼 빈도도 함께 늘리고 싶은 경우 가장 균형이 좋습니다.",
  },
  {
    tone: "premium",
    badge: "SIGNATURE PACKAGE",
    name: "PREMIUM PACKAGE",
    price: "₩3,900,000 ~ / 월",
    subtitle: "브랜드의 세계관과 헤리티지를 시네마틱 콘텐츠로 확장하는 프리미엄 패키지",
    intro:
      "브랜드 세계관을 장기 콘텐츠 자산으로 확장하는 상위 패키지입니다. 시네마틱 영상, SNS 통합 운영, 캠페인형 확산 전략까지 포함해 브랜드를 하나의 콘텐츠 프로젝트로 다룹니다.",
    features: [
      "브랜드 시네마틱 필름 제작",
      "월간 SNS 통합 운영",
      "유튜브 + 인스타그램 콘텐츠 운영",
      "광고용 숏폼 및 캠페인 영상 제작",
      "글로벌 타겟 콘텐츠 기획",
      "브랜드 스토리 기반 AI 영상 시리즈 제작",
      "촬영/기획/편집/카피라이팅 통합 진행",
      "콘텐츠 성과 분석 리포트 제공",
      "수정 4회 포함",
    ],
    targets: [
      "브랜딩 중심의 기업 및 기관",
      "문화유산·관광·지자체 프로젝트",
      "장기 콘텐츠 운영이 필요한 브랜드",
    ],
    process: [
      "브랜드 및 타겟 분석",
      "콘텐츠 세계관 및 캠페인 기획",
      "영상 제작 및 SNS 운영",
      "광고 및 확산 전략 진행",
      "성과 분석 및 후속 콘텐츠 제안",
    ],
    note:
      "브랜드 자산을 단발성 콘텐츠가 아니라 장기 운영 체계로 구축하려는 조직에 맞는 구성입니다.",
  },
];

function renderCover() {
  const cards = [
    ["Start", "채널 시작, 기본 톤 세팅, 월 4건 숏폼 운영"],
    ["Brand", "AI 브랜드 필름과 월 8건 콘텐츠로 감도 강화"],
    ["Premium", "시네마틱 필름과 통합 운영 중심의 확장형 패키지"],
  ];

  return `
    <section class="page cover">
      <div class="page-shell">
        <div class="eyebrow">SNS PACKAGE PROPOSAL</div>
        <h1 class="cover-title">브랜드 SNS 패키지 제안서<br />4 PAGE PACKAGE</h1>
        <p class="cover-subtitle">
          피그마 기반 패키지 소개용 문서를 바로 확장할 수 있도록 커버 1페이지와
          패키지 상세 3페이지로 구성했습니다. 각 페이지는 가격, 핵심 제공 항목,
          추천 대상, 진행 방식이 한눈에 보이도록 정리되어 있습니다.
        </p>
        <div class="tag-row">
          <span class="tag">가격 비교</span>
          <span class="tag">타겟 제안</span>
          <span class="tag">운영 방식 요약</span>
          <span class="tag">브랜드 감도 중심 구성</span>
        </div>
        <div class="hero-grid">
          <div class="hero-card">
            <h2>패키지 구성 방향</h2>
            <p>
              이번 문서는 단순 가격표가 아니라 각 패키지가 어떤 브랜드 단계에 맞는지
              바로 설명할 수 있는 세일즈용 페이지로 설계했습니다. 첫 페이지에서는
              세 패키지의 온도 차를 빠르게 비교하고, 뒤 3페이지에서는 각 패키지의
              세부 제공 범위를 독립적으로 설명합니다.
            </p>
          </div>
          <div class="summary-grid">
            ${cards
              .map(
                ([title, text]) => `
                  <div class="summary-card">
                    <strong>${esc(title)}</strong>
                    <p>${esc(text)}</p>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="hero-grid" style="margin-top:7mm">
          <div class="hero-card">
            <h2>페이지 구성</h2>
            <p>
              1페이지는 전체 패키지 소개와 비교 요약, 2페이지는 START PACKAGE,
              3페이지는 BRAND PACKAGE, 4페이지는 PREMIUM PACKAGE로 구성됩니다.
              추후 피그마에서 비주얼을 덧입히기 쉽도록 정보 블록을 분명하게 나눴습니다.
            </p>
          </div>
          <div class="hero-card">
            <h2>추천 활용</h2>
            <p>
              제안 미팅 자료, DM 발송용 PDF, 홈페이지 패키지 소개 섹션, 영업용 브로슈어
              베이스로 바로 사용할 수 있습니다. 이미지 렌더까지 가능하도록 동일한
              코드 흐름으로 준비했습니다.
            </p>
          </div>
        </div>
        <div class="cover-footer">
          <span>BRAND SNS PACKAGE / FIGMA-READY SALES DOCUMENT</span>
          <span>01</span>
        </div>
      </div>
    </section>
  `;
}

function renderPackagePage(pkg, index) {
  const accentClass = `${pkg.tone}-accent`;
  const stepCards = pkg.process
    .map(
      (step, stepIndex) => `
        <div class="step-card ${accentClass}">
          <div class="step-no">${stepIndex + 1}</div>
          <div>
            <div class="step-label">진행 단계 ${stepIndex + 1}</div>
            <p>${esc(step)}</p>
          </div>
        </div>
      `,
    )
    .join("");

  return `
    <section class="page package-page">
      <div class="page-shell package-shell">
        <div class="tone-strip tone-${pkg.tone}"></div>
        <div class="header-row">
          <div>
            <div class="tone-badge">${esc(pkg.badge)}</div>
            <h2 class="section-title">${esc(pkg.name)}</h2>
            <p class="section-subtitle">${esc(pkg.subtitle)}</p>
          </div>
          <div style="text-align:right">
            <div class="price-chip">MONTHLY FEE</div>
            <div class="price">${esc(pkg.price)}</div>
          </div>
        </div>

        <div class="package-grid">
          <div>
            <div class="lead-box">
              <p>${esc(pkg.intro)}</p>
            </div>

            <div class="panel ${accentClass}" style="margin-top:5mm">
              <div class="column-title">제공 항목</div>
              <ul class="bullet-list">
                ${pkg.features.map((item) => `<li>${esc(item)}</li>`).join("")}
              </ul>
            </div>

            <div class="quote-box ${accentClass}">
              <p>${esc(pkg.note)}</p>
            </div>
          </div>

          <div>
            <div class="panel ${accentClass}">
              <div class="mini-title">추천 대상</div>
              <ul class="mini-list">
                ${pkg.targets.map((item) => `<li>${esc(item)}</li>`).join("")}
              </ul>
            </div>

            <div class="panel ${accentClass}" style="margin-top:5mm">
              <div class="mini-title">진행 방식</div>
              <div class="step-grid">
                ${stepCards}
              </div>
            </div>
          </div>
        </div>

        <div class="page-no">${String(index + 2).padStart(2, "0")}</div>
      </div>
    </section>
  `;
}

const html = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>브랜드 SNS 패키지 4페이지 제안서</title>
    <style>${css}</style>
  </head>
  <body>
    ${renderCover()}
    ${packages.map(renderPackagePage).join("")}
  </body>
</html>`;

fs.writeFileSync(outPath, html, "utf8");
console.log(outPath);
