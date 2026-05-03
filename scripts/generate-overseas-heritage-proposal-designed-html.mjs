import fs from "node:fs";
import path from "node:path";

const outPath = path.resolve("output/proposal_2026_overseas_korean_heritage_designed.html");
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const css = `
@page { size:A4 portrait; margin:0; }
@font-face { font-family:"ProposalBody"; src:url("file:///C:/Windows/Fonts/batang.ttc") format("truetype"); font-weight:400; }
@font-face { font-family:"ProposalSans"; src:url("file:///C:/Windows/Fonts/malgun.ttf") format("truetype"); font-weight:400; }
@font-face { font-family:"ProposalSans"; src:url("file:///C:/Windows/Fonts/malgunbd.ttf") format("truetype"); font-weight:700; }
:root{--navy:#18344f;--navy-deep:#10273d;--bronze:#9e7a42;--line:#cfd7df;--soft:#f4efe6;--mist:#eef4f7;--text:#203244;--muted:#5b6e80}
*{box-sizing:border-box}html,body{margin:0;padding:0;background:#d9dee4;color:var(--text);font-family:"ProposalSans","Malgun Gothic",sans-serif}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:210mm;min-height:297mm;margin:0 auto;padding:15mm 15mm 16mm;background:#fff;page-break-after:always;overflow:hidden}.page:last-child{page-break-after:auto}
.page::before{content:"";position:absolute;left:0;top:0;width:100%;height:11mm;background:linear-gradient(90deg,var(--navy-deep),var(--navy) 56%, rgba(24,52,79,.84))}.page::after{content:"";position:absolute;left:15mm;right:15mm;bottom:12mm;height:1px;background:#d7dee6}
.cover{background:radial-gradient(circle at 84% 12%, rgba(158,122,66,.16), transparent 22%),radial-gradient(circle at 8% 88%, rgba(24,52,79,.12), transparent 22%),linear-gradient(135deg,#fdfcf9 0%,#f5f7f8 50%,#edf3f7 100%)}.cover::before{height:0}
.cover-shell{position:relative;min-height:265mm;padding:18mm 15mm 16mm;border:1px solid rgba(24,52,79,.14);background:rgba(255,255,255,.84)}
.eyebrow,.pill,.chip{display:inline-block;border-radius:999px;font-weight:700}.eyebrow{padding:4px 11px;border:1px solid rgba(24,52,79,.2);font-size:9pt;letter-spacing:1.2px;color:var(--navy)}
.cover h1{margin:18mm 0 5mm;font-family:"ProposalBody","Batang",serif;font-size:25pt;line-height:1.34;color:var(--navy);font-weight:700}.cover .subtitle{margin:0 0 8mm;font-size:11.2pt;color:var(--muted);line-height:1.75}
.cover-grid{display:grid;grid-template-columns:1.38fr .92fr;gap:8mm}.panel,.meta-card,.card,.toc-panel{border:1px solid rgba(24,52,79,.12);background:#fff}
.panel{padding:7mm;background:linear-gradient(180deg, rgba(238,244,247,.94), rgba(255,255,255,.98))}.panel-title,.card-title{margin:0 0 2mm;color:var(--navy);font-size:10pt;font-weight:700}
.panel p,.card p,.lead,.note,.quote,.body p,.body li,.toc-panel li{margin:0;line-height:1.74}.chip-row,.pill-row{display:flex;flex-wrap:wrap;gap:6px}.chip-row{margin:5mm 0 0}.chip{padding:4px 10px;border:1px solid rgba(24,52,79,.16);background:#fff;color:#274c70;font-size:8.6pt}.pill-row{margin-top:7mm}.pill{padding:4px 10px;background:rgba(24,52,79,.07);color:var(--navy);font-size:8.8pt}
.meta-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4mm}.meta-card{padding:5mm 5.2mm}.meta-label{display:block;margin-bottom:1.2mm;font-size:8.6pt;color:var(--muted)}.meta-value{font-size:9.8pt;line-height:1.65;color:var(--navy);font-weight:600}
.section-cover{background:linear-gradient(180deg, rgba(244,239,230,.96), rgba(255,255,255,1) 58%),linear-gradient(90deg, rgba(24,52,79,.05), transparent 38%)}.section-kicker{display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(158,122,66,.12);color:var(--navy);font-size:8.8pt;font-weight:700;letter-spacing:.7px}
.section-no{margin:18mm 0 6mm;font-size:50pt;line-height:1;color:rgba(24,52,79,.14);font-weight:700}.section-title{margin:0;font-family:"ProposalBody","Batang",serif;font-size:25pt;line-height:1.22;color:var(--navy)}.section-summary{margin-top:10mm;max-width:138mm;padding:6mm 7mm;background:rgba(255,255,255,.88);border-left:3.2mm solid var(--bronze);font-size:11pt;line-height:1.84}
.header-band{display:flex;align-items:flex-end;justify-content:space-between;gap:8mm;margin-bottom:5mm}.page-title{margin:0;padding-top:8mm;font-family:"ProposalBody","Batang",serif;font-size:17.2pt;line-height:1.33;color:var(--navy);font-weight:700}.page-subtitle{margin:2mm 0 0;font-size:9.1pt;color:var(--muted);line-height:1.68}.chapter-mark{min-width:24mm;text-align:right;font-size:10.4pt;color:var(--bronze);font-weight:700}
.lead{margin:0 0 4.5mm;padding:5mm 5.3mm;background:linear-gradient(180deg,#f7fafc,#ffffff);border:1px solid rgba(24,52,79,.1);font-size:10.3pt;color:#30475c}
.body p{margin:0 0 2.6mm;font-size:9.55pt}.body ul{margin:0 0 2.8mm;padding-left:5mm}.body li{margin-bottom:1.4mm;font-size:9.25pt}.block-title{margin:5mm 0 2.2mm;font-size:10.9pt;color:var(--navy);font-weight:700}
.grid{display:grid;gap:4mm}.grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-4{grid-template-columns:repeat(4,minmax(0,1fr))}
.card{padding:4.8mm 5mm;background:linear-gradient(180deg,#fbfcfd,#ffffff)}.card-title{font-size:10pt}.card p{font-size:9.1pt;color:#32485b}
.table{width:100%;border-collapse:collapse;margin-top:1.5mm;border:1px solid #ccd5de}.table th,.table td{border:1px solid #ccd5de;padding:7px 8px;vertical-align:top;font-size:9pt;line-height:1.58}.table th{background:#eef4f8;color:var(--navy);font-weight:700}.table td{color:#213547}
.toc{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4mm}.toc-panel{padding:5mm 5.3mm;background:linear-gradient(180deg,#fafcfd,#ffffff)}.toc-panel ol{margin:0;padding-left:5mm}.toc-panel li{margin-bottom:1.4mm;font-size:9.25pt;color:#23374a}
.quote{margin-top:4mm;padding:5mm 5.4mm;background:linear-gradient(90deg, rgba(24,52,79,.06), rgba(255,255,255,1));border-left:3mm solid #2d6e79;font-size:9.8pt;color:#274158}.note{margin-top:4mm;padding:4.4mm 5mm;border:1px dashed #b9c4cf;background:#fcfdfd;font-size:9pt;color:#556778}
.footer-left{position:absolute;left:15mm;bottom:8mm;font-size:8.8pt;color:#6b7c8a}.page-no{position:absolute;right:15mm;bottom:8mm;font-size:9pt;color:#6d7d8b}
`;

