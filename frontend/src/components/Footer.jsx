import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { api } from "../api/client.js";
import Brand from "./Brand.jsx";

const NAV = [
  { to: "/", label: "Главная", end: true },
  { to: "/news", label: "Что нового" },
  { to: "/about", label: "О клубе" },
];

export default function Footer() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    api.info().then(setInfo).catch(() => setInfo(null));
  }, []);

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <Link to="/" className="site-footer__brand" aria-label="Glitter Golf Club">
          <Brand color="var(--c-gold)" textColor="var(--c-cream)" size={36} />
        </Link>
        <nav className="site-footer__nav" aria-label="Подвал">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="site-footer__center">
          <span>
            Copyright Glitter Golf Club, {new Date().getFullYear()} ·{" "}
            <Link to="/admin/login">Админка</Link>
          </span>
          <small>Учебный проект выполнен Осиповой Полиной Сергеевной</small>
        </div>
        <div className="site-footer__version">
          {info ? (
            <>
              <span>v{info.version}</span>
              <span>{info.environment}</span>
            </>
          ) : (
            <span>загрузка…</span>
          )}
        </div>
      </div>
    </footer>
  );
}
