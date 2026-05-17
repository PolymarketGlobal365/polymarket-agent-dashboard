import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { metrics } from "../content";

const partnerLogos = [
  { src: "/images/partners/f1.png", alt: "국가유산청 로고" },
  { src: "/images/partners/f2.png", alt: "국립고궁박물관 로고" },
  { src: "/images/partners/f3.png", alt: "여주시 로고" },
  { src: "/images/partners/f4.png", alt: "책박물관 로고" },
  { src: "/images/partners/f5.png", alt: "국립무형유산원 로고" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        headerContent={
          <div className="about-logo-lockup">
            <div className="about-hero-logo-mask" role="img" aria-label="UNITEMEDIA 로고"></div>
          </div>
        }
        description="유니트미디어는 메시지를 설계하는 제작 시스템으로 진행됩니다"
        descriptionClassName="hero-text-centered"
        actions={
          <>
            <Link className="button button-dark" to="/portfolio">
              작업 방식 보기
            </Link>
            <Link className="button button-light" to="/contact">
              협업 문의
            </Link>
          </>
        }
        visual={
          <div className="feature-panel feature-panel-tall about-philosophy-copy">
            <div className="about-philosophy-stars" aria-hidden="true">
              ★★★★★
            </div>
            <h3 className="about-philosophy-title about-philosophy-title-plain">
              맞춤형
              <br />
              AI 콘텐츠
              <br />
              스튜디오
            </h3>
            <p className="about-philosophy-body">
              UNITEMEDIA는 롱폼, 숏폼, 기업 홍보, 지자체 캠페인,
              <br />
              행사 프로모션 영상을 기획부터 연출, 편집, 납품까지
              <br />
              설계하는 AI 콘텐츠 제작사입니다
            </p>
          </div>
        }
      />

      <section className="about-section">
        <div className="section-head two-column about-identity-head">
          <div>
            <span className="section-pill">Identity</span>
            <h2>
              기업과 공공 프로젝트에 맞는 방식으로
              <br />
              콘텐츠를 제작합니다
            </h2>
          </div>
        </div>

        <div className="about-partner-card">
          <div className="about-partner-card-head">
            <p>협력업체</p>
          </div>
          <div className="about-partner-track">
            <div className="about-partner-row">
              {[...partnerLogos, ...partnerLogos].map((partner, index) => (
                <div key={`${partner.alt}-${index}`} className="partner-logo-chip">
                  <img src={partner.src} alt={partner.alt} className="partner-logo-image" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="metric-stage">
          {metrics.map((metric) => (
            <div key={metric.title} className="metric-card">
              <strong>{metric.title}</strong>
              <span>{metric.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-grid">
        <article className="glass-card">
          <span className="section-pill">Approach</span>
          <h3>
            기획과 제작이
            <br />
            분리되지 않는 구조
          </h3>
          <p>
            기획자가 전달한 문서를 영상팀이 다시 해석하는 방식 대신, 처음부터 같은 구조 안에서 카피,
            연출, 편집 포인트를 함께 잡습니다.
          </p>
        </article>
        <article className="glass-card">
          <span className="section-pill">Tone</span>
          <h3>
            브랜드 톤과
            <br />
            공공 메시지의 균형
          </h3>
          <p>
            기업 홍보, 서비스 소개, 지자체 프로젝트, 현장 행사마다 다른 언어와 화면 밀도를 적용해
            목적에 맞는 인상을 만듭니다.
          </p>
        </article>
        <article className="glass-card">
          <span className="section-pill">Output</span>
          <h3>하나의 메인 메시지에서 여러 포맷으로 확장</h3>
          <p>
            메인 필름을 중심으로 숏폼, 현장 상영본, 제안용 영상과 페이지까지 자연스럽게 이어지는
            패키지를 설계합니다.
          </p>
        </article>
      </section>
    </>
  );
}