const page = (no, title, subtitle, body, chapter = "") => `
<section class="page">
  <div class="header-band">
    <div>
      <h2 class="page-title">${title}</h2>
      <p class="page-subtitle">${subtitle}</p>
    </div>
    <div class="chapter-mark">${chapter}</div>
  </div>
  ${body}
  <div class="footer-left">국외 한국문화유산 자료 목록화 연구 제안서</div>
  <div class="page-no">${String(no).padStart(2, "0")}</div>
</section>`;

const sectionCover = (no, part, title, summary) => `
<section class="page section-cover">
  <div class="section-kicker">${part}</div>
  <div class="section-no">${String(no).padStart(2, "0")}</div>
  <h2 class="section-title">${title}</h2>
  <div class="section-summary">${summary}</div>
  <div class="footer-left">국외 한국문화유산 자료 목록화 연구 제안서</div>
  <div class="page-no">${String(no).padStart(2, "0")}</div>
</section>`;

const pages = [];

pages.push(`
<section class="page cover">
  <div class="cover-shell">
    <div class="eyebrow">OFFICIAL BID PROPOSAL / DESIGNED HWP EDITION</div>
    <h1>국외 한국문화유산 자료 목록화 연구<br>제안서</h1>
    <p class="subtitle">국외 한국문화유산 관련 자료의 체계적 목록화, 독일어·수기 자료 판독, 2,000컷 이상 고해상도 디지털 이미지 확보, 보안과 보존환경을 갖춘 안전한 연구수행 체계를 하나의 실행 프레임으로 제안합니다.</p>
    <div class="chip-row">
      <span class="chip">목록화 체계 수립</span>
      <span class="chip">독일어 자료 판독</span>
      <span class="chip">고해상도 디지털 촬영</span>
      <span class="chip">항온·항습 수준 작업환경</span>
      <span class="chip">편집가능 성과물 납품</span>
    </div>
    <div class="cover-grid" style="margin-top:8mm;">
      <div class="panel">
        <div class="panel-title">제안 방향</div>
        <p>본 과업은 자료를 “정리하는 일”이 아니라 향후 연구, 보존, 전시, 데이터베이스 구축의 기반을 만드는 일입니다. 제안사는 자료 전체의 목록화 기준을 통일하고, 독일어와 수기 자료의 해독 난이도를 관리하며, 문화유산과 문서자료의 안전을 최우선으로 고려한 촬영·보안·검수 체계를 통해 발주처가 즉시 활용 가능한 성과물을 제출하겠습니다.</p>
      </div>
      <div class="meta-grid">
        <div class="meta-card"><span class="meta-label">사업명</span><div class="meta-value">국외 한국문화유산 자료 목록화 연구</div></div>
        <div class="meta-card"><span class="meta-label">사업기간</span><div class="meta-value">계약체결일로부터 2026. 8. 31.까지</div></div>
        <div class="meta-card"><span class="meta-label">사업예산</span><div class="meta-value">금 35,000,000원<br>(부가가치세 포함)</div></div>
        <div class="meta-card"><span class="meta-label">제안사</span><div class="meta-value">[제안사명 기입]</div></div>
      </div>
    </div>
    <div class="pill-row">
      <span class="pill">학술 기반 구축</span>
      <span class="pill">디지털 보존 강화</span>
      <span class="pill">관리·활용 기초자료 확보</span>
      <span class="pill">재사용 가능한 성과물 구조화</span>
    </div>
  </div>
  <div class="footer-left">국외소재문화유산재단 제안 대응용 디자인본</div>
  <div class="page-no">01</div>
</section>`);

pages.push(page(2, "제안 요약 및 목차", "평가위원이 전체 구조와 메시지를 빠르게 파악할 수 있도록 제안의 핵심과 30페이지 구성을 먼저 제시합니다.", `
  <div class="lead">본 제안은 “정확한 목록화, 안전한 디지털화, 독일어 자료 판독, 장기 활용 가능한 성과물 구조화”를 4대 원칙으로 설계되었습니다.</div>
  <div class="grid grid-2">
    <div class="card"><div class="card-title">핵심 약속</div><p>자료 전체에 대한 통일 메타데이터 기준 수립, 2,000컷 이상 고해상도 촬영, 원자료 안전 확보, 편집 가능한 최종 파일 납품을 약속합니다.</p></div>
    <div class="card"><div class="card-title">평가 대응 방향</div><p>연구역량(30점)에는 독일어 판독·문화유산 조사·디지털 아카이빙 역량을, 연구계획(50점)에는 방법론·일정·실행성·활용성을 집중적으로 반영했습니다.</p></div>
  </div>
  <div class="block-title">목차</div>
  <div class="toc">
    <div class="toc-panel"><ol>
      <li>제안 요약 및 목차</li><li>사업 개요</li><li>사업 목적과 핵심과업 이해</li><li>평가항목 대응전략</li><li>수행 프레임</li><li>목록화 기준</li><li>독일어·수기 자료 판독 방법</li><li>디지털 촬영 계획</li><li>보안·보존·백업 계획</li><li>수행 조직과 역할</li><li>소통·보고 체계</li><li>상세 수행 프로세스</li><li>품질관리 및 리스크 대응</li><li>추진 일정 및 성과물</li>
    </ol></div>
    <div class="toc-panel"><ol start="15">
      <li>연구 목적 및 필요성</li><li>연구내용 및 범위</li><li>추진전략 및 방법</li><li>기대성과 및 활용방안</li><li>연구원 편성표</li><li>참여연구원 작성안</li><li>연구비 소요명세서 작성안</li><li>제안참여 신청서 반영안</li><li>청렴·확약·보안서약 반영안</li><li>실적증명 및 마감 체크리스트</li>
    </ol></div>
  </div>
  <div class="note">원본 제출본에서는 회사명, 대표자, 실적, 연구원 실명, 직인, 예산 세부산식 등 회사 고유정보를 최종 반영합니다. 평가용 제출본은 식별정보를 삭제한 버전으로 별도 편집합니다.</div>
`, "OVERVIEW"));

