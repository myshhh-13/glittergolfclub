import { NavLink, Link } from "react-router-dom";

import Brand from "./Brand.jsx";

const NAV = [
  { to: "/", label: "Главная", end: true },
  { to: "/news", label: "Что нового" },
  { to: "/about", label: "О клубе" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" aria-label="Glitter Golf Club home" style={{ display: "inline-flex" }}>
          <Brand withText />
        </Link>
        <nav className="site-nav" aria-label="Главное меню">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                "site-nav__link" + (isActive ? " is-active" : "")
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/contact" className="site-nav__cta">
            Записаться
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
