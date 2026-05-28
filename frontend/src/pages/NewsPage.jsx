import { useEffect, useState } from "react";

import { api } from "../api/client.js";
import PageHero from "../components/PageHero.jsx";
import CtaStrip from "../components/CtaStrip.jsx";
import Icon from "../components/Icon.jsx";
import "../styles/news.css";

const NEWS_IMAGES = {
  launch: "/img/news-launch.jpg",
  bonus: "/img/news-bonus.jpg",
  "winter-cup": "/img/news-cup.jpg",
};

export default function NewsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .news()
      .then((d) => setItems(d.items || []))
      .catch((e) => setError(e.message || "Не удалось загрузить"));
  }, []);

  return (
    <div className="page">
      <PageHero
        image="/img/hero.jpg"
        eyebrow="Что нового"
        title={
          <>
            Что нового
            <br /> в клубе
          </>
        }
        lead="Здесь мы делимся последними новостями и анонсами клуба. После вашей заявки менеджер свяжется с вами и поможет с любыми вопросами."
      />

      <section className="section section--tight">
        <div className="container">
          {error && <div className="notice notice--err"><span>{error}</span></div>}

          <div className="news-list">
            {items.map((item) => (
              <article key={item.id} className="news-row">
                <div className="news-row__media">
                  {NEWS_IMAGES[item.id] && <img src={NEWS_IMAGES[item.id]} alt={item.title} loading="lazy" />}
                </div>
                <div className="news-row__body">
                  <span className="news-row__date">
                    <Icon name="calendar" size={18} />
                    {item.date}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <CtaStrip />
        </div>
      </section>
    </div>
  );
}