pages.push(sectionCover(3, "PART 01", "사업이해 및 제안개요", "본 장에서는 사업목적과 과업의 본질을 재정의하고, 제안의 방향을 평가항목 중심으로 정리합니다."));

pages.push(page(4, "사업 개요", "사업명, 목적, 범위, 기간, 예산 등 발주처가 제시한 핵심 요건을 제안 구조에 맞춰 정리합니다.", `
  <div class="lead">국외 한국문화유산 자료 목록화 연구는 자료의 체계적 정리, 디지털 보존, 향후 활용기반 마련을 동시에 달성해야 하는 조사·연구·보존 복합형 과업입니다.</div>
  <table class="table">
    <tr><th style="width:22%;">항목</th><th>내용</th></tr>
    <tr><td>사업명</td><td>국외 한국문화유산 자료 목록화 연구</td></tr>
    <tr><td>사업목적</td><td>1910~20년대 한국에 체류한 외국인 연구자가 1970년대까지 남긴 자료를 체계적으로 정리하여 학술적 기반을 구축하고, 관리·활용 및 디지털 보존의 기초자료를 확보</td></tr>
    <tr><td>핵심 과업</td><td>자료 전체 목록화, 기본 정보 정리, 간략 해제 작성, 디지털 이미지 확보, 검수 및 보고서 제출</td></tr>
    <tr><td>촬영 기준</td><td>전문가에 의한 2,000컷 이상 촬영, 6천만 화소 이상, 300dpi 이상</td></tr>
    <tr><td>특수 요구</td><td>독일어 및 수기 자료 판독 전문성, 문화유산 안전 취급, 항온·항습 및 보안대책 확보</td></tr>
    <tr><td>사업기간</td><td>계약체결일로부터 2026년 8월 31일까지</td></tr>
    <tr><td>사업예산</td><td>금 35,000,000원(부가가치세 포함)</td></tr>
  </table>
  <div class="note">본 과업은 단순 사무정리형 용역이 아니라 연구, 기록화, 촬영, 검수, 보안이 결합된 고난도 학술연구용역입니다.</div>
`, "PART 01"));

pages.push(page(5, "사업 목적과 핵심과업 이해", "발주처가 왜 이 사업을 추진하는지, 무엇이 가장 중요한지부터 제안의 논리를 시작합니다.", `
  <div class="body">
    <p>이번 과업의 1차 목적은 자료군 전체의 구조를 파악하고 체계적으로 목록화하는 데 있다. 중요한 것은 개별 자료의 단편적 설명이 아니라, 향후 데이터베이스 구축과 후속 연구에 재사용 가능한 수준의 메타데이터를 확보하는 것이다.</p>
    <p>2차 목적은 실물자료의 보존 부담을 줄이면서 안전하게 활용할 수 있는 디지털 이미지를 확보하는 데 있다. 회화, 도자, 사진, 가구, 문서가 혼재한 자료군의 특성상 유형별 촬영 방식과 취급 기준이 달라야 하며, 이 차이를 관리하는 것이 실무 성패를 좌우한다.</p>
    <p>3차 목적은 독일어와 수기 자료를 포함한 문서군의 해독 기반을 마련하는 데 있다. 단순 OCR이나 일반 사무인력 중심 접근으로는 정확한 판독과 해제 작성이 어렵기 때문에 전문 인력과 검수 체계가 필수적이다.</p>
  </div>
  <div class="grid grid-3">
    <div class="card"><div class="card-title">핵심과업 1</div><p>자료 전체 목록화와 기본 정보 정리</p></div>
    <div class="card"><div class="card-title">핵심과업 2</div><p>전문가 고해상도 디지털 촬영</p></div>
    <div class="card"><div class="card-title">핵심과업 3</div><p>판독·해독, 검수, 활용 가능한 성과물 구조화</p></div>
  </div>
`, "PART 01"));

pages.push(page(6, "평가항목 대응전략", "기술능력 80점 중 연구역량 30점, 연구계획 50점의 배점 논리에 맞춰 제안 포인트를 정리합니다.", `
  <table class="table">
    <tr><th style="width:18%;">평가영역</th><th style="width:18%;">세부평가항목</th><th>본 제안의 대응 포인트</th></tr>
    <tr><td rowspan="3">연구역량 (30)</td><td>연구실적</td><td>문화유산 조사·목록화·학술연구·디지털 아카이빙 실적을 선별하여 유사용역 중심으로 제시</td></tr>
    <tr><td>연구능력</td><td>독일어 자료 판독, 기록화, 메타데이터 설계, 디지털 촬영·파일관리까지 포함하는 복합 전문성 구조 제시</td></tr>
    <tr><td>연구진 구성</td><td>책임연구원-공동연구원-연구원-보조원-외부전문가로 역할을 분리하고 교차검토 구조 설계</td></tr>
    <tr><td rowspan="5">연구계획 (50)</td><td>계획서 부합성</td><td>과업내용서의 목록화, 판독, 촬영, 보안, 성과물 요건을 모두 반영</td></tr>
    <tr><td>연구목적</td><td>학술 기반 구축, 관리·활용 기초자료 확보, 디지털 보존 강화라는 3대 목적을 명확히 서술</td></tr>
    <tr><td>연구내용</td><td>목록화, 판독, 촬영, 검수, 보고서, 저장장치 납품까지 전 공정을 포함</td></tr>
    <tr><td>연구방법</td><td>자료군별 기준표, 독일어 판독 프로세스, 촬영 체크리스트, 이중 백업과 검수표 운영 제시</td></tr>
    <tr><td>실행계획·활용방안</td><td>5개월 내 수행 가능한 단계별 일정과 후속 DB·전시·교육 활용 방향 제시</td></tr>
  </table>
  <div class="quote">제안서의 강점은 “예쁘게 보이는 문장”이 아니라 “과업을 끝까지 수행할 수 있는 실행 체계”에 있어야 합니다.</div>
`, "PART 01"));

pages.push(sectionCover(7, "PART 02", "조사설계 및 연구방법론", "본 장에서는 목록화, 판독, 촬영, 보안, 검수까지 이어지는 실제 수행 프레임을 제시합니다."));

