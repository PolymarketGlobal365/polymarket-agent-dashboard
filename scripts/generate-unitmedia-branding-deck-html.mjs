import fs from "node:fs";
import path from "node:path";

const outPath = path.resolve("output/unitmedia-branding-deck-8p.html");
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const esc = (text) =>
  String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const portfolioCards = [
  {
    title: "면천두견주",
    tag: "HERITAGE LIQUOR",
    desc: "천년 전통주를 AI 시네마틱 콘텐츠로 재해석",
    mood: "dugyeonju",
  },
  {
    title: "문화유산",
    tag: "HERITAGE PROJECT",
    desc: "시간의 결을 숏폼과 브랜딩 무드로 번역한 문화유산 프로젝트",
    mood: "heritage",
  },
  {
    title: "AI CITY",
    tag: "FUTURE CAMPAIGN",
    desc: "국토교통 미래 비전을 광고형 영상으로 제작",
    mood: "city",
  },
  {
    title: "감성 시네마틱",
    tag: "BRAND FILM",
    desc: "브랜드의 정서를 저장 가능한 짧은 장면으로 구조화",
    mood: "cinema",
  },
];

const packageCards = [
  {
    tone: "start",
    name: "START",
    price: "₩790,000 / 월",
    target: "SNS를 처음 시작하는 브랜드",
    revisions: "2회",
    coverage: "월 4건 릴스 / 채널 세팅 / 업로드 가이드",
    items: [
      "인스타그램 채널 세팅 및 방향성 기획",
      "브랜드 무드 및 레퍼런스 제안",
      "릴스 콘텐츠 월 4건 제작",
      "숏폼 편집 및 자막/BGM 구성",
      "세로형 업로드 콘텐츠 제작",
    ],
  },
  {
    tone: "brand",
    name: "BRAND",
    price: "₩1,890,000 / 월",
    target: "브랜드 감도와 바이럴을 함께 키우고 싶은 팀",
    revisions: "3회",
    coverage: "AI 브랜드 필름 / 월 8건 숏폼 / 스토리텔링 기획",
    featured: true,
    items: [
      "AI 브랜드 필름 제작 (월 1건)",
      "릴스/숏폼 콘텐츠 월 8건 제작",
      "SNS 운영 방향 및 콘텐츠 기획",
      "브랜드 맞춤형 스토리텔링 구성",
      "썸네일 및 카피라이팅 제작",
      "업로드용 최적화 편집",
    ],
  },
  {
    tone: "premium",
    name: "PREMIUM",
    price: "₩3,900,000~ / 월",
    target: "장기 캠페인과 세계관 설계가 필요한 브랜드",
    revisions: "4회",
    coverage: "시네마틱 필름 / SNS 통합 운영 / 리포트 제공",
    items: [
      "브랜드 시네마틱 필름 제작",
      "월간 SNS 통합 운영",
      "유튜브 + 인스타그램 콘텐츠 운영",
      "광고용 숏폼 및 캠페인 영상 제작",
      "글로벌 타겟 콘텐츠 기획",
      "콘텐츠 성과 분석 리포트 제공",
    ],
  },
];

const processSteps = [
  "브랜드 분석",
  "콘텐츠 기획",
  "AI 영상 제작",
  "편집 및 브랜딩",
  "SNS 업로드 최적화",
];

