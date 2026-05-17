import { portfolioCards } from "../content";

export default function PortfolioCards() {
  return (
    <section className="portfolio-section">
      <div className="portfolio-grid">
        {portfolioCards.map((card) => (
          <article key={card.kicker} className="portfolio-card">
            <div className="portfolio-copy">
              <span className="portfolio-kicker">{card.kicker}</span>
              <h3 dangerouslySetInnerHTML={{ __html: card.title }}></h3>
              <p>{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