pages.push(page(8, "수행 프레임", "착수부터 납품까지 4단계 프레임으로 과업을 운영하여 일정과 품질을 동시에 관리합니다.", `
  <div class="lead">본 연구는 착수 및 기준 설계 → 목록화·판독·촬영 본작업 → 보완 및 중간점검 → 최종 검수 및 납품의 4단계 구조로 수행합니다.</div>
  <table class="table">
    <tr><th style="width:16%;">단계</th><th style="width:18%;">주요 기간</th><th>핵심업무</th><th style="width:24%;">주요 산출물</th></tr>
    <tr><td>1단계</td><td>착수 ~ 1개월차</td><td>작업기준 수립, 목록화 항목 정의, 시범목록화, 시범촬영, 위험요인 점검</td><td>착수계획, 기준표, 체크리스트</td></tr>
    <tr><td>2단계</td><td>2~3개월차</td><td>전체 자료 목록화, 독일어·수기자료 판독, 본촬영, 주간 검수</td><td>엑셀 목록, 촬영대장, 판독 메모</td></tr>
    <tr><td>3단계</td><td>4개월차</td><td>누락 보완, 재촬영, 해제 고도화, 중간보고, 의견반영</td><td>중간보고서, 수정이력표</td></tr>
    <tr><td>4단계</td><td>5개월차</td><td>최종 검수, 보고서 작성, 저장매체 정리, 최종보고회 및 납품</td><td>최종보고서, 편집본, 외장저장매체 2개</td></tr>
  </table>
  <div class="note">최종보고서 초안은 계약만료 15일 전까지 제출하는 기준으로 내부 마감일을 별도로 운영합니다.</div>
`, "PART 02"));

pages.push(page(9, "목록화 기준", "자료 전체 목록화는 향후 검색과 활용의 기반이므로 항목 정의와 표기원칙을 먼저 통일합니다.", `
  <div class="grid grid-2">
    <div class="card"><div class="card-title">메타데이터 핵심 항목</div><p>관리번호, 자료명, 유형, 재질, 크기, 제작·작성 시기, 작성 언어, 수기 여부, 간략 해제, 소장처 정보, 비고</p></div>
    <div class="card"><div class="card-title">표기 원칙</div><p>명칭은 현행 사용명과 원제/원어 병기를 병행하고, 시기와 인명·지명은 확인 가능한 범위 내에서 근거 중심으로 표기합니다.</p></div>
  </div>
  <table class="table">
    <tr><th style="width:20%;">분류 기준</th><th>적용 방식</th></tr>
    <tr><td>유형 분류</td><td>회화, 도자, 사진, 가구, 문서 등 1차 분류 후 세부 매체별 하위분류 적용</td></tr>
    <tr><td>관리번호 체계</td><td>자료군-유형-일련번호 구조의 고유 식별번호를 부여하여 목록·이미지·검수표를 연계</td></tr>
    <tr><td>간략 해제</td><td>자료의 내용, 맥락, 주요 키워드, 판독 난이도 및 활용 가능성을 3~5문장 내외로 정리</td></tr>
    <tr><td>검수 필드</td><td>필수항목 누락 여부, 표기 일관성, 이미지 연계 여부, 판독상태, 비고 입력 여부를 함께 점검</td></tr>
  </table>
`, "PART 02"));

pages.push(page(10, "독일어·수기 자료 판독 방법", "문서자료의 난이도를 반영하여 단계별 판독과 교차검토 체계를 운영합니다.", `
  <div class="lead">판독 대상 문서는 원문 확인 → 초벌 판독 → 핵심 정보 추출 → 책임연구원 검토의 4단계로 관리하며, 불명확 구간은 무리하게 단정하지 않고 주석 처리합니다.</div>
  <table class="table">
    <tr><th style="width:18%;">단계</th><th>수행 내용</th></tr>
    <tr><td>원문 확인</td><td>촬영 전후 문서 상태, 페이지 순서, 누락 여부를 확인하고 자료 식별정보를 목록과 연계</td></tr>
    <tr><td>초벌 판독</td><td>독일어와 수기 판독이 가능한 연구인력이 가독 가능한 부분을 우선 전사하고 핵심어를 추출</td></tr>
    <tr><td>정보 구조화</td><td>인명, 지명, 연대, 사건, 문헌 성격, 주제어 등을 구조화하여 간략 해제와 목록 항목에 반영</td></tr>
    <tr><td>교차검토</td><td>판독 난이도가 높은 문서는 공동연구원 또는 외부전문가 검토를 거쳐 오독 가능성을 축소</td></tr>
  </table>
  <div class="body"><p>문서자료의 목적은 완전 번역이 아니라 목록화와 해제를 위한 핵심 정보 확보에 있습니다. 따라서 본 과업에서는 “해독 가능한 범위의 정확성”을 우선하며, 불명확 구간은 판독상태를 표시해 후속 연구로 이어질 수 있도록 기록합니다.</p></div>
`, "PART 02"));

pages.push(page(11, "디지털 촬영 계획", "매체별 특성에 맞춘 촬영 계획과 파일관리 기준을 동시에 설계합니다.", `
  <div class="grid grid-3">
    <div class="card"><div class="card-title">촬영 기준</div><p>6천만 화소 이상, 300dpi 이상, 유형별 조명과 배경 조건 최적화</p></div>
    <div class="card"><div class="card-title">촬영 물량</div><p>회화, 도자, 사진, 문서 등 전체 대상에 대해 2,000컷 이상 확보</p></div>
    <div class="card"><div class="card-title">파일 구조</div><p>원본보존용 / 작업용 / 보고서 삽입용으로 분리 저장</p></div>
  </div>
  <table class="table">
    <tr><th style="width:18%;">자료 유형</th><th>촬영 포인트</th><th style="width:22%;">파일 관리</th></tr>
    <tr><td>회화·가구</td><td>전면, 측면, 세부 디테일, 훼손·특이부위 기록</td><td>정면컷, 디테일컷, 보조컷 구분</td></tr>
    <tr><td>도자</td><td>전체 형상, 바닥면, 문양·명문부 촬영</td><td>회전각도별 컷 분리</td></tr>
    <tr><td>사진</td><td>원본 상태와 정보가 드러나는 가장자리·뒷면까지 확인</td><td>앞면/뒷면 연동 저장</td></tr>
    <tr><td>문서</td><td>전체면과 중요 세부면 촬영, 페이지 순서 유지</td><td>페이지 번호 기반 연속 파일명 부여</td></tr>
  </table>
  <div class="note">촬영대장에는 파일명, 자료명, 촬영일, 촬영자, 검수 여부, 재촬영 필요 여부를 함께 기록하여 촬영-검수-납품 흐름을 추적합니다.</div>
`, "PART 02"));

