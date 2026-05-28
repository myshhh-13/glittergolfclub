import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { api, getAdminToken, setAdminToken } from "../api/client.js";
import "../styles/admin.css";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState(getAdminToken());
  const [status, setStatus] = useState({ kind: "idle" });

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!token.trim()) {
      setStatus({ kind: "err", message: "Введите токен" });
      return;
    }
    setStatus({ kind: "loading" });
    setAdminToken(token.trim());
    try {
      await api.admin.ping();
      navigate("/admin");
    } catch (err) {
      setAdminToken("");
      setStatus({
        kind: "err",
        message: err.status === 401 ? "Неверный токен" : err.message || "Ошибка соединения",
      });
    }
  };

  return (
    <div className="page">
      <section className="section admin-shell">
        <div className="container">
          <div className="admin-login">
            <span className="eyebrow">Админка</span>
            <h2 style={{ marginTop: 16 }}>Вход для менеджера</h2>
            <p>Введите токен доступа. Значение хранится в браузере, передаётся в заголовке Authorization.</p>
            {status.kind === "err" && <div className="notice notice--err" style={{ marginBottom: 12 }}>{status.message}</div>}
            <form onSubmit={onSubmit}>
              <label>
                Токен
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Bearer токен"
                />
              </label>
              <button type="submit" className="button" disabled={status.kind === "loading"}>
                {status.kind === "loading" ? "Проверяем…" : "Войти"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