const css = `
@page { size: 1920px 1080px; margin: 0; }
@font-face { font-family: "Pretendard Local"; src: url("file:///C:/Users/jyjy6/AppData/Local/Microsoft/Windows/Fonts/Pretendard-Regular.otf") format("opentype"); font-weight: 400; }
@font-face { font-family: "Pretendard Local"; src: url("file:///C:/Users/jyjy6/AppData/Local/Microsoft/Windows/Fonts/Pretendard-Medium.otf") format("opentype"); font-weight: 500; }
@font-face { font-family: "Pretendard Local"; src: url("file:///C:/Users/jyjy6/AppData/Local/Microsoft/Windows/Fonts/Pretendard-SemiBold.otf") format("opentype"); font-weight: 600; }
@font-face { font-family: "Pretendard Local"; src: url("file:///C:/Users/jyjy6/AppData/Local/Microsoft/Windows/Fonts/Pretendard-Bold.otf") format("opentype"); font-weight: 700; }
:root{
  --bg:#0a0a0c;
  --bg-soft:#111216;
  --panel:#111318;
  --panel-2:#161920;
  --line:rgba(255,255,255,.08);
  --line-strong:rgba(255,216,160,.24);
  --text:#f8f5ef;
  --muted:#ada79b;
  --soft:#7b7367;
  --gold:#d6a75d;
  --gold-soft:#6e4a18;
  --white-soft:#f1ece3;
  --green:#7be0c2;
  --red:#ef8e8e;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#070708;color:var(--text);font-family:"Pretendard Local","Pretendard","Malgun Gothic",sans-serif}
body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.deck{display:flex;flex-direction:column;gap:48px;padding:24px;background:#050506}
.slide{
  position:relative;
  width:1920px;
  height:1080px;
  overflow:hidden;
  border-radius:28px;
  background:
    radial-gradient(circle at 84% 10%, rgba(214,167,93,.20), transparent 20%),
    radial-gradient(circle at 12% 94%, rgba(214,167,93,.08), transparent 22%),
    linear-gradient(135deg, #070708 0%, #0a0a0d 35%, #11131a 100%);
  box-shadow:0 40px 90px rgba(0,0,0,.45);
}
.slide::before,
.slide::after{
  content:"";
  position:absolute;
  pointer-events:none;
}
.slide::before{
  inset:26px;
  border:1px solid var(--line);
  border-radius:24px;
}
.slide::after{
  inset:auto auto 0 0;
  width:360px;
  height:360px;
  background:radial-gradient(circle, rgba(214,167,93,.10), transparent 72%);
}
.canvas{
  position:relative;
  z-index:1;
  width:100%;
  height:100%;
  padding:60px 74px 58px;
}
.topbar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:42px;
}
.logo{
  display:flex;
  align-items:center;
  gap:14px;
  letter-spacing:.22em;
  text-transform:uppercase;
  font-weight:700;
  font-size:18px;
}
.logo-mark{
  width:38px;
  height:38px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.16);
  background:
    linear-gradient(135deg, rgba(214,167,93,.22), rgba(214,167,93,.02)),
    #101114;
  display:grid;
  place-items:center;
  font-size:15px;
  font-weight:700;
  color:var(--gold);
}
.meta{
  display:flex;
  align-items:center;
  gap:12px;
}
.meta-pill{
  padding:10px 16px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:var(--muted);
  font-size:14px;
  letter-spacing:.08em;
  text-transform:uppercase;
}
.hero-grid,
.who-grid,
.why-grid,
.service-grid,
.process-grid,
.contact-grid{
  display:grid;
  gap:26px;
}
.hero-grid{grid-template-columns:1.06fr .94fr}
.cover-copy{padding-top:26px}
.kicker{
  display:inline-flex;
  align-items:center;
  gap:10px;
  padding:10px 18px;
  border:1px solid rgba(214,167,93,.28);
  border-radius:999px;
  color:var(--gold);
  background:rgba(214,167,93,.08);
  font-size:15px;
  font-weight:600;
  letter-spacing:.12em;
  text-transform:uppercase;
}
.title{
  margin:26px 0 18px;
  font-size:78px;
  line-height:1.02;
  letter-spacing:-.05em;
  font-weight:700;
}
.title.small{font-size:64px}
.subtitle{
  margin:0;
  max-width:900px;
  color:#d4cec4;
  font-size:26px;
  line-height:1.55;
  letter-spacing:-.02em;
}
.tag-row{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:28px;
}
.tag{
  padding:10px 14px;
  border-radius:999px;
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.08);
  color:#eee7da;
  font-size:15px;
  font-weight:500;
}
.hero-art{
  position:relative;
  border-radius:34px;
  overflow:hidden;
  border:1px solid var(--line-strong);
  background:
    linear-gradient(180deg, rgba(7,7,8,.08), rgba(7,7,8,.78)),
    radial-gradient(circle at 68% 28%, rgba(255,220,171,.28), transparent 20%),
    radial-gradient(circle at 34% 58%, rgba(255,255,255,.12), transparent 18%),
    linear-gradient(135deg, #2a2119 0%, #0d0d0f 42%, #121722 100%);
  min-height:786px;
  box-shadow:inset 0 0 80px rgba(0,0,0,.25);
}
.hero-art::before{
  content:"";
  position:absolute;
  inset:0;
  background:
    linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px);
  background-size:42px 42px;
  opacity:.22;
}
.hero-art::after{
  content:"";
  position:absolute;
  inset:0;
  background:
    radial-gradient(circle at 55% 34%, rgba(255,244,220,.30), transparent 16%),
    radial-gradient(circle at 62% 74%, rgba(214,167,93,.22), transparent 18%),
    linear-gradient(180deg, transparent 36%, rgba(0,0,0,.45) 100%);
}
.hero-overlay{
  position:absolute;
  left:36px;
  right:36px;
  bottom:36px;
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  gap:20px;
}
.overlay-block{
  max-width:420px;
  padding:18px 20px;
  border:1px solid rgba(255,255,255,.12);
  border-radius:22px;
  background:rgba(10,10,12,.46);
  backdrop-filter:blur(18px);
}
.overlay-label{
  color:var(--gold);
  font-size:13px;
  letter-spacing:.12em;
  text-transform:uppercase;
  margin-bottom:10px;
}
.overlay-text{
  color:#f7f3eb;
  font-size:18px;
  line-height:1.55;
}
.slide-no{
  position:absolute;
  right:78px;
  bottom:50px;
  color:var(--soft);
  font-size:16px;
  letter-spacing:.14em;
}
.section-head{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:30px;
  margin-bottom:30px;
}
.section-copy{max-width:960px}
.eyebrow{
  color:var(--gold);
  font-size:14px;
  letter-spacing:.18em;
  text-transform:uppercase;
  margin-bottom:14px;
}
.body-copy{
  color:#ddd6ca;
  font-size:25px;
  line-height:1.6;
  letter-spacing:-.02em;
}
.body-copy strong{color:#fff8ec}
.panel{
  border:1px solid var(--line);
  background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
  border-radius:28px;
}
.panel.soft{
  background:linear-gradient(180deg, rgba(214,167,93,.10), rgba(255,255,255,.02));
  border-color:rgba(214,167,93,.16);
}
.who-grid{
  grid-template-columns:1.04fr .96fr;
  align-items:start;
}
.statement{
  padding:34px 36px 30px;
  min-height:642px;
}
.statement-copy{
  font-size:34px;
  line-height:1.45;
  letter-spacing:-.035em;
  color:#f5efe3;
}
.statement-copy .accent{color:var(--gold)}
.keyword-grid{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:12px;
  margin-top:34px;
}
.keyword{
  padding:18px 16px;
  border-radius:20px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.06);
  min-height:92px;
}
.keyword strong{
  display:block;
  font-size:16px;
  line-height:1.4;
}
.media-stack{
  display:grid;
  gap:18px;
}
.still-card,
.ui-card,
.reel-card{
  position:relative;
  overflow:hidden;
  border-radius:28px;
  border:1px solid rgba(255,255,255,.10);
}
.still-card{
  min-height:306px;
  background:
    linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.66)),
    radial-gradient(circle at 65% 20%, rgba(241,220,176,.28), transparent 18%),
    linear-gradient(135deg, #2c231c 0%, #0f1013 50%, #1b202b 100%);
}
.still-card::before,
.reel-card::before{
  content:"";
  position:absolute;
  inset:0;
  background:
    linear-gradient(transparent 70%, rgba(0,0,0,.72) 100%);
}
.still-card .label,
.reel-card .label{
  position:absolute;
  left:24px;
  bottom:24px;
  right:24px;
}
.card-kicker{
  color:var(--gold);
  font-size:13px;
  letter-spacing:.14em;
  text-transform:uppercase;
  margin-bottom:8px;
}
.card-title{
  font-size:28px;
  line-height:1.2;
  font-weight:700;
}
.reel-card{
  min-height:358px;
  background:
    linear-gradient(180deg, rgba(0,0,0,.06), rgba(0,0,0,.68)),
    radial-gradient(circle at 26% 18%, rgba(255,255,255,.10), transparent 16%),
    linear-gradient(135deg, #131313 0%, #17202a 54%, #5b2f1f 100%);
}
.reel-ui{
  position:absolute;
  top:24px;
  right:24px;
  width:116px;
  display:grid;
  gap:12px;
}
.ui-chip{
  padding:10px 0;
  border-radius:18px;
  text-align:center;
  background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.10);
  color:#f2e8d7;
  font-size:13px;
}
.ui-card{
  min-height:252px;
  padding:22px;
  background:linear-gradient(180deg, rgba(17,19,24,.96), rgba(11,12,16,.98));
}
.ui-lines{
  display:grid;
  gap:12px;
}
.ui-line{
  height:12px;
  border-radius:999px;
  background:linear-gradient(90deg, rgba(214,167,93,.72), rgba(255,255,255,.08));
}
.ui-line.small{width:52%}
.ui-line.mid{width:78%}
.ui-line.long{width:100%}
.why-grid{
  grid-template-columns:1.1fr .9fr;
  align-items:start;
}
.insight-stack{
  display:grid;
  gap:18px;
}
.insight-card{
  padding:24px 28px;
  border-radius:24px;
  border:1px solid rgba(255,255,255,.08);
  background:rgba(255,255,255,.03);
}
.insight-card strong{
  display:block;
  font-size:24px;
  margin-bottom:10px;
}
.insight-card p{
  margin:0;
  color:#d4cec2;
  font-size:22px;
  line-height:1.55;
}
.data-box{
  padding:30px;
  min-height:704px;
}
.metric{
  padding:24px 0;
  border-bottom:1px solid rgba(255,255,255,.08);
}
.metric:last-child{border-bottom:0}
.metric-no{
  color:var(--gold);
  font-size:15px;
  letter-spacing:.16em;
  margin-bottom:10px;
}
.metric-text{
  font-size:28px;
  line-height:1.4;
}
.phone-mockups{
  display:flex;
  gap:18px;
  margin-top:26px;
}
.phone{
  width:208px;
  height:370px;
  border-radius:34px;
  border:1px solid rgba(255,255,255,.12);
  background:
    linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02)),
    linear-gradient(135deg, #1b1d22 0%, #111217 62%, #2f1f15 100%);
  overflow:hidden;
  position:relative;
}
.phone::before{
  content:"";
  position:absolute;
  left:50%;
  top:10px;
  width:88px;
  height:8px;
  margin-left:-44px;
  border-radius:999px;
  background:rgba(255,255,255,.18);
}
.phone-screen{
  position:absolute;
  inset:26px 14px 14px;
  border-radius:24px;
  overflow:hidden;
  background:
    linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.5)),
    radial-gradient(circle at 50% 24%, rgba(255,229,185,.20), transparent 15%),
    linear-gradient(135deg, #34281e 0%, #131418 60%, #182130 100%);
}
.screen-stat{
  position:absolute;
  left:18px;
  right:18px;
  bottom:18px;
  padding:14px 16px;
  border-radius:18px;
  background:rgba(9,10,12,.52);
  border:1px solid rgba(255,255,255,.10);
  font-size:15px;
  line-height:1.5;
}
.what-grid{
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  gap:18px;
  margin-top:12px;
}
.service-card{
  padding:22px;
  min-height:620px;
  border-radius:26px;
  border:1px solid rgba(255,255,255,.08);
  background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
}
.service-no{
  color:var(--gold);
  font-size:15px;
  letter-spacing:.18em;
  margin-bottom:18px;
}
.service-name{
  font-size:30px;
  line-height:1.2;
  font-weight:700;
  margin-bottom:12px;
}
.service-desc{
  color:#d4cdc1;
  font-size:20px;
  line-height:1.5;
  min-height:88px;
}
.visual-mini{
  position:relative;
  height:240px;
  margin:18px 0;
  border-radius:22px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,.10);
}
.visual-mini.ai{
  background:
    linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.62)),
    radial-gradient(circle at 62% 26%, rgba(255,255,255,.14), transparent 17%),
    linear-gradient(135deg, #2f231c, #0e1116 58%, #172231);
}
.visual-mini.short{
  background:
    linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.62)),
    radial-gradient(circle at 34% 18%, rgba(255,255,255,.12), transparent 16%),
    linear-gradient(135deg, #16181d, #0f1014 44%, #472d1d);
}
.visual-mini.heritage{
  background:
    linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.62)),
    radial-gradient(circle at 68% 24%, rgba(255,231,196,.16), transparent 16%),
    linear-gradient(135deg, #2c221b, #0f1014 54%, #213143);
}
.visual-mini.ops{
  background:
    linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.60)),
    radial-gradient(circle at 26% 22%, rgba(255,255,255,.10), transparent 14%),
    linear-gradient(135deg, #16171b, #101215 44%, #2d2239);
}
.mini-overlay{
  position:absolute;
  inset:auto 16px 16px 16px;
  padding:14px;
  border-radius:16px;
  background:rgba(8,9,11,.46);
  border:1px solid rgba(255,255,255,.08);
}
.mini-overlay strong{
  display:block;
  font-size:13px;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:var(--gold);
  margin-bottom:6px;
}
.mini-overlay span{
  font-size:17px;
  line-height:1.45;
}
.mock-ui{
  display:grid;
  gap:10px;
  margin-top:16px;
}
.mock-ui .bar{
  height:10px;
  border-radius:999px;
  background:rgba(255,255,255,.12);
}
.mock-ui .bar.gold{background:linear-gradient(90deg, rgba(214,167,93,.82), rgba(255,255,255,.10))}
.portfolio-grid{
  display:grid;
  grid-template-columns:repeat(2, 1fr);
  gap:20px;
  margin-top:10px;
}
.portfolio-card{
  position:relative;
  min-height:312px;
  overflow:hidden;
  border-radius:28px;
  border:1px solid rgba(255,255,255,.10);
}
.portfolio-card::before{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.72));
}
.portfolio-card.dugyeonju{background:radial-gradient(circle at 72% 18%, rgba(255,219,171,.20), transparent 16%), linear-gradient(135deg, #3f2e1e, #111215 56%, #18222f)}
.portfolio-card.heritage{background:radial-gradient(circle at 22% 18%, rgba(255,255,255,.10), transparent 14%), linear-gradient(135deg, #2e241a, #101114 56%, #192738)}
.portfolio-card.city{background:radial-gradient(circle at 64% 18%, rgba(128,184,255,.22), transparent 16%), linear-gradient(135deg, #0f1114, #121822 54%, #2b1f2e)}
.portfolio-card.cinema{background:radial-gradient(circle at 24% 18%, rgba(255,221,185,.18), transparent 16%), linear-gradient(135deg, #31251b, #111216 56%, #1a2735)}
.portfolio-content{
  position:absolute;
  left:22px;
  right:22px;
  bottom:22px;
}
.portfolio-tag{
  color:var(--gold);
  font-size:13px;
  letter-spacing:.14em;
  text-transform:uppercase;
  margin-bottom:8px;
}
.portfolio-title{
  font-size:34px;
  line-height:1.1;
  font-weight:700;
  margin-bottom:10px;
}
.portfolio-desc{
  color:#ded6c9;
  font-size:20px;
  line-height:1.5;
}
.portfolio-footer{
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  gap:20px;
  margin-top:18px;
}
.qr-box{
  width:164px;
  height:164px;
  padding:12px;
  border-radius:22px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.04);
  display:grid;
  grid-template-columns:repeat(7,1fr);
  gap:4px;
}
.qr-box span{
  border-radius:4px;
  background:#f4eee2;
}
.qr-box span.off{background:transparent}
.qr-label{
  color:var(--muted);
  font-size:15px;
  line-height:1.5;
  max-width:320px;
}
.process-grid{
  grid-template-columns:repeat(5, 1fr);
  margin-top:26px;
}
.step{
  padding:22px 20px 24px;
  border-radius:26px;
  border:1px solid rgba(255,255,255,.08);
  background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
  min-height:540px;
  position:relative;
}
.step::after{
  content:"";
  position:absolute;
  left:20px;
  right:20px;
  bottom:18px;
  height:3px;
  border-radius:999px;
  background:linear-gradient(90deg, rgba(214,167,93,.86), rgba(214,167,93,.12));
}
.step-no{
  width:56px;
  height:56px;
  border-radius:18px;
  display:grid;
  place-items:center;
  background:rgba(214,167,93,.14);
  border:1px solid rgba(214,167,93,.22);
  color:var(--gold);
  font-size:20px;
  font-weight:700;
  margin-bottom:18px;
}
.step-name{
  font-size:28px;
  line-height:1.2;
  font-weight:700;
  margin-bottom:14px;
}
.step-copy{
  color:#d4cdc1;
  font-size:20px;
  line-height:1.55;
  min-height:160px;
}
.step-point{
  margin-top:18px;
  padding:16px 18px;
  border-radius:18px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08);
  color:#f3ecdf;
  font-size:18px;
  line-height:1.5;
}
.process-note{
  margin-top:20px;
  display:flex;
  gap:18px;
}
.note-chip{
  flex:1;
  padding:18px 20px;
  border-radius:20px;
  background:rgba(214,167,93,.08);
  border:1px solid rgba(214,167,93,.14);
  font-size:20px;
  line-height:1.55;
  color:#f5edde;
}
.package-wrap{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:18px;
  margin-top:20px;
}
.package-card{
  padding:28px 24px 24px;
  border-radius:28px;
  border:1px solid rgba(255,255,255,.08);
  background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
  min-height:690px;
  position:relative;
}
.package-card.start{background:linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02))}
.package-card.brand{
  transform:translateY(-18px);
  border-color:rgba(214,167,93,.26);
  background:linear-gradient(180deg, rgba(214,167,93,.15), rgba(255,255,255,.03));
  box-shadow:0 18px 40px rgba(214,167,93,.12);
}
.package-card.premium{
  background:linear-gradient(180deg, rgba(0,0,0,.28), rgba(214,167,93,.05));
}
.package-top{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  margin-bottom:18px;
}
.package-name{
  font-size:34px;
  font-weight:700;
  letter-spacing:-.03em;
}
.package-badge{
  padding:8px 12px;
  border-radius:999px;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.08);
  color:var(--muted);
  font-size:13px;
  letter-spacing:.12em;
  text-transform:uppercase;
}
.package-card.brand .package-badge{
  color:#201509;
  background:var(--gold);
  border-color:rgba(255,255,255,.10);
}
.package-price{
  margin:10px 0 12px;
  font-size:48px;
  line-height:1.02;
  font-weight:700;
  color:#fff7ea;
}
.package-target,
.package-meta{
  color:#d7d0c3;
  font-size:18px;
  line-height:1.5;
}
.package-meta{
  display:grid;
  gap:8px;
  margin-top:18px;
  padding-top:18px;
  border-top:1px solid rgba(255,255,255,.08);
}
.package-list{
  margin:20px 0 0;
  padding-left:20px;
  display:grid;
  gap:10px;
  color:#eee7d9;
  font-size:18px;
  line-height:1.5;
}
.package-foot{
  position:absolute;
  left:24px;
  right:24px;
  bottom:24px;
  padding:14px 16px;
  border-radius:18px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08);
  color:#f0eadf;
  font-size:17px;
  line-height:1.5;
}
.contact-grid{
  grid-template-columns:1.08fr .92fr;
  align-items:start;
}
.contact-copy{
  padding-top:12px;
}
.contact-big{
  margin:28px 0 0;
  font-size:72px;
  line-height:1.05;
  letter-spacing:-.05em;
  font-weight:700;
}
.contact-body{
  margin-top:24px;
  max-width:760px;
  color:#d4cec3;
  font-size:28px;
  line-height:1.6;
}
.contact-info{
  margin-top:36px;
  display:grid;
  gap:14px;
}
.info-row{
  display:grid;
  grid-template-columns:170px 1fr;
  gap:16px;
  padding:18px 20px;
  border-radius:18px;
  border:1px solid rgba(255,255,255,.08);
  background:rgba(255,255,255,.03);
}
.info-row strong{
  color:var(--gold);
  font-size:15px;
  letter-spacing:.14em;
  text-transform:uppercase;
}
.info-row span{
  font-size:22px;
  color:#f4ede0;
}
.contact-side{
  display:grid;
  gap:18px;
}
.contact-card{
  padding:24px;
  border-radius:28px;
  border:1px solid rgba(255,255,255,.08);
  background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
}
.showreel-box{
  display:flex;
  gap:18px;
  align-items:center;
}
.qr-large{
  width:196px;
  height:196px;
  padding:14px;
  border-radius:24px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.04);
  display:grid;
  grid-template-columns:repeat(8,1fr);
  gap:4px;
  flex:none;
}
.qr-large span{
  border-radius:4px;
  background:#f4eee1;
}
.qr-large span.off{background:transparent}
.showreel-copy strong{
  display:block;
  font-size:14px;
  letter-spacing:.16em;
  color:var(--gold);
  text-transform:uppercase;
  margin-bottom:10px;
}
.showreel-copy p{
  margin:0;
  color:#efe7d8;
  font-size:22px;
  line-height:1.55;
}
.fine-print{
  margin-top:10px;
  color:var(--soft);
  font-size:16px;
  line-height:1.5;
}
`;

