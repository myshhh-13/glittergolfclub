import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/client.js";
import PageHero from "../components/PageHero.jsx";
import CtaStrip from "../components/CtaStrip.jsx";
import Icon from "../components/Icon.jsx";
import "../styles/home.css";

const NEWS_IMAGES = {
  launch: "/img/news-launch.jpg",
  bonus: "/img/news-bonus.jpg",
  "winter-cup": "/img/news-cup.jpg",
};

const STAT_ICONS = {
  Лунок: "flag",
  Уровень: "difficulty",
  Длина: "ruler",
};

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.courses().then((d) => setCourses(d.items || [])).catch(() => {});
    api.news().then((d) => setNews(d.items || [])).catch(() => {});
  }, []);

  return (
    <div className="page">
      <PageHero
        image="/img/hero.jpg"
        eyebrow="Гольф-клуб в часе от города"
        title={
          <>
            Три поля.
            <br /> Один идеальный вечер.
          </>
        }
        lead="Glitter — частный клуб с тремя полями разной сложности, тренерами и событиями. Запишитесь на партию или просто познакомьтесь с клубом."
        actions={[
          <Link key="cta" to="/contact" className="button">
            Оставить заявку
          </Link>,
          <a key="ghost" href="#courses" className="button button--ghost">
            Посмотреть поля
          </a>,
        ]}
      />

      <div className="container stats-pill-wrapper">
        <div className="stats-pill">
          <StatsItem icon="flag" value="3" label="поля разной сложности" />
          <StatsItem icon="ball-tee" value="9–18" label="лунок на круг" />
          <StatsItem icon="calendar" value="365" label="дней — клуб открыт" />
        </div>
      </div>

      <section id="courses" className="section section--tight">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">Наши поля</span>
            <h2>Каждое поле — своя интонация</h2>
            <p>
              Мы намеренно сделали поля разными: первое — учебное, второе — для серьёзной игры,
              третье — для отдыха у воды. Выбирайте под настроение или попробуйте все за день.
            </p>
          </div>

          <div className="courses-grid">
            {courses.map((course) => (
              <article key={course.id} className="course-card">
                <div className="course-card__media">
                  <img src={course.image} alt={course.title} loading="lazy" />
                </div>
                <div className="course-card__body">
                  <span className="course-card__subtitle">{course.subtitle}</span>
                  <h3>{course.title}</h3>
                  <p className="course-card__description">{course.description}</p>
                  <div className="course-card__stats">
                    {course.stats?.map((stat) => (
                      <div key={stat.label} className="course-stat">
                        <span className="course-stat__icon">
                          <Icon name={STAT_ICONS[stat.label] || "flag"} size={18} />
                        </span>
                        <div>
                          <div className="course-stat__value">{stat.value}</div>
                          <div className="course-stat__label">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {news.length > 0 && (
        <section className="section section--tight">
          <div className="container">
            <div className="section-heading section-heading--center">
              <span className="eyebrow">Свежее</span>
              <h2>Что происходит в клубе</h2>
              <p>Короткие анонсы — события, скидки и поводы заглянуть в клуб.</p>
            </div>

            <div className="news-teaser">
              {news.slice(0, 3).map((item) => (
                <article key={item.id} className="news-teaser__card">
                  <div className="news-teaser__media">
                    {NEWS_IMAGES[item.id] && <img src={NEWS_IMAGES[item.id]} alt={item.title} loading="lazy" />}
                    <span className="news-teaser__date">{formatDate(item.date)}</span>
                  </div>
                  <div className="news-teaser__body">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    <Link to="/news" className="news-teaser__more">
                      Читать далее <Icon name="arrow-right" size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--tight">
        <div className="container">
          <CtaStrip />
        </div>
      </section>
    </div>
  );
}

function StatsItem({ icon, value, label }) {
  return (
    <div className="stats-pill__item">
      <span className="stats-pill__icon">
        <Icon name={icon} size={26} />
      </span>
      <div>
        <div className="stats-pill__value">{value}</div>
        <div className="stats-pill__label">{label}</div>
      </div>
    </div>
  );
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}
