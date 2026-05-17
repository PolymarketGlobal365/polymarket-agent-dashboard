import { useEffect } from "react";
import { Link } from "react-router-dom";

const serviceCards = [
  {
    number: "01",
    title: "AI 시네마틱 영상 제작",
    description: "브랜드 필름, 캠페인 영상, 홍보 영상을 AI 기반 시네마틱 비주얼로 제작합니다.",
    icon: "CF",
    image: "/images/services/1.png",
    objectPosition: "center",
  },
  {
    number: "02",
    title: "문화유산 디지털 콘텐츠",
    description: "문화재, 전통, 지역 유산을 AI 영상과 몰입형 비주얼 콘텐츠로 재해석합니다.",
    icon: "AR",
    image: "/images/services/6.png",
    objectPosition: "center",
  },
  {
    number: "03",
    title: "브랜드 스토리텔링 기획",
    description: "브랜드의 가치와 타깃, 경쟁사를 분석해 콘텐츠의 핵심 메시지와 스토리를 설계합니다.",
    icon: "ST",
    image: "/images/services/2.png",
    objectPosition: "center",
  },
  {
    number: "04",
    title: "SNS 숏폼 콘텐츠 제작",
    description: "인스타그램 릴스, 유튜브 쇼츠, 틱톡에 최적화된 짧고 강한 영상 콘텐츠를 제작합니다.",
    icon: "SF",
    image: "/images/services/3.png",
    objectPosition: "center",
  },
  {
    number: "05",
    title: "캠페인 홍보 콘텐츠",
    description: "지자체 행사, 공공 캠페인, 기업 프로모션을 위한 온라인 홍보 콘텐츠를 제작합니다.",
    icon: "EV",
    image: "/images/services/4.png",
    objectPosition: "center",
  },
  {
    number: "06",
    title: "편집 / 자막 / 후반 작업",
    description: "브랜드 무드에 맞는 편집, 자막, BGM, 색감 보정까지 완성도 있게 마무리합니다.",
    icon: "ED",
    image: "/images/services/5.jpg",
    objectPosition: "center",
  },
];

const processSteps = [
  {
    number: "01",
    title: (
      <>
        브랜드/프로젝트
        <br />
        상세 분석
      </>
    ),
    description: "브랜드 문서, 레퍼런스, 타깃 데이터를 검토하고 콘텐츠 설계의 기준을 정리합니다.",
    graphic: "analysis",
  },
  {
    number: "02",
    title: "콘텐츠 방향성 기획",
    description: "메시지 축과 무드 방향을 연결해 AI 크리에이티브 콘텐츠의 전체 흐름을 설계합니다.",
    graphic: "strategy",
  },
  {
    number: "03",
    title: (
      <>
        스토리보드 및
        <br />
        프롬프트 설계
      </>
    ),
    description: "프레임 구성과 프롬프트 룰을 정교하게 설계해 화면의 일관성과 재현성을 높입니다.",
    graphic: "prompt",
  },
  {
    number: "04",
    title: "AI 이미지, 영상 제작",
    description: "생성 파이프라인을 통해 전달 비주얼과 시네마틱 쇼트를 빠르게 구체화합니다.",
    graphic: "generation",
  },
  {
    number: "05",
    title: "편집 / 자막 / 사운드 디자인",
    description: "타이틀, 자막, 화면, 음향 디테일까지 맞춰 완성도 높은 후반 리듬을 만듭니다.",
    graphic: "editing",
  },
  {
    number: "06",
    title: "최종 납품 및 채널 활용 제안",
    description: "납품 포맷과 채널 확장 동선까지 함께 설계해 실제 사용까지 이어지도록 제안합니다.",
    graphic: "delivery",
  },
];