function reelUi() {
  return `
    <div class="reel-ui">
      <div class="ui-chip">REELS</div>
      <div class="ui-chip">SAVE</div>
      <div class="ui-chip">SHARE</div>
      <div class="ui-chip">FOLLOW</div>
    </div>
  `;
}

function qrMarkup(className, cells, offIndices) {
  const set = new Set(offIndices);
  return `
    <div class="${className}">
      ${Array.from({ length: cells }, (_, index) => `<span class="${set.has(index) ? "off" : ""}"></span>`).join("")}
    </div>
  `;
}

function renderCover() {
  return `
    <section class="slide">
      <div class="canvas">
        <div class="topbar">
          <div class="logo"><div class="logo-mark">UM</div> UNIT MEDIA</div>
          <div class="meta">
            <div class="meta-pill">AI HERITAGE CONTENT STUDIO</div>
            <div class="meta-pill">16:9 BRAND DECK</div>
          </div>
        </div>
        <div class="hero-grid">
          <div class="cover-copy">
            <div class="kicker">AI HERITAGE CONTENT STUDIO</div>
            <h1 class="title">UNIT MEDIA<br />AI HERITAGE CONTENT STUDIO</h1>
            <p class="subtitle">문화유산 · 전통브랜드 · 공간을 SNS 콘텐츠로 재해석하는 AI 콘텐츠 스튜디오</p>
            <div class="tag-row">
              <span class="tag">AI Cinematic</span>
              <span class="tag">Short-form Content</span>
              <span class="tag">Heritage Storytelling</span>
              <span class="tag">SNS Branding</span>
            </div>
          </div>
          <div class="hero-art">
            <div class="hero-overlay">
              <div class="overlay-block">
                <div class="overlay-label">Brand Promise</div>
                <div class="overlay-text">AI로 브랜드의 시간을 콘텐츠로 만듭니다.</div>
              </div>
              <div class="overlay-block">
                <div class="overlay-label">Visual Mood</div>
                <div class="overlay-text">Black · White · Gold, Korean heritage, cinematic light, digital luxury</div>
              </div>
            </div>
          </div>
        </div>
        <div class="slide-no">01 / 08</div>
      </div>
    </section>
  `;
}

