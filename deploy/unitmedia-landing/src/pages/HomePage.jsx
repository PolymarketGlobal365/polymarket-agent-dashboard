import { useEffect } from "react";
import { Link } from "react-router-dom";
import ContactSection from "../components/ContactSection";
import DotField from "../components/DotField";
import ServiceTabs from "../components/ServiceTabs";
import { logoList, metrics, partnerLogos } from "../content";

const pipelineTools = [
  {
    name: "Kling",
    description: "시네마틱 모션 연출과 감정선 기반 영상 생성",
    role: "Motion Direction",
    href: "https://kling.ai/",
  },
  {
    name: "Runway",
    description: "브랜드 비주얼 확장과 AI compositing 작업",
    role: "Visual Expansion",
    href: "https://runwayml.com/",
  },
  {
    name: "Veo",
    description: "광고형 cinematic sequence 생성",
    role: "Sequence Build",
    href: "https://deepmind.google/models/veo/",
  },
  {
    name: "Seedance",
    description: "스타일 기반 비주얼 및 컨셉 연출",
    role: "Style Framing",
    href: "https://www.seedance.ai/",
  },
];

export default function HomePage() {
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
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="stars">AI Content Studio</span>
            <span>기업, 공공기관, 행사 운영팀을 위한 AI 영상 제작 파트너</span>
          </div>
          <h1>맞춤형 AI 콘텐츠 스튜디오</h1>
          <div className="hero-actions">
            <Link className="button button-dark" to="/contact">
              문의하기
            </Link>
            <Link className="button button-light" to="/services">
              어떻게 진행하나요
            </Link>
          </div>

          <div className="partner-marquee" aria-label="파트너 협력처">
            <p>파트너 협력처</p>
            <div className="partner-track">
              <div className="partner-row">
                {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                  <span key={`${logo}-${index}`} className="partner-logo">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <a
            className="hero-visual-link"
            href="https://www.youtube.com/@%EC%9C%A0%EB%8B%88%ED%8A%B8%EB%AF%B8%EB%94%94%EC%96%B4"
            target="_blank"
            rel="noreferrer"
            aria-label="유니트미디어 유튜브 채널로 이동"
          >
            <div className="hero-visual-inner">
              <div className="hero-bloom">
                <div className="hero-bloom-core"></div>
                <div className="hero-bloom-petal petal-a"></div>
                <div className="hero-bloom-petal petal-b"></div>
                <div className="hero-bloom-petal petal-c"></div>
                <div className="hero-bloom-petal petal-d"></div>
                <div className="hero-bloom-glow"></div>
              </div>
              <DotField />
            </div>
          </a>
        </div>
      </section>

      <section className="logo-strip" aria-label="주요 사용 분야">
        <p>주요 사용 분야</p>
        <div className="logo-list">
          {logoList.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="section-head two-column">
          <div className="about-section-copy">
            <span className="section-pill">Who we are</span>
            <h2 className="about-section-heading">유니트미디어는 AI를 도구로 두고, 메시지를 선명하게 만듭니다</h2>
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

      <section className="services-section">
        <div className="section-head centered">
          <span className="section-pill">Services</span>
          <h2>모든 영상 제작 단계를 유니트미디어가 맡습니다</h2>
          <p>
            단순 편집만이 아니라 목표 진단부터 배포 방향 확장까지 한 흐름 안에서
            이어집니다.
          </p>
        </div>
        <ServiceTabs />
      </section>

      <section className="comparison-section">
        <div className="section-head centered narrow">
          <span className="section-pill">Why choose us</span>
          <h2 className="comparison-section-heading">
            단순한 AI 영상 제작이 아닌
            <br />
            브랜드에 기억되는 영상을 만듭니다
          </h2>
          <p>
            화려함만 앞세우는 결과물보다 홍보 목표와 운영 맥락에 맞는 메시지를
            우선합니다.
          </p>
        </div>

        <div className="comparison-grid">
          <article className="comparison-card muted">
            <div className="comparison-tags">
              <span>과장된 효과</span>
              <span>불분명한 목적</span>
              <span>긴 수정 루프</span>
            </div>
            <h3>일반적인 제작 방식</h3>
            <p>
              예쁘기만 한 결과물은 실제 홍보 성과로 이어지기 어렵습니다.
            </p>
          </article>
          <article className="comparison-card vivid">
            <div className="comparison-tags">
              <span>명확한 타깃</span>
              <span>빠른 납기</span>
              <span>플랫폼 확장</span>
            </div>
            <h3>UNITEMEDIA</h3>
            <p>
              하나의 전달 메시지를 중심으로 메인 영상과 숏폼, 행사 현장용, 제안서용
              페이지까지 이어지게 만듭니다.
            </p>
          </article>
        </div>
      </section>

      <section className="pipeline-section">
        <div className="pipeline-layout">
          <div className="pipeline-copy" data-reveal>
            <span className="section-pill">AI Production Pipeline</span>
            <h2>
              Powered by
              <br />
              Multi-AI
              <br />
              Workflow
            </h2>
            <p>
              Kling, Runway, Veo, Seedance 기반의 AI 영상 제작 파이프라인으로
              브랜드와 문화유산 콘텐츠를 설계합니다.
            </p>
          </div>

          <div className="pipeline-grid">
            {pipelineTools.map((tool, index) => (
              <div
                key={tool.name}
                className="pipeline-step"
                data-reveal
                style={{ "--reveal-delay": `${index * 80}ms` }}
              >
                <a
                  className="pipeline-card"
                  href={tool.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="pipeline-card-top">
                    <span className="pipeline-role">{tool.role}</span>
                    <span className="pipeline-preview-tag">Preview</span>
                  </div>
                  <div className="pipeline-preview">
                    <div className="pipeline-preview-screen">
                      <div className="pipeline-preview-orb" />
                      <div className="pipeline-preview-ring" />
                      <div className="pipeline-preview-scan" />
                      <div className="pipeline-preview-play">
                        <span className="pipeline-preview-play-icon" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                  <div className="pipeline-card-body">
                    <h3>{tool.name}</h3>
                    <p>{tool.description}</p>
                  </div>
                </a>
                {index < pipelineTools.length - 1 ? (
                  <span className="pipeline-link" aria-hidden="true">
                    <span className="pipeline-link-line" />
                    <span className="pipeline-link-arrow">→</span>
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section">
        <div className="section-head two-column">
          <div>
            <span className="section-pill">LOCAL PROMOTION</span>
          </div>
        </div>

        <div className="case-grid">
          <article className="case-copy">
            <h3>지자체 관광 홍보 캠페인</h3>
            <p>
              지역의 전달 메시지를 담은 메인 홍보영상과 숏폼 릴스, 행사 현장 상영본까지
              하나의 시각 언어로 연결하는 방식입니다.
            </p>
            <div className="case-metrics">
              <div>
                <strong>로컬 메인 필름</strong>
                <span>메시지 전달 중심의 시그니처 영상</span>
              </div>
              <div>
                <strong>숏폼 파생 시리즈</strong>
                <span>릴스, 쇼츠, 행사 운영용 리패키지</span>
              </div>
            </div>
          </article>
          <div className="case-art">
            <div className="case-glow case-glow-a"></div>
            <div className="case-glow case-glow-b"></div>
            <div className="case-wordmark">
              LOCAL
              <br />
              PROMOTION
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