pages.push(page(12, "보안·보존·백업 계획", "자료 안전을 최우선에 두고 작업환경, 접근권한, 저장체계를 함께 관리합니다.", `
  <div class="lead">문화유산과 문서자료의 안전을 위해 작업공간, 인력, 장비, 데이터 모두에 보안과 보존 기준을 적용합니다.</div>
  <div class="grid grid-2">
    <div class="card"><div class="card-title">작업환경</div><p>항온·항습 및 보안대책을 갖춘 공간 또는 동등 수준의 작업환경을 확보하고, 자료 이동 최소화와 반출입 통제 원칙을 적용합니다.</p></div>
    <div class="card"><div class="card-title">접근권한</div><p>참여연구진별 접근권한을 구분하고, 보안서약서 제출, 외부저장장치 사용 통제, 대외 공유 금지 원칙을 운영합니다.</p></div>
    <div class="card"><div class="card-title">데이터 백업</div><p>원본 파일은 작업본과 분리하고, 저장장치 이중화와 주기적 백업으로 분실·손상 위험을 줄입니다.</p></div>
    <div class="card"><div class="card-title">사고 대응</div><p>자료 훼손, 분실, 누출, 파일 손상 가능성에 대비해 즉시 보고체계와 복구 우선순위를 문서화합니다.</p></div>
  </div>
  <div class="quote">원자료의 안전은 품질보다 앞서는 전제조건입니다. 본 제안은 모든 작업이 “안전 확보 후 수행”되도록 설계합니다.</div>
`, "PART 02"));

pages.push(sectionCover(13, "PART 03", "수행체계 및 운영관리", "본 장에서는 실제 과업을 움직이는 조직, 보고 체계, 품질관리, 일정 운영 방식을 보여줍니다."));

pages.push(page(14, "수행 조직과 역할", "책임연구원을 중심으로 목록화, 판독, 촬영, 검수, 행정지원이 유기적으로 연결되는 구조를 설계합니다.", `
  <table class="table">
    <tr><th style="width:18%;">구분</th><th style="width:16%;">인원</th><th>주요 역할</th></tr>
    <tr><td>책임연구원</td><td>[기입]명</td><td>과업 총괄, 대외 협의, 최종 검수, 연구방법론 관리, 보고서 총괄</td></tr>
    <tr><td>공동연구원</td><td>[기입]명</td><td>자료 분류·목록화 관리, 독일어 자료 판독, 간략 해제 작성, 교차검토</td></tr>
    <tr><td>연구원</td><td>[기입]명</td><td>기초 목록 입력, 자료 조사, 이미지 정리, 메타데이터 점검, 재촬영 보완</td></tr>
    <tr><td>연구보조원</td><td>[기입]명</td><td>촬영대장 정리, 파일 정리, 회의자료 편집, 행정지원</td></tr>
    <tr><td>외부전문가</td><td>[필요시]</td><td>독일어 고문서 판독 자문, 문화유산 촬영 및 보존 환경 자문</td></tr>
  </table>
  <div class="grid grid-2">
    <div class="card"><div class="card-title">총괄 원칙</div><p>의사결정은 책임연구원 단일창구로 관리하되, 품질검수는 교차검토 체계로 운영합니다.</p></div>
    <div class="card"><div class="card-title">현장 대응</div><p>자료 유형별 책임자를 지정하여 촬영·목록·판독 간 의사소통 지연을 줄입니다.</p></div>
  </div>
`, "PART 03"));

pages.push(page(15, "소통·보고 체계", "발주처와의 협의, 내부 점검, 이슈관리, 중간·최종보고의 흐름을 명확히 설정합니다.", `
  <div class="grid grid-3">
    <div class="card"><div class="card-title">착수회의</div><p>사업범위, 기준표, 일정, 보안유의사항, 성과물 구조 확정</p></div>
    <div class="card"><div class="card-title">주간 점검</div><p>진척도, 누락자료, 판독 난이도, 재촬영 필요 여부 공유</p></div>
    <div class="card"><div class="card-title">중간보고</div><p>진행현황과 보완 필요사항을 발주처와 협의하여 후반 일정에 반영</p></div>
  </div>
  <table class="table">
    <tr><th style="width:22%;">보고 단계</th><th>주요 내용</th><th style="width:22%;">운영 방식</th></tr>
    <tr><td>수시 보고</td><td>일정 지연 가능성, 특이사항, 자료 안전 관련 이슈 즉시 공유</td><td>책임연구원 단일창구 보고</td></tr>
    <tr><td>정기 공유</td><td>주간 진척도, 작업량, 검수결과, 다음 주 계획 공유</td><td>주간 보고서 또는 메일</td></tr>
    <tr><td>중간보고</td><td>목록화 진행률, 촬영률, 판독 현황, 보완계획 제시</td><td>보고서 + 회의</td></tr>
    <tr><td>최종보고</td><td>성과물 설명, 활용 제언, 향후 후속과제 제시</td><td>최종보고회 + 납품</td></tr>
  </table>
`, "PART 03"));

pages.push(page(16, "상세 수행 프로세스", "기획에서 납품까지 전 공정의 흐름을 하나의 프로세스로 정리합니다.", `
  <table class="table">
    <tr><th style="width:14%;">단계</th><th>주요 업무</th><th style="width:24%;">체크포인트</th></tr>
    <tr><td>1. 기준 수립</td><td>항목 정의, 파일명 규칙, 관리번호 체계, 작업지침서 작성</td><td>발주처 협의 완료 여부</td></tr>
    <tr><td>2. 예비조사</td><td>자료군 사전 파악, 유형 분류, 우선순위 설정</td><td>누락 없는 대상목록 확보</td></tr>
    <tr><td>3. 목록화</td><td>기본정보 입력, 간략 해제 작성, 언어·수기 여부 표기</td><td>필수항목 누락 여부</td></tr>
    <tr><td>4. 판독</td><td>독일어·수기자료 전사, 핵심정보 추출, 주석 처리</td><td>오독 위험 자료 별도표시</td></tr>
    <tr><td>5. 촬영</td><td>유형별 촬영, 파일 저장, 촬영대장 기록</td><td>재촬영 필요컷 확인</td></tr>
    <tr><td>6. 품질검수</td><td>목록-이미지 연계 점검, 오탈자·중복·누락 수정</td><td>검수표 작성 완료</td></tr>
    <tr><td>7. 보고서 작성</td><td>중간·최종 보고서, 목록표, 활용 제언 작성</td><td>내부 검토 완료 여부</td></tr>
    <tr><td>8. 납품</td><td>편집가능 파일, 이미지 원본, 저장장치 2개 제출</td><td>납품 체크리스트 충족</td></tr>
  </table>
  <div class="note">프로세스의 핵심은 각 공정을 분절하지 않고, 목록·판독·촬영·검수가 항상 서로 대조되도록 운영하는 데 있습니다.</div>
`, "PART 03"));