function renderWhoWeAre() {
  const keywords = [
    "AI Cinematic",
    "SNS Branding",
    "Short-form Content",
    "Heritage Storytelling",
    "Digital Campaign",
    "Viral Content",
  ];

  return `
    <section class="slide">
      <div class="canvas">
        <div class="topbar">
          <div class="logo"><div class="logo-mark">UM</div> UNIT MEDIA</div>
          <div class="meta"><div class="meta-pill">WHO WE ARE</div></div>
        </div>
        <div class="section-head">
          <div class="section-copy">
            <div class="eyebrow">Brand Positioning</div>
            <h2 class="title small">우리는 단순 영상 제작사가 아닙니다</h2>
          </div>
        </div>
        <div class="who-grid">
          <div class="statement panel soft">
            <div class="statement-copy">
              유니트미디어는 <span class="accent">문화유산 · 전통브랜드 · 공간의 스토리</span>를
              AI 기반 영상과 SNS 콘텐츠로 재해석하는 디지털 콘텐츠 스튜디오입니다.<br /><br />
              우리는 단순히 영상을 만드는 것이 아니라
              <span class="accent">브랜드가 SNS에서 소비되고 저장되는 방식</span>을 설계합니다.
            </div>
            <div class="keyword-grid">
              ${keywords.map((keyword) => `<div class="keyword"><strong>${esc(keyword)}</strong></div>`).join("")}
            </div>
          </div>
          <div class="media-stack">
            <div class="still-card">
              <div class="label">
                <div class="card-kicker">Cinematic Still</div>
                <div class="card-title">전통의 시간을 디지털 질감으로 다시 보여주는 화면 설계</div>
              </div>
            </div>
            <div class="reel-card">
              ${reelUi()}
              <div class="label">
                <div class="card-kicker">Reels-first Interface</div>
                <div class="card-title">저장되고 공유되는 숏폼 구조를 전제로 기획합니다</div>
              </div>
            </div>
            <div class="ui-card">
              <div class="card-kicker">Content System</div>
              <div class="ui-lines">
                <div class="ui-line long"></div>
                <div class="ui-line mid"></div>
                <div class="ui-line small"></div>
                <div class="ui-line long"></div>
                <div class="ui-line gold mid"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="slide-no">02 / 08</div>
      </div>
    </section>
  `;
}

