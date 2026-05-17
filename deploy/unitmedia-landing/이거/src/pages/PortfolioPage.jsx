import { useEffect, useState } from "react";

const heroProject = {
  category: "AI CINEMATIC FILM",
  title: "서울에 사는 36살 김춘복",
  description:
    "옛 조선시대의 양반이\n21세기 서울을 직장인으로 살아가는\nAI 시네마틱 단편 영화 프로젝트",
  image: "/images/portfolio/hero-kimchunbok.png",
};

const heroStills = [
  "/images/portfolio/kimchunbok-stills/still-02.png",
  "/images/portfolio/kimchunbok-stills/still-03.png",
  "/images/portfolio/kimchunbok-stills/still-04.png",
  "/images/portfolio/kimchunbok-stills/still-05.png",
  "/images/portfolio/kimchunbok-stills/still-06.png",
  "/images/portfolio/kimchunbok-stills/still-07.png",
  "/images/portfolio/kimchunbok-stills/still-08.png",
  "/images/portfolio/kimchunbok-stills/still-09.png",
  "/images/portfolio/kimchunbok-stills/still-10.png",
];

const heroStillPreview = heroStills.slice(0, 5);

const brandingProjects = [
  {
    title: "2050 송파의 미래를 만들다",
    description:
      "미래 도시와 지속가능성을\nAI 비주얼 콘텐츠로 재해석한 캠페인",
    image: "/images/portfolio/songpa-future.png",
    tone: "gold",
    href: "https://www.youtube.com/@%EC%9C%A0%EB%8B%88%ED%8A%B8%EB%AF%B8%EB%94%94%EC%96%B4",
  },
  {
    title: "동화의 시간, 이야기의 빛깔",
    description:
      "전통 동화를 현대 감성으로 풀어낸\nAI 기반 전시 콘텐츠 프로젝트",
    image: "/images/portfolio/fairytale-time.png",
    tone: "ivory",
    href: "https://www.youtube.com/@%EC%9C%A0%EB%8B%88%ED%8A%B8%EB%AF%B8%EB%94%94%EC%96%B4",
  },
  {
    title: "어린왕자 이야기",
    description:
      "감성적인 비주얼과 스토리텔링을 결합한\nAI 애니메이션 콘텐츠",
    image: "/images/portfolio/little-prince.png",
    tone: "night",
    href: "https://www.youtube.com/@%EC%9C%A0%EB%8B%88%ED%8A%B8%EB%AF%B8%EB%94%94%EC%96%B4",
  },
  {
    title: "AI CITY",
    description:
      "대한민국의 미래 도시를\n시네마틱 AI 영상으로 표현한 프로젝트",
    image: "/images/portfolio/ai-city.png",
    tone: "amber",
    href: "https://www.youtube.com/@%EC%9C%A0%EB%8B%88%ED%8A%B8%EB%AF%B8%EB%94%94%EC%96%B4",
  },
  {
    title: "수원화성",
    description:
      "한국의 문화유산을\n몰입형 디지털 비주얼로 재해석한 콘텐츠",
    image: "/images/portfolio/suwon-hwaseong.png",
    tone: "sand",
    href: "https://www.youtube.com/@%EC%9C%A0%EB%8B%88%ED%8A%B8%EB%AF%B8%EB%94%94%EC%96%B4",
  },
  {
    title: "면천 두견주",
    description:
      "전통 명주 브랜드를\nAI 기반 브랜딩 콘텐츠로 재구성한 프로젝트",
    image: "/images/portfolio/dugyeonju.png",
    tone: "rose",
    href: "https://www.youtube.com/@%EC%9C%A0%EB%8B%88%ED%8A%B8%EB%AF%B8%EB%94%94%EC%96%B4",
  },
];