pages.push(page(17, "품질관리 및 리스크 대응", "오류와 누락을 줄이기 위한 검수 체계와 주요 위험요인에 대한 대응방안을 제시합니다.", `
  <div class="grid grid-2">
    <div class="card"><div class="card-title">품질관리 4단계</div><p>입력 검수 → 판독 검수 → 이미지 검수 → 납품 전 종합검수의 4단계 체계를 운영합니다.</p></div>
    <div class="card"><div class="card-title">검수 도구</div><p>필수항목 점검표, 촬영대장, 수정이력표, 납품 체크리스트를 함께 운영합니다.</p></div>
  </div>
  <table class="table">
    <tr><th style="width:24%;">예상 리스크</th><th>대응방안</th></tr>
    <tr><td>독일어 수기자료 판독 난이도 증가</td><td>이중 판독, 외부전문가 자문, 불명확 구간 주석 처리</td></tr>
    <tr><td>자료 유형별 촬영 난이도 차이</td><td>시범촬영 후 본작업, 자료군별 촬영 체크리스트 운영</td></tr>
    <tr><td>자료 훼손 및 안전사고 우려</td><td>취급교육, 장갑·받침대 사용, 접근권한 통제, 이동 최소화 원칙 적용</td></tr>
    <tr><td>누락·중복·파일명 오류</td><td>관리번호 기반 연계, 일일 검수표, 주간 점검회의로 즉시 수정</td></tr>
    <tr><td>납품 직전 일정 지연</td><td>내부 마감일을 법정기한보다 앞당겨 설정하고, 초안은 만료 15일 전 제출 기준으로 역산 관리</td></tr>
  </table>
`, "PART 03"));

pages.push(page(18, "추진 일정 및 성과물", "계약기간을 기준으로 5개월 내외 집중 수행형 일정과 제출 성과물을 정리합니다.", `
  <table class="table">
    <tr><th style="width:22%;">세부연구내용</th><th>1개월차</th><th>2개월차</th><th>3개월차</th><th>4개월차</th><th>5개월차</th></tr>
    <tr><td>착수협의 및 기준 수립</td><td>●</td><td>●</td><td></td><td></td><td></td></tr>
    <tr><td>자료 예비조사 및 분류 확정</td><td>●</td><td>●</td><td></td><td></td><td></td></tr>
    <tr><td>전체 목록화 본작업</td><td></td><td>●</td><td>●</td><td>●</td><td></td></tr>
    <tr><td>독일어·수기자료 판독</td><td></td><td>●</td><td>●</td><td>●</td><td>●</td></tr>
    <tr><td>고해상도 촬영</td><td></td><td>●</td><td>●</td><td>●</td><td>●</td></tr>
    <tr><td>중간 점검 및 보완</td><td></td><td></td><td>●</td><td>●</td><td></td></tr>
    <tr><td>최종보고서 초안 작성</td><td></td><td></td><td></td><td>●</td><td>●</td></tr>
    <tr><td>최종보고회 및 납품</td><td></td><td></td><td></td><td></td><td>●</td></tr>
  </table>
  <div class="grid grid-2">
    <div class="card"><div class="card-title">중간보고 단계</div><p>중간보고서 인쇄본 10부, 진행현황 자료, 보완계획</p></div>
    <div class="card"><div class="card-title">최종보고 단계</div><p>최종보고서 초안 10부, 최종보고서 인쇄본 10부, 편집가능 파일, 원본파일, 저장장치 2개</p></div>
  </div>
`, "PART 03"));

pages.push(sectionCover(19, "PART 04", "제3호 서식 반영용 연구계획서", "본 장은 제안요청서 제3호 서식의 핵심 항목을 그대로 살리되, 디자인 레이아웃으로 재구성한 페이지입니다."));

pages.push(page(20, "연구 목적 및 필요성", "제3호 서식 1번 항목에 대응하는 본문입니다.", `
  <div class="lead">본 연구의 목적은 국외 한국문화유산 관련 자료군의 전모를 체계적으로 정리하여 학술적 기반을 구축하고, 향후 관리·활용 및 디지털 보존을 위한 실질적 기초자료를 확보하는 데 있습니다.</div>
  <div class="body">
    <p>1910~20년대 한국에 체류하며 한국학 연구를 수행한 외국인 연구자가 1970년대까지 남긴 자료는 한국문화유산 연구의 사료적 가치가 높지만, 자료군 전체를 통합적으로 정리한 기반이 부족합니다. 따라서 자료의 체계적 목록화는 학술연구의 출발점이자 향후 보존·활용 정책의 기반이 됩니다.</p>
    <p>또한 대상 자료에는 회화, 도자, 사진, 가구, 문서가 혼재되어 있어 자료별 관리와 활용 방식이 달라질 수밖에 없습니다. 이 차이를 구조적으로 정리하지 않으면 목록화의 활용도와 디지털 보존의 효율이 떨어집니다.</p>
    <p>특히 문서자료는 독일어와 수기 자료가 다수 포함되어 있어 일반적 서지정리 수준을 넘어선 전문성이 요구됩니다. 따라서 본 과업은 문화유산 조사, 기록화, 독일어 판독, 디지털 촬영, 보안과 보존 환경 이해를 모두 갖춘 접근이 필요합니다.</p>
  </div>
`, "FORM 3"));

pages.push(page(21, "연구내용 및 범위", "제3호 서식 2번 항목에 대응하는 본문입니다.", `
  <table class="table">
    <tr><th style="width:18%;">구분</th><th>주요 내용</th><th style="width:22%;">산출물</th></tr>
    <tr><td>기초 설계</td><td>목록화 기준 수립, 관리번호 체계 정의, 촬영·보안 체크리스트 마련</td><td>기준표, 작업지침서</td></tr>
    <tr><td>자료 목록화</td><td>명칭, 크기, 재질, 시기, 언어, 수기 여부, 간략 해제 등 기본 정보 정리</td><td>엑셀 목록, 메타데이터 시트</td></tr>
    <tr><td>판독 및 해제</td><td>독일어·수기자료의 판독, 핵심 정보 추출, 비고 및 주석 처리</td><td>판독 메모, 간략 해제안</td></tr>
    <tr><td>디지털 촬영</td><td>유형별 촬영 계획에 따른 고해상도 이미지 확보, 파일명 규칙 적용</td><td>원본 이미지, 촬영대장</td></tr>
    <tr><td>검수 및 보고</td><td>목록-이미지 연계 검수, 중간보고, 최종보고회, 편집본 납품</td><td>검수표, 보고서, 저장장치</td></tr>
  </table>
  <div class="body">
    <p>연구보고서의 예상 목차는 연구 개요, 대상 자료의 성격과 분류 기준, 목록화 방법론, 독일어·수기 자료 판독 기준, 유형별 촬영 방법, 구축 결과, 향후 활용 제언으로 구성합니다.</p>
    <p>자료 조사를 위한 공간(수장고 등) 확보와 독일어 자료 해독 능력은 제안요청서의 핵심 조건인 만큼, 제안서 본문과 인력구성, 리스크 대응안 전반에 반복적으로 반영합니다.</p>
  </div>
`, "FORM 3"));

