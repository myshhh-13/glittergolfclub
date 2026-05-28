import { useState } from "react";

import { api } from "../api/client.js";
import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import "../styles/contact.css";

const INITIAL = {
  first_name: "",
  last_name: "",
  org_name: "",
  email: "",
  message: "",
};

const CONTACTS = [
  { icon: "map-pin", label: "Адрес", value: "Московская область, посёлок Glitter, 1" },
  { icon: "clock", label: "Время работы", value: "ежедневно 7:00–22:00" },
  { icon: "phone", label: "Телефон", value: "+7 (495) 000-00-00" },
];

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState({ kind: "idle" });
  const [lastId, setLastId] = useState(null);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ kind: "loading" });
    try {
      const response = await api.submitRequest(form);
      setLastId(response.id);
      setStatus({ kind: "ok" });
      setForm(INITIAL);
    } catch (err) {
      const detail =
        Array.isArray(err.details) && err.details.length > 0 ? err.details.join(", ") : err.message;
      setStatus({ kind: "err", message: detail || "Что-то пошло не так. Попробуйте позже." });
    }
  };

  return (
    <div className="page">
      <PageHero
        image="/img/hero.jpg"
        eyebrow="Свяжитесь с нами"
        title={
          <>
            Напишите —<br /> и менеджер позвонит сам
          </>
        }
        lead="Оставьте заявку, и наш менеджер свяжется с вами, уточнит уровень игры и подберёт удобное время для визита в клуб."
      />

      <div className="container contact-layout">
        <div className="contact-card">
          {status.kind === "err" && (
            <div className="notice notice--err" style={{ marginBottom: 16 }}>
              <span>{status.message}</span>
            </div>
          )}
          <form className="contact-form" onSubmit={onSubmit}>
            <label>
              Имя
              <input
                name="first_name"
                value={form.first_name}
                onChange={onChange}
                placeholder="Введите имя"
                required
                maxLength={80}
              />
            </label>
            <label>
              Фамилия
              <input
                name="last_name"
                value={form.last_name}
                onChange={onChange}
                placeholder="Введите фамилию"
                required
                maxLength={80}
              />
            </label>
            <label className="contact-form__full">
              Организация (необязательно)
              <input
                name="org_name"
                value={form.org_name}
                onChange={onChange}
                placeholder="Введите название организации"
                maxLength={120}
              />
            </label>
            <label className="contact-form__full">
              Электронная почта
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="Введите email"
                required
                maxLength={200}
              />
            </label>
            <label className="contact-form__full">
              Ваши пожелания
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Расскажите, что важно учесть"
                required
                maxLength={4000}
              />
            </label>
            <div className="contact-form__submit">
              <button type="submit" className="button" disabled={status.kind === "loading"}>
                {status.kind === "loading" ? "Отправляем…" : "Отправить"}
              </button>
            </div>
          </form>
        </div>

        <div className="contact-card">
          <h2>Контакты клуба</h2>
          <div className="contacts-list">
            {CONTACTS.map((c) => (
              <div key={c.label} className="contacts-list__row">
                <span className="contacts-list__icon">
                  <Icon name={c.icon} size={22} />
                </span>
                <div>
                  <div className="contacts-list__label">{c.label}</div>
                  <div className="contacts-list__value">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="contacts-card__photo">
            <img src="/img/clubhouse.jpg" alt="Клубный дом" loading="lazy" />
          </div>
        </div>
      </div>

      {status.kind === "ok" && (
        <div className="container contact-success">
          <div className="contact-success__inner">
            <span className="contact-success__icon">
              <Icon name="check" size={28} strokeWidth={2} />
            </span>
            <div className="contact-success__text">
              <strong>Заявка №{lastId} принята,</strong>
              <span>менеджер свяжется с вами в течение рабочего дня.</span>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="contact-photo">
          <img src="/img/hero.jpg" alt="Поле клуба Glitter" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