const archiveProjects = [
  {
    title: "도산서원",
    image: "/images/portfolio/dosan-seowon.png",
    href: "https://www.instagram.com/p/DXgUDQ1CjoK/",
  },
  {
    title: "옥산서원",
    image: "/images/portfolio/oksan-seowon.png",
    href: "https://www.instagram.com/p/DXgYMPFiiQe/",
  },
  {
    title: "운곡서원",
    image: "/images/portfolio/ungok-seowon.png",
    href: "https://www.instagram.com/p/DXgZg4cil-S/",
  },
];

const heritageGalleryImages = [
  {
    src: "/images/portfolio/heritage-archive/IMG_9079.png",
    alt: "문화유산 현장의 상징 조형물",
    objectPosition: "60% 52%",
  },
  {
    src: "/images/portfolio/heritage-archive/IMG_9195.png",
    alt: "전통 의례 제단과 하늘",
    objectPosition: "50% 58%",
  },
  {
    src: "/images/portfolio/heritage-archive/IMG_9222.png",
    alt: "제기를 들고 의례를 수행하는 인물",
    objectPosition: "46% 34%",
  },
  {
    src: "/images/portfolio/heritage-archive/IMG_9269z.png",
    alt: "붉은 의복을 입은 전통 의례 장면",
    objectPosition: "52% 42%",
  },
  {
    src: "/images/portfolio/heritage-archive/IMG_9324.png",
    alt: "의례 현장의 복식과 기물 디테일",
    objectPosition: "52% 44%",
  },
  {
    src: "/images/portfolio/heritage-archive/IMG_9357.png",
    alt: "문화유산 공간에서 펼쳐지는 악기 연주",
    objectPosition: "54% 46%",
  },
  {
    src: "/images/portfolio/heritage-archive/IMG_9420z.png",
    alt: "전통 제기를 든 의례 인물들",
    objectPosition: "50% 40%",
  },
  {
    src: "/images/portfolio/heritage-archive/IMG_9455z.png",
    alt: "의례 준비 과정의 상부 시점",
    objectPosition: "50% 42%",
  },
  {
    src: "/images/portfolio/heritage-archive/IMG_9478.png",
    alt: "깃발과 악기가 함께 담긴 의례 장면",
    objectPosition: "60% 45%",
  },
  {
    src: "/images/portfolio/heritage-archive/IMG_9495.png",
    alt: "의례 기물과 손동작의 클로즈업",
    objectPosition: "46% 42%",
  },
  {
    src: "/images/portfolio/heritage-archive/IMG_9581z.png",
    alt: "먹구름 아래 선 전통 복식 인물",
    objectPosition: "62% 34%",
  },
  {
    src: "/images/portfolio/heritage-archive/IMG_9610z.png",
    alt: "구름과 깃발로 담아낸 문화유산 풍경",
    objectPosition: "62% 38%",
  },
];

function PortfolioImage({ src, alt, className, eager = false, style }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      className={`${className}${loaded ? " is-loaded" : ""}`}
      loading={eager ? "eager" : "lazy"}
      style={style}
      onLoad={() => setLoaded(true)}
    />
  );
}