pages.push(page(22, "추진전략 및 방법", "제3호 서식 3번 항목에 대응하는 본문입니다.", `
  <div class="grid grid-2">
    <div class="card"><div class="card-title">전략 1. 통일 기준</div><p>목록화 항목, 표기원칙, 파일명 규칙, 관리번호 체계를 먼저 확정하여 전체 작업의 일관성을 확보합니다.</p></div>
    <div class="card"><div class="card-title">전략 2. 전문가 중심 판독</div><p>독일어와 수기자료 판독 역량을 갖춘 인력을 배치하고, 난이도 높은 자료는 교차검토와 자문을 병행합니다.</p></div>
    <div class="card"><div class="card-title">전략 3. 유형별 촬영</div><p>회화·도자·사진·문서 등 자료 특성별로 촬영 세팅과 취급 방식을 차등 적용합니다.</p></div>
    <div class="card"><div class="card-title">전략 4. 다층 검수</div><p>입력, 판독, 이미지, 납품 전 종합검수의 4단계 품질관리 체계를 운영합니다.</p></div>
  </div>
  <div class="body" style="margin-top:4mm;">
    <p>관련정보 수집은 발주처 협의, 내부 기준 설계, 자료 예비조사, 촬영대장과 검수표 구축을 통해 선행합니다. 전문가 확보는 책임연구원과 공동연구원을 중심으로 수행하되, 필요 시 외부전문가 자문체계를 연동합니다. 국내외 타 기관과의 협조가 필요한 사항은 발주처와 사전 협의를 거쳐 단계별로 추진합니다.</p>
    <p>접근방법은 “자료군 파악 → 목록화 → 판독 → 촬영 → 검수 → 보고서 및 납품”의 순차 구조이나, 실무상으로는 목록·판독·촬영이 서로 대조되도록 병행 운영하는 방식으로 설계합니다.</p>
  </div>
`, "FORM 3"));

pages.push(page(23, "기대성과 및 활용방안", "제3호 서식 4번 항목에 대응하는 본문입니다.", `
  <div class="lead">본 과제의 기대성과는 단순 결과보고서 제출이 아니라, 발주처가 이후에도 재사용할 수 있는 연구·관리·보존의 기초 기반을 만드는 데 있습니다.</div>
  <table class="table">
    <tr><th style="width:22%;">기대성과</th><th>활용방안</th></tr>
    <tr><td>자료 전체 구조의 가시화</td><td>후속 학술연구, 조사 확대, 추가 과제 발굴의 기초자료로 활용</td></tr>
    <tr><td>메타데이터 기반 확보</td><td>목록 DB, 검색 시스템, 아카이브 구축의 기반자료로 활용</td></tr>
    <tr><td>고해상도 디지털 이미지 확보</td><td>실물 접근 부담을 줄이고 전시·교육·연구용 디지털 대체자료로 활용</td></tr>
    <tr><td>독일어·수기자료 판독 기초 마련</td><td>후속 번역·심화 해제·학술논문 작성의 출발점으로 활용</td></tr>
    <tr><td>관리체계 표준화</td><td>장기 보존정책, 우선순위 설정, 자료 관리 매뉴얼 정비에 활용</td></tr>
  </table>
  <div class="quote">연구결과의 실제적 활용 가능성은 “읽을 수 있는 보고서”가 아니라 “다시 쓰일 수 있는 데이터와 이미지”를 남기는 데서 나옵니다.</div>
`, "FORM 3"));

pages.push(page(24, "연구원 편성표", "제3호 서식 5번 항목에 대응하는 본문입니다.", `
  <table class="table">
    <tr><th style="width:22%;">부문</th><th>구성</th><th>주요 역할</th></tr>
    <tr><td>총괄·품질관리 부문</td><td>책임연구원, 공동연구원</td><td>과업 총괄, 대외 협의, 최종 검수, 품질관리 기준 확정</td></tr>
    <tr><td>자료 목록화 부문</td><td>공동연구원, 연구원</td><td>분류체계 적용, 메타데이터 입력, 간략 해제 작성</td></tr>
    <tr><td>독일어 판독 부문</td><td>공동연구원</td><td>원문 확인, 판독, 핵심 정보 추출, 주석 처리</td></tr>
    <tr><td>디지털 촬영 부문</td><td>연구원, 연구보조원</td><td>유형별 촬영, 파일 저장, 촬영대장 관리</td></tr>
    <tr><td>행정·편집 부문</td><td>연구보조원</td><td>회의자료, 보고서 편집, 저장장치 정리, 납품 행정</td></tr>
  </table>
  <div class="grid grid-2">
    <div class="card"><div class="card-title">책임연구원 요건</div><p>문화유산 조사·기록화 경험과 연구총괄 능력을 갖춘 인력을 배치합니다.</p></div>
    <div class="card"><div class="card-title">공동연구원 요건</div><p>독일어 자료 해독, 간략 해제, 메타데이터 관리가 가능한 인력을 우선 배치합니다.</p></div>
  </div>
`, "FORM 3"));

pages.push(page(25, "참여연구원 작성안", "책임연구원·공동연구원·연구원·연구보조원 이력기재를 위한 반영 포인트를 정리합니다.", `
  <div class="body">
    <p>실제 제출본에서는 책임연구원, 공동연구원, 연구원, 연구보조원, 외부 위촉연구원 순으로 제안요청서 양식을 복사하여 인원별로 기재합니다. 특히 최근 5년 관련 실적은 문화유산 조사, 해외자료 목록화, 디지털 아카이빙, 독일어 자료 연구, 고문서 판독 등 유사성이 높은 실적 중심으로 10개 이내 선별하는 것이 바람직합니다.</p>
  </div>
  <table class="table">
    <tr><th style="width:22%;">기재 항목</th><th>작성 포인트</th></tr>
    <tr><td>인적사항</td><td>실제 제출본 기준 성명, 영문명, 직위, 소속, 연락처를 정확히 반영</td></tr>
    <tr><td>학력</td><td>고등학교 이상 학력 중 연구 주제와의 관련성이 드러나는 학력 우선 정리</td></tr>
    <tr><td>주요 경력</td><td>문화유산 조사, 기록물 관리, 해외자료 연구, 디지털화, 촬영 관련 경력 중심으로 요약</td></tr>
    <tr><td>주요 연구 실적</td><td>관련 분야 실적 10개 이내, 역할(책임자/참여자)과 과업 유사성 드러나도록 기재</td></tr>
  </table>
  <div class="note">평가용 제안서에는 참여연구원 실명과 기관 식별정보를 노출하지 않는 편집본을 별도 제작해야 합니다.</div>
`, "FORM 3"));

