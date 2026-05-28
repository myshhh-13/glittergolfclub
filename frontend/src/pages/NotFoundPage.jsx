import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page">
      <section className="section">
        <div className="container" style={{ textAlign: "center", padding: "80px 0" }}>
          <span className="eyebrow">404</span>
          <h1 style={{ fontSize: "clamp(48px, 8vw, 110px)", margin: "16px 0" }}>Не нашли</h1>
          <p style={{ color: "var(--c-muted)", marginBottom: 28 }}>
            Похоже, такой страницы у нас нет. Вернёмся на главную?
          </p>
          <Link to="/" className="button">
            На главную
          </Link>
        </div>
      </section>
    </div>
  );
}
