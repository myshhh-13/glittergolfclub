export default function PageHero({ image, eyebrow, title, lead, actions, align = "left", tone = "light" }) {
  return (
    <section className={`page-hero page-hero--${align} page-hero--${tone}`}>
      <div
        className="page-hero__bg"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
        aria-hidden="true"
      />
      <div className="page-hero__overlay" aria-hidden="true" />
      <div className="container page-hero__inner">
        <div className="page-hero__copy">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {lead && <p className="page-hero__lead">{lead}</p>}
          {actions && actions.length > 0 && (
            <div className="page-hero__actions">{actions}</div>
          )}
        </div>
      </div>
    </section>
  );
}