function renderWhyNow() {
  const metrics = [
    "좋은 제품만으로는 발견되지 않습니다. 지금 브랜드는 ‘공유되는 콘텐츠’를 가져야 합니다.",
    "전통 브랜드도 SNS 브랜딩이 필요합니다. 감도와 스토리가 있어야 저장되고 회자됩니다.",
    "숏폼 시대에는 긴 설명보다 짧은 인상과 장면이 먼저 작동합니다.",
    "MZ 세대는 정보보다 맥락과 서사를 소비합니다. 브랜드는 스토리 단위로 기억됩니다.",
    "관광·문화 역시 영상 중심 시대입니다. 현장성과 분위기를 전달하는 콘텐츠가 중요합니다.",
  ];

  return `
    <section class="slide">
      <div class="canvas">
        <div class="topbar">
          <div class="logo"><div class="logo-mark">UM</div> UNIT MEDIA</div>
          <div class="meta"><div class="meta-pill">WHY NOW</div></div>
        </div>
        <div class="section-head">
          <div class="section-copy">
            <div class="eyebrow">Why This Matters</div>
            <h2 class="title small">지금 브랜드는 “좋은 제품”보다<br />“공유되는 콘텐츠”가 중요합니다</h2>
          </div>
        </div>
        <div class="why-grid">
          <div class="data-box panel soft">
            ${metrics
              .map(
                (metric, index) => `
                  <div class="metric">
                    <div class="metric-no">INSIGHT 0${index + 1}</div>
                    <div class="metric-text">${esc(metric)}</div>
                  </div>
                `,
              )
              .join("")}
          </div>
          <div>
            <div class="insight-stack">
              <div class="insight-card">
                <strong>브랜드 검색보다 SNS 발견이 먼저 일어납니다</strong>
                <p>브랜드를 찾아오는 시대가 아니라, 콘텐츠 속에서 브랜드를 처음 만나는 시대입니다.</p>
              </div>
              <div class="insight-card">
                <strong>숏폼은 설명보다 분위기를 먼저 전달합니다</strong>
                <p>첫 3초에 무드와 정체성을 설계하지 못하면 브랜드는 스쳐 지나갑니다.</p>
              </div>
            </div>
            <div class="phone-mockups">
              <div class="phone">
                <div class="phone-screen">
                  <div class="screen-stat">REELS DISCOVERY<br />Save-driven Brand Recall</div>
                </div>
              </div>
              <div class="phone">
                <div class="phone-screen">
                  <div class="screen-stat">SHORT-FORM STORY<br />Mood + Story + Shareability</div>
                </div>
              </div>
              <div class="phone">
                <div class="phone-screen">
                  <div class="screen-stat">CULTURE & TOURISM<br />Visual-first Attention Economy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="slide-no">03 / 08</div>
      </div>
    </section>
  `;
}