pages.push(page(26, "연구비 소요명세서 작성안", "제3호 서식 7번 항목에 대응하는 작성 가이드형 페이지입니다.", `
  <div class="lead">예산 총액은 35,000천원 기준으로 유지하되, 실제 제출 전에는 기관 단가표·참여율·실투입 인력·간접비 기준에 따라 정교하게 확정해야 합니다.</div>
  <table class="table">
    <tr><th style="width:22%;">비목</th><th>작성 포인트</th></tr>
    <tr><td>인건비</td><td>책임연구원, 공동연구원, 연구원, 연구보조원의 월급여·참여개월수·참여율을 근거로 산정</td></tr>
    <tr><td>경비</td><td>출장여비, 인쇄복사비, 전문가활용비, 자료수집비, 회의비, 번역·통역·속기료 등 세부 기준 명시</td></tr>
    <tr><td>간접비</td><td>(인건비+경비) x 6% 이하 기준 준수</td></tr>
    <tr><td>부가가치세</td><td>기관 특성과 계약기준에 따라 산정하되 총사업예산 범위 내에서 정합성 확보</td></tr>
  </table>
  <div class="grid grid-2">
    <div class="card"><div class="card-title">권장 항목</div><p>독일어 판독 자문, 고해상도 촬영, 저장장치, 보고서 인쇄, 검수회의 운영 비용을 누락 없이 반영</p></div>
    <div class="card"><div class="card-title">주의사항</div><p>실행 가능성이 낮아 보이는 과도한 수치나 근거 없는 일괄배분은 피하고, 실제 수행 가능한 계획과 일치하도록 작성</p></div>
  </div>
`, "FORM 3"));

pages.push(sectionCover(27, "PART 05", "서식 반영 및 제출 마감", "본 장에서는 제안서 제출 시 필요한 서식, 서약서, 실적증명, 최종 점검사항을 정리합니다."));

pages.push(page(28, "제안참여 신청서 및 신청서 반영안", "제1호·제3호 서식 입력 시 바로 치환해야 할 항목을 정리합니다.", `
  <table class="table">
    <tr><th style="width:22%;">서식</th><th>필수 기입사항</th><th style="width:24%;">유의사항</th></tr>
    <tr><td>제1호 서식<br>제안참여 신청서</td><td>업체명, 사업자등록번호, 대표자, 전화번호, 소재지, 대표자 직인</td><td>원본 제안서에만 실명과 직인 반영</td></tr>
    <tr><td>제2호 서식<br>표지</td><td>접수번호 공란, 기관명, 대표자</td><td>평가용은 업체 식별정보 삭제</td></tr>
    <tr><td>제3호 서식<br>학술연구용역 신청서</td><td>책임연구원, 소속, 전공, 연구기간, 참여인원, 기관장 직인</td><td>실제 인력과 증빙자료 일치 여부 확인</td></tr>
  </table>
  <div class="body"><p>현재 디자인본은 회사 고유정보를 [기입] 형태로 남겨 두었습니다. 실제 제출본에서는 사업자등록증, 법인등기부등본, 조달청 등록증, 중소기업확인서 등 별첨자료와 동일한 값으로 치환해야 합니다.</p></div>
  <div class="note">평가용 제안서는 업체명, 대표자명, 로고, 참여자 성명 등 식별 가능한 정보 일체를 삭제한 버전으로 별도 편집합니다.</div>
`, "FORMS"));

pages.push(page(29, "청렴·확약·보안서약 및 실적증명 반영안", "제4호~제7호 서식과 증빙자료 정합성을 맞추기 위한 체크 포인트를 정리합니다.", `
  <div class="grid grid-2">
    <div class="card"><div class="card-title">청렴계약이행서약서</div><p>대표자 직인, 날짜, 서약 문구를 원문 그대로 유지하고 회사명만 정확히 반영합니다.</p></div>
    <div class="card"><div class="card-title">확약서·보안서약서</div><p>대표자명, 회사명, 주소, 연락처, 법인등록번호 등 기본정보의 일치 여부를 확인합니다.</p></div>
  </div>
  <table class="table">
    <tr><th style="width:24%;">항목</th><th>체크 포인트</th></tr>
    <tr><td>실적증명서</td><td>문화유산 조사·목록화·해외자료 연구·디지털 아카이빙 등 과업 유사성이 높은 실적 중심으로 선별</td></tr>
    <tr><td>민간실적 증빙</td><td>계약서, 세금계산서, 발주처 확인서 등 근거자료 동시 제출</td></tr>
    <tr><td>중소기업·소상공인 확인서</td><td>제출마감일 전일까지 유효한 증빙인지 확인</td></tr>
    <tr><td>사용인감계</td><td>조달청 등록 인감과 실제 날인 인감이 다를 경우 반드시 추가 제출</td></tr>
  </table>
  <div class="quote">서식은 별첨이지만, 제안서 본문과 증빙자료의 수치·명칭·직위가 어긋나면 신뢰도가 즉시 떨어집니다. 최종 제출 전 교차점검이 필수입니다.</div>
`, "FORMS"));

pages.push(page(30, "최종 마감 체크리스트", "제출 직전 반드시 확인해야 할 편집·서식·증빙·평가용 분리 항목을 정리합니다.", `
  <div class="lead">현재 디자인본과 별도로, 제안요청서 양식을 유지한 편집초안도 함께 관리하면 원본/평가용 편집과 막판 수정 속도를 크게 높일 수 있습니다.</div>
  <div class="grid grid-2">
    <div class="card"><div class="card-title">본문 체크</div><ul><li>목차와 실제 페이지 흐름 일치 여부</li><li>사업명, 기간, 예산, 과업 범위 오기 여부</li><li>독일어 판독, 보안, 촬영 기준 문구 반영 여부</li><li>연구계획서 항목 누락 여부</li></ul></div>
    <div class="card"><div class="card-title">증빙 체크</div><ul><li>실적증명서, 사업자등록증, 등기부등본, 중소기업확인서</li><li>청렴계약이행서약서, 확약서, 보안서약서</li><li>직인·대표자명·회사명·주소의 일치 여부</li><li>원본/평가용 분리 제출본 최종 확인</li></ul></div>
  </div>
  <div class="body" style="margin-top:4mm;">
    <p>본 디자인본은 발주처의 사업목적, 과업내용, 평가항목, 서식구조를 반영해 30페이지로 구성한 제출용 초안입니다. 회사 고유정보와 실적·인력·예산 세부내역만 최종 치환하면 발표용과 제출용 문서로 빠르게 전환할 수 있도록 설계했습니다.</p>
    <p>다음 단계에서는 회사 정보 반영, 원본/평가용 분리 편집, 실적증명 첨부, 발표자료 요약본 제작 순으로 이어가면 효율적입니다.</p>
  </div>
`, "FINAL"));

if (pages.length !== 30) {
  throw new Error(`Expected 30 pages, got ${pages.length}`);
}

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>국외 한국문화유산 자료 목록화 연구 제안서</title>
<style>${css}</style>
</head>
<body>
${pages.join("\n")}
</body>
</html>`;

fs.writeFileSync(outPath, "\uFEFF" + html, "utf8");
console.log(outPath);