function ServicesProcessGraphic({ type }) {
  return (
    <div className={`services-process-graphic is-${type}`} aria-hidden="true">
      {type === "analysis" && (
        <>
          <span className="process-orb" />
          <span className="process-panel process-panel-left" />
          <span className="process-panel process-panel-right" />
          <span className="process-bar process-bar-a" />
          <span className="process-bar process-bar-b" />
          <span className="process-bar process-bar-c" />
          <span className="process-line process-line-rise" />
        </>
      )}
      {type === "strategy" && (
        <>
          <span className="process-orb" />
          <span className="process-node process-node-center" />
          <span className="process-node process-node-top" />
          <span className="process-node process-node-left" />
          <span className="process-node process-node-right" />
          <span className="process-arrow process-arrow-top" />
          <span className="process-arrow process-arrow-left" />
          <span className="process-arrow process-arrow-right" />
        </>
      )}
      {type === "prompt" && (
        <>
          <span className="process-orb" />
          <span className="process-frame process-frame-main" />
          <span className="process-frame process-frame-sub" />
          <span className="process-code process-code-a" />
          <span className="process-code process-code-b" />
          <span className="process-cursor" />
        </>
      )}
      {type === "generation" && (
        <>
          <span className="process-orb" />
          <span className="process-screen" />
          <span className="process-spark process-spark-a" />
          <span className="process-spark process-spark-b" />
          <span className="process-spark process-spark-c" />
          <span className="process-film process-film-left" />
          <span className="process-film process-film-right" />
        </>
      )}
      {type === "editing" && (
        <>
          <span className="process-orb" />
          <span className="process-timeline" />
          <span className="process-track process-track-a" />
          <span className="process-track process-track-b" />
          <span className="process-wave process-wave-a" />
          <span className="process-wave process-wave-b" />
          <span className="process-caption" />
        </>
      )}
      {type === "delivery" && (
        <>
          <span className="process-orb" />
          <span className="process-hub" />
          <span className="process-channel process-channel-top" />
          <span className="process-channel process-channel-left" />
          <span className="process-channel process-channel-right" />
          <span className="process-link process-link-top" />
          <span className="process-link process-link-left" />
          <span className="process-link process-link-right" />
        </>
      )}
    </div>
  );
}

const packages = [
  {
    name: "STANDARD",
    features: ["10~15초 임팩트 숏폼", "기본 기획 / AI 영상 제작 / 자막 / BGM", "수정 2회", "4~5일 작업"],
  },
  {
    name: "DELUXE",
    features: ["20~30초 브랜드 광고형 영상", "기획안 / 카피 / AI 영상 제작 / 광고형 편집", "수정 3회", "6~7일 작업"],
  },
  {
    name: "PREMIUM",
    features: ["30~60초 시네마틱 브랜드 필름", "스토리라인 / 고급 연출 / AI 영상 / 후반 편집", "수정 4회", "8~10일 작업"],
  },
];

const heroHighlights = [
  {
    title: "End-to-End",
    detail: "기획부터 제작, 후반 작업, 납품까지 하나의 흐름으로 운영합니다.",
  },
  {
    title: "AI Studio",
    detail: "브랜드 무드에 맞춘 비주얼 연출로 제작합니다.",
  },
  {
    title: "Multi-format",
    detail: "광고형 영상부터 숏폼, 아카이브형 콘텐츠까지 제작합니다.",
  },
];

