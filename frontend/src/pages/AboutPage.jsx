import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/client.js";
import Icon from "../components/Icon.jsx";
import "../styles/about.css";

const HIGHLIGHT_META = {
  "3 поля": { icon: "flag", image: "/img/feature-fields.jpg" },
  "Тренеры": { icon: "ball-tee", image: "/img/feature-coach.jpg" },
  "События": { icon: "calendar", image: "/img/feature-events.jpg" },
};

export default function AboutPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.about().then(setData).catch(() => setData(null));
  }, []);

  if (!data) {
    return (
      <div className="page">
        <div className="container" style={{ padding: "80px 0" }}>Загружаем…</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container about-top">
        <div className="about-top__copy">
          <span className="eyebrow">О клубе</span>
          <h1>{data.headline}</h1>
          {data.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}

          <div className="about-prompt">
            <span className="about-prompt__icon">
              <Icon name="user" size={22} />
            </span>
            <p>Не уверены, с чего начать? Менеджер подскажет подходящее поле и удобное время.</p>
          </div>

          <Link to="/contact" className="button about-top__cta">
            Связаться с менеджером
          </Link>
        </div>
        <div className="about-top__media">
          <img src="/img/clubhouse.jpg" alt="Клубный дом Glitter Golf Club" />
        </div>
      </div>

      <div className="container">
        <div className="feature-grid">
          {data.highlights.map((h) => {
            const meta = HIGHLIGHT_META[h.title] || { icon: "flag", image: "" };
            return (
              <div key={h.title} className="feature-tile">
                <div className="feature-tile__top">
                  <span className="feature-tile__icon">
                    <Icon name={meta.icon} size={26} />
                  </span>
                  <div>
                    <h3>{h.title}</h3>
                    <p className="feature-tile__sub">{h.description}</p>
                  </div>
                </div>
                {meta.image && (
                  <div className="feature-tile__media">
                    <img src={meta.image} alt={h.title} loading="lazy" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <section className="about-finale" style={{ backgroundImage: "url(/img/cta-sunset.jpg)" }}>
        <div className="about-finale__overlay" aria-hidden="true" />
        <div className="container about-finale__inner">
          <h2>
            Мини-клуб <br />больших впечатлений
          </h2>
          <p>
            Уединённая территория в часе от города, продуманная инфраструктура и внимательное
            сообщество. Glitter — место, где хочется играть, развиваться и возвращаться.
          </p>
        </div>
      </section>
    </div>
  );
}