function renderWhatWeDo() {
  const services = [
    {
      tone: "ai",
      no: "01",
      name: "AI 브랜드 필름",
      desc: "브랜드의 시간, 무드, 철학을 시네마틱 감도로 구조화한 브랜드 필름",
      caption: "Cinematic mood, slow reveal, emotional brand framing",
    },
    {
      tone: "short",
      no: "02",
      name: "SNS 숏폼 콘텐츠",
      desc: "릴스 · 유튜브 쇼츠에 맞춘 저장형 숏폼 콘텐츠 기획 및 편집",
      caption: "Reels / Shorts / vertical-first hook design",
    },
    {
      tone: "heritage",
      no: "03",
      name: "문화유산 콘텐츠",
      desc: "전통 · 관광 · 지역 브랜딩을 현대적인 SNS 화면 언어로 번역",
      caption: "Heritage storytelling for tourism and cultural branding",
    },
    {
      tone: "ops",
      no: "04",
      name: "SNS 운영",
      desc: "브랜드 채널 운영, 월간 콘텐츠 구조 설계, 업로드 플로우 최적화",
      caption: "Channel planning, content system, operational continuity",
    },
  ];

  return `
    <section class="slide">
      <div class="canvas">
        <div class="topbar">
          <div class="logo"><div class="logo-mark">UM</div> UNIT MEDIA</div>
          <div class="meta"><div class="meta-pill">WHAT WE DO</div></div>
        </div>
        <div class="section-head">
          <div class="section-copy">
            <div class="eyebrow">Service Scope</div>
            <h2 class="title small">유니트미디어는 이런 콘텐츠를 만듭니다</h2>
            <div class="body-copy">한 줄 설명, 예시 이미지, 실제 활용 화면까지 한 번에 보여주는 구조로 설계합니다.</div>
          </div>
        </div>
        <div class="what-grid">
          ${services
            .map(
              (service) => `
                <div class="service-card">
                  <div class="service-no">${service.no}</div>
                  <div class="service-name">${esc(service.name)}</div>
                  <div class="service-desc">${esc(service.desc)}</div>
                  <div class="visual-mini ${service.tone}">
                    <div class="mini-overlay">
                      <strong>Mockup Preview</strong>
                      <span>${esc(service.caption)}</span>
                    </div>
                  </div>
                  <div class="mock-ui">
                    <div class="bar gold"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
        <div class="slide-no">04 / 08</div>
      </div>
    </section>
  `;
}

function renderPortfolio() {
  return `
    <section class="slide">
      <div class="canvas">
        <div class="topbar">
          <div class="logo"><div class="logo-mark">UM</div> UNIT MEDIA</div>
          <div class="meta"><div class="meta-pill">SELECTED WORKS</div></div>
        </div>
        <div class="section-head">
          <div class="section-copy">
            <div class="eyebrow">Portfolio</div>
            <h2 class="title small">Selected Works</h2>
            <div class="body-copy">브랜드의 스토리와 감도를 콘텐츠로 전환한 대표 작업을 큐레이션했습니다.</div>
          </div>
        </div>
        <div class="portfolio-grid">
          ${portfolioCards
            .map(
              (card) => `
                <div class="portfolio-card ${card.mood}">
                  <div class="portfolio-content">
                    <div class="portfolio-tag">${esc(card.tag)}</div>
                    <div class="portfolio-title">${esc(card.title)}</div>
                    <div class="portfolio-desc">${esc(card.desc)}</div>
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
        <div class="portfolio-footer">
          <div class="qr-label">유튜브 QR을 실제 계정 링크로 교체하면 바로 포트폴리오 영상으로 연결되는 세일즈 덱으로 사용할 수 있습니다.</div>
          ${qrMarkup("qr-box", 49, [1, 5, 7, 8, 11, 13, 15, 16, 20, 23, 26, 28, 30, 31, 33, 36, 38, 39, 41, 44, 46])}
        </div>
        <div class="slide-no">05 / 08</div>
      </div>
    </section>
  `;
}

function renderProcess() {
  const copies = [
    "브랜드의 스토리, 타겟, 현재 채널 상태를 해석합니다.",
    "브랜드가 SNS에서 어떻게 소비돼야 하는지 구조를 설계합니다.",
    "브랜드 무드와 서사에 맞는 AI 기반 비주얼을 제작합니다.",
    "편집, 자막, 카피, 사운드로 브랜딩 감도를 정리합니다.",
    "릴스/쇼츠 업로드 기준으로 최종 포맷과 흐름을 맞춥니다.",
  ];

  const points = [
    "기획이 먼저입니다",
    "스토리와 브랜딩 중심",
    "AI 자동생성처럼 보이지 않게",
    "무드와 화면 톤 통합",
    "플랫폼 맞춤 최적화",
  ];

  return `
    <section class="slide">
      <div class="canvas">
        <div class="topbar">
          <div class="logo"><div class="logo-mark">UM</div> UNIT MEDIA</div>
          <div class="meta"><div class="meta-pill">PROCESS</div></div>
        </div>
        <div class="section-head">
          <div class="section-copy">
            <div class="eyebrow">Workflow</div>
            <h2 class="title small">콘텐츠는 이렇게 만들어집니다</h2>
            <div class="body-copy">보여주기식 AI가 아니라, <strong>기획 중심 · 브랜딩 중심</strong> 프로세스로 제작합니다.</div>
          </div>
        </div>
        <div class="process-grid">
          ${processSteps
            .map(
              (step, index) => `
                <div class="step">
                  <div class="step-no">${index + 1}</div>
                  <div class="step-name">${esc(step)}</div>
                  <div class="step-copy">${esc(copies[index])}</div>
                  <div class="step-point">${esc(points[index])}</div>
                </div>
              `,
            )
            .join("")}
        </div>
        <div class="process-note">
          <div class="note-chip">“AI가 자동으로 만든 영상”처럼 보이면 안 됩니다. 각 단계는 브랜드 메시지를 정교하게 컨트롤하기 위한 기획 장치입니다.</div>
          <div class="note-chip">그래서 유니트미디어의 결과물은 기술 데모가 아니라, SNS에서 실제로 소비되고 저장되는 브랜드 콘텐츠가 됩니다.</div>
        </div>
        <div class="slide-no">06 / 08</div>
      </div>
    </section>
  `;
}

function renderPackages() {
  return `
    <section class="slide">
      <div class="canvas">
        <div class="topbar">
          <div class="logo"><div class="logo-mark">UM</div> UNIT MEDIA</div>
          <div class="meta"><div class="meta-pill">SNS BRANDING PACKAGE</div></div>
        </div>
        <div class="section-head">
          <div class="section-copy">
            <div class="eyebrow">Package</div>
            <h2 class="title small">SNS Branding Package</h2>
            <div class="body-copy">가운데 <strong>BRAND PACKAGE</strong>를 기준 상품으로 강조한 구조입니다.</div>
          </div>
        </div>
        <div class="package-wrap">
          ${packageCards
            .map(
              (pkg) => `
                <div class="package-card ${pkg.tone}">
                  <div class="package-top">
                    <div class="package-name">${esc(pkg.name)}</div>
                    <div class="package-badge">${pkg.featured ? "Best Fit" : "Plan"}</div>
                  </div>
                  <div class="package-price">${esc(pkg.price)}</div>
                  <div class="package-target">${esc(pkg.target)}</div>
                  <div class="package-meta">
                    <div><strong>수정 횟수</strong> ${esc(pkg.revisions)}</div>
                    <div><strong>운영 범위</strong> ${esc(pkg.coverage)}</div>
                  </div>
                  <ul class="package-list">
                    ${pkg.items.map((item) => `<li>${esc(item)}</li>`).join("")}
                  </ul>
                  <div class="package-foot">추천 대상: ${esc(pkg.target)}</div>
                </div>
              `,
            )
            .join("")}
        </div>
        <div class="slide-no">07 / 08</div>
      </div>
    </section>
  `;
}

function renderContact() {
  return `
    <section class="slide">
      <div class="canvas">
        <div class="topbar">
          <div class="logo"><div class="logo-mark">UM</div> UNIT MEDIA</div>
          <div class="meta"><div class="meta-pill">CONTACT</div></div>
        </div>
        <div class="contact-grid">
          <div class="contact-copy">
            <div class="eyebrow">Closing</div>
            <div class="contact-big">Let’s Build Your<br />Brand Story</div>
            <div class="contact-body">
              유니트미디어는 브랜드의 시간과 이야기를<br />
              SNS 콘텐츠로 재해석합니다.<br /><br />
              문화유산, 전통브랜드, 공간 브랜딩을 위한
              가장 현대적인 화면 언어를 함께 설계합니다.
            </div>
            <div class="contact-info">
              <div class="info-row"><strong>E-mail</strong><span>[공식 메일 삽입]</span></div>
              <div class="info-row"><strong>Instagram</strong><span>[공식 인스타그램 삽입]</span></div>
              <div class="info-row"><strong>YouTube</strong><span>[공식 유튜브 삽입]</span></div>
              <div class="info-row"><strong>Phone</strong><span>[공식 연락처 삽입]</span></div>
            </div>
          </div>
          <div class="contact-side">
            <div class="contact-card">
              <div class="showreel-box">
                ${qrMarkup("qr-large", 64, [1, 3, 5, 7, 10, 14, 15, 18, 19, 20, 22, 24, 27, 30, 31, 33, 35, 38, 39, 41, 43, 46, 47, 50, 52, 53, 56, 58, 61])}
                <div class="showreel-copy">
                  <strong>Showreel QR</strong>
                  <p>포트폴리오 영상으로 바로 이동하는 QR을 넣으면 미팅 자료로 바로 활용할 수 있습니다.</p>
                </div>
              </div>
            </div>
            <div class="contact-card">
              <div class="card-kicker">Use Case</div>
              <div class="card-title">브랜드 소개서 · 미팅용 PDF · 제안서 부록 · 세일즈 자료</div>
              <div class="fine-print">실계정 정보와 실제 QR 코드만 교체하면 곧바로 외부 발송용 자료로 사용할 수 있습니다.</div>
            </div>
          </div>
        </div>
        <div class="slide-no">08 / 08</div>
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
    <title>UNIT MEDIA Branding Deck</title>
    <style>${css}</style>
  </head>
  <body>
    <div class="deck">
      ${renderCover()}
      ${renderWhoWeAre()}
      ${renderWhyNow()}
      ${renderWhatWeDo()}
      ${renderPortfolio()}
      ${renderProcess()}
      ${renderPackages()}
      ${renderContact()}
    </div>
  </body>
</html>`;

fs.writeFileSync(outPath, html, "utf8");
console.log(outPath);
