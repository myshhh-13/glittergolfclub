import { Link } from "react-router-dom";

export default function CtaStrip({
  image = "/img/cta-sunset.jpg",
  title = "Хочется попробовать?",
  text = "Оставьте заявку — наш менеджер перезвонит и поможет выбрать удобное время.",
  buttonLabel = "Оставить заявку",
  to = "/contact",
}) {
  return (
    <section className="cta-strip" style={{ backgroundImage: `url(${image})` }}>
      <div className="cta-strip__overlay" aria-hidden="true" />
      <div className="container cta-strip__inner">
        <div className="cta-strip__copy">
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <Link to={to} className="button button--cream">
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
