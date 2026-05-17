export default function PageHero({
  eyebrow,
  title,
  description,
  actions,
  visual = null,
  headerContent = null,
  descriptionClassName = "",
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-copy">
        <span className="section-pill">{eyebrow}</span>
        {headerContent ? headerContent : <h1>{title}</h1>}
        <p className={`hero-text ${descriptionClassName}`.trim()}>{description}</p>
        {actions ? <div className="hero-actions">{actions}</div> : null}
      </div>
      <div className="page-hero-visual">{visual}</div>
    </section>
  );
}