export default function PortfolioPage() {
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
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="portfolio-page">
      <div className="portfolio-main">
        <section className="portfolio-featured portfolio-main-shell portfolio-main-shell-featured" data-reveal>
          <article className="portfolio-feature-card">
            <div className="portfolio-feature-media">
              <PortfolioImage
                src={heroProject.image}
                alt={heroProject.title}
                className="portfolio-feature-image"
                eager
              />
              <div className="portfolio-feature-overlay" />
              <div className="portfolio-feature-content">
                <span className="portfolio-badge portfolio-badge-dark">
                  {heroProject.category}
                </span>
                <h2>{heroProject.title}</h2>
                <p>
                  {heroProject.description.split("\n").map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
                <a
                  className="button button-light portfolio-feature-button"
                  href="https://www.youtube.com/watch?v=gQbwE_CcKjU"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Project
                </a>
              </div>
            </div>
          </article>
        </section>

        <section
          className="portfolio-still-strip portfolio-main-shell portfolio-main-shell-featured"
          data-reveal
        >
          <div className="portfolio-still-track">
            <div className="portfolio-still-row">
              {heroStillPreview.map((src, index) => (
                <div key={`${src}-${index}`} className="portfolio-still-card">
                  <PortfolioImage
                    src={src}
                    alt={`김춘복 스틸 ${index + 1}`}
                    className="portfolio-still-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="portfolio-branding portfolio-main-shell"
          id="ai-branding-projects"
        >
          <div className="section-head portfolio-section-head centered narrow" data-reveal>
            <span className="section-pill">AI Branding / Campaign</span>
            <h2>브랜드와 도시의 서사를 시각 경험으로 확장한 프로젝트</h2>
            <p>
              각 프로젝트는 통일된 카드 시스템 안에서 다른 무드와 스토리텔링을
              보여주도록 구성해, 실제 AI 콘텐츠 스튜디오의 작품집처럼 보이게
              정리했습니다.
            </p>
          </div>

          <div className="portfolio-showcase-grid">
            {brandingProjects.map((project, index) => (
              <a
                key={project.title}
                className={`portfolio-showcase-card tone-${project.tone}`}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                data-reveal
                style={{ "--reveal-delay": `${index * 90}ms` }}
              >
                <div className="portfolio-showcase-media">
                  <PortfolioImage
                    src={project.image}
                    alt={project.title}
                    className="portfolio-showcase-image"
                  />
                  <div className="portfolio-showcase-overlay" />
                </div>
                <div className="portfolio-showcase-copy">
                  <h3>{project.title}</h3>
                  <p>
                    {project.description.split("\n").map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="portfolio-archive portfolio-main-shell">
          <div className="section-head centered narrow portfolio-section-head" data-reveal>
            <div>
              <span className="section-pill">HERITAGE DIGITAL ARCHIVE</span>
              <h2>
                한국의 유산을
                <br />
                AI 디지털 콘텐츠로 기록하다
              </h2>
            </div>
          </div>

          <div className="portfolio-archive-grid">
            {archiveProjects.map((project, index) => (
              <article
                key={project.title}
                className="portfolio-archive-card"
                data-reveal
                style={{ "--reveal-delay": `${index * 100}ms` }}
              >
                <div className="portfolio-archive-media">
                  <PortfolioImage
                    src={project.image}
                    alt={project.title}
                    className="portfolio-archive-image"
                  />
                  <div className="portfolio-archive-overlay" />
                  <div className="portfolio-archive-copy">
                    <span className="portfolio-badge">Heritage Film</span>
                    <h3>{project.title}</h3>
                    <a
                      className="portfolio-play-button"
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="portfolio-play-icon" aria-hidden="true" />
                      Play
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="portfolio-gallery portfolio-main-shell">
          <div className="section-head centered narrow portfolio-section-head" data-reveal>
            <div>
              <span className="section-pill">CULTURAL HERITAGE IMAGE LIBRARY</span>
              <h2>문화유산 사진데이터 8K+</h2>
              <p>
                전통 의례, 문화유산 현장, 인물, 사물, 질감까지
                <br />
                AI 콘텐츠 제작에 활용할 수 있는 고해상도 문화유산 이미지 데이터를 구축하고 있습니다.
              </p>
            </div>
          </div>

          <div className="portfolio-gallery-grid">
            {heritageGalleryImages.map((image, index) => (
              <article
                key={image.src}
                className="portfolio-gallery-card"
                data-reveal
                style={{ "--reveal-delay": `${index * 55}ms` }}
              >
                <div className="portfolio-gallery-media">
                  <PortfolioImage
                    src={image.src}
                    alt={image.alt}
                    className="portfolio-gallery-image"
                    style={{ objectPosition: image.objectPosition }}
                  />
                  <div className="portfolio-gallery-overlay" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