export default function ServicesPage() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="services-page">
      <section className="services-hero" data-reveal>
        <div className="services-hero-copy">
          <span className="services-hero-kicker">Services</span>
          <h1 className="services-hero-title">
            <span>이제는</span>
            <span>
              <span className="services-hero-title-gradient">유니트미디어</span>와 진짜 AI영상을 만날 시간
            </span>
          </h1>
          <p>
            UNITEMEDIA는 기업, 공공기관, 지자체, 행사 운영팀을 위한
            <br />
            AI 영상 제작과 디지털 콘텐츠를 기획부터 연출, 편집, 납품까지 제공합니다
          </p>
          <div className="services-hero-actions">
            <Link className="button button-dark" to="/contact">
              프로젝트 문의하기
            </Link>
            <Link className="button button-light" to="/portfolio">
              포트폴리오 보기
            </Link>
          </div>
        </div>

        <div className="services-hero-ticket-row" aria-label="서비스 하이라이트">
          {serviceCards.slice(0, 5).map((card, index) => (
            <article
              key={card.number}
              className="services-hero-ticket"
              data-reveal
              style={{ "--reveal-delay": `${index * 70}ms` }}
            >
              <div className="services-hero-ticket-top">
                <span className="services-hero-ticket-badge">{card.number}</span>
                <strong>{card.title}</strong>
              </div>
            </article>
          ))}
        </div>

        <div className="services-hero-stage">
          <div className="services-hero-ribbons">
            {heroHighlights.map((item, index) => (
              <div
                key={item.title}
                className={`services-hero-ribbon ribbon-${index + 1}`}
                data-reveal
                style={{ "--reveal-delay": `${index * 80}ms` }}
              >
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </div>
            ))}
            <div className="services-hero-basket" aria-hidden="true">
              <div className="services-hero-basket-glow" />
              <div className="services-hero-basket-box">
                <span className="basket-slot basket-slot-a" />
                <span className="basket-slot basket-slot-b" />
                <span className="basket-slot basket-slot-c" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-cards-section">
        <div className="section-head centered narrow services-section-head services-section-head-cards" data-reveal>
          <span className="section-pill">What We Make</span>
          <h2>한 번 맡기면 전체 제작 흐름이 보이는 서비스 구조</h2>
          <p>필요한 서비스를 따로 나누기보다, 브랜드 메시지가 실제 결과물로 이어지는 전체 제작 프로세로 진행됩니다</p>
        </div>

        <div className="services-card-grid">
          {serviceCards.map((card, index) => (
            <article
              key={card.number}
              className="services-card"
              data-reveal
              style={{ "--reveal-delay": `${index * 80}ms` }}
            >
              <div className="services-card-media">
                <img
                  src={card.image}
                  alt={card.title}
                  className="services-card-image"
                  loading="lazy"
                  style={{ objectPosition: card.objectPosition }}
                />
                <div className="services-card-overlay" />
              </div>
              <div className="services-card-content">
                <div className="services-card-top">
                  <span className="services-card-icon">{card.icon}</span>
                  <span className="services-card-number">{card.number}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="services-process-section">
        <div className="section-head centered narrow services-section-head services-section-head-process" data-reveal>
          <div>
            <span className="section-pill">Process</span>
            <h2 className="services-process-heading">
              기획부터 납품까지
              <br />
              하나의 흐름으로 진행됩니다
            </h2>
          </div>
        </div>

        <div className="services-process-grid">
          {processSteps.map((step, index) => (
            <article
              key={step.number}
              className="services-process-card"
              data-reveal
              style={{ "--reveal-delay": `${index * 70}ms` }}
            >
              <span className="services-process-number">{step.number}</span>
              <div className="services-process-card-body">
                <ServicesProcessGraphic type={step.graphic} />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="services-package-section">
        <div className="section-head centered narrow services-section-head" data-reveal>
          <span className="section-pill">Package</span>
          <h2 className="services-package-heading">프로젝트 규모에 맞춘 제작 패키지</h2>
        </div>

        <div className="services-package-grid">
          {packages.map((item, index) => (
            <article
              key={item.name}
              className={`services-package-card${item.name === "PREMIUM" ? " is-featured" : ""}`}
              data-reveal
              style={{ "--reveal-delay": `${index * 90}ms` }}
            >
              <div className="services-package-head">
                <span className="services-package-label">Package {index + 1}</span>
                <h3>{item.name}</h3>
              </div>
              <ul className="services-package-list">
                {item.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="services-final-cta" data-reveal>
        <div className="services-final-card">
          <span className="section-pill">Start a Project</span>
          <h2>
            브랜드의 메시지를
            <br />
            AI 영상으로 확장해보세요
          </h2>
          <Link className="button button-dark" to="/contact">
            프로젝트 문의하기
          </Link>
        </div>
      </section>
    </div>
  );
}
