import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { api, getAdminToken, setAdminToken } from "../api/client.js";
import "../styles/admin.css";

const STATUSES = [
  { value: "", label: "Все" },
  { value: "new", label: "Новые" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Готово" },
  { value: "rejected", label: "Отклонены" },
];

const STATUS_LABELS = {
  new: "Новая",
  in_progress: "В работе",
  done: "Готово",
  rejected: "Отклонена",
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("");
  const [openId, setOpenId] = useState(null);
  const [blacklist, setBlacklist] = useState([]);
  const [newIp, setNewIp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (statusFilter = filter) => {
    setLoading(true);
    try {
      const [reqs, st, bl] = await Promise.all([
        api.admin.listRequests(statusFilter || undefined),
        api.admin.stats(),
        api.admin.listBlacklist(),
      ]);
      setRequests(reqs.items || []);
      setStats(st);
      setBlacklist(bl.items || []);
      setError(null);
    } catch (err) {
      if (err.status === 401) {
        setAdminToken("");
        navigate("/admin/login");
        return;
      }
      setError(err.message || "Не удалось загрузить");
    } finally {
      setLoading(false);
    }
  }, [filter, navigate]);

  useEffect(() => {
    if (!getAdminToken()) return;
    refresh(filter);
  }, [filter, refresh]);

  if (!getAdminToken()) return <Navigate to="/admin/login" replace />;

  const onLogout = () => {
    setAdminToken("");
    navigate("/admin/login");
  };

  const onPatch = async (id, payload) => {
    try {
      await api.admin.updateRequest(id, payload);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const onDelete = async (id) => {
    if (!confirm(`Удалить заявку №${id}?`)) return;
    try {
      await api.admin.deleteRequest(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const onBlacklistIp = async (ip) => {
    try {
      await api.admin.addBlacklist(ip);
      setNewIp("");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const onUnblacklist = async (ip) => {
    try {
      await api.admin.removeBlacklist(ip);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <section className="section admin-shell">
        <div className="container">
          <div className="admin-top">
            <div>
              <span className="eyebrow">Админка</span>
              <h1>Заявки и блок-лист</h1>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="button button--ghost" onClick={() => refresh()} disabled={loading}>
                {loading ? "Обновляем…" : "Обновить"}
              </button>
              <button className="button" onClick={onLogout}>
                Выйти
              </button>
            </div>
          </div>

          {error && <div className="notice notice--err" style={{ marginBottom: 16 }}>{error}</div>}

          <StatsRow stats={stats} blacklistSize={blacklist.length} />

          <div className="admin-filters">
            {STATUSES.map((option) => (
              <button
                key={option.value || "all"}
                className={filter === option.value ? "is-active" : undefined}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {requests.length === 0 ? (
            <div className="admin-empty">
              {loading ? "Загружаем…" : "Заявок не найдено в выбранной категории"}
            </div>
          ) : (
            <div className="admin-table">
              {requests.map((row) => (
                <RequestRow
                  key={row.id}
                  row={row}
                  isOpen={openId === row.id}
                  onToggle={() => setOpenId(openId === row.id ? null : row.id)}
                  onPatch={(payload) => onPatch(row.id, payload)}
                  onDelete={() => onDelete(row.id)}
                  onBlacklist={() => onBlacklistIp(row.ip)}
                />
              ))}
            </div>
          )}

          <Blacklist
            items={blacklist}
            newIp={newIp}
            onNewIpChange={setNewIp}
            onAdd={() => newIp.trim() && onBlacklistIp(newIp.trim())}
            onRemove={onUnblacklist}
          />
        </div>
      </section>
    </div>
  );
}

function StatsRow({ stats, blacklistSize }) {
  const items = useMemo(() => {
    const counts = stats?.counts || {};
    return [
      { label: "Всего", value: counts.total ?? 0 },
      { label: "Новые", value: counts.new ?? 0 },
      { label: "В работе", value: counts.in_progress ?? 0 },
      { label: "Готово", value: counts.done ?? 0 },
      { label: "В блок-листе", value: blacklistSize },
    ];
  }, [stats, blacklistSize]);

  return (
    <div className="admin-stats">
      {items.map((it) => (
        <div key={it.label} className="admin-stat">
          <strong>{it.value}</strong>
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function RequestRow({ row, isOpen, onToggle, onPatch, onDelete, onBlacklist }) {
  const [status, setStatus] = useState(row.status);
  const [note, setNote] = useState(row.note || "");

  useEffect(() => {
    setStatus(row.status);
    setNote(row.note || "");
  }, [row.status, row.note]);

  const dirty = status !== row.status || (note || "") !== (row.note || "");

  return (
    <article className="admin-row" data-open={isOpen}>
      <div className="admin-row__id" onClick={onToggle} style={{ cursor: "pointer" }}>
        №{row.id}
      </div>
      <div className="admin-row__primary" onClick={onToggle} style={{ cursor: "pointer" }}>
        <strong>
          {row.first_name} {row.last_name}
        </strong>
        <span>{row.org_name || "—"}</span>
      </div>
      <div className="admin-row__contact">
        <a href={`mailto:${row.email}`}>{row.email}</a>
        <span title="IP">{row.ip}</span>
      </div>
      <div className="admin-row__date">{formatDateTime(row.created_at)}</div>
      <div>
        <span className="status-badge" data-status={row.status}>
          {STATUS_LABELS[row.status] || row.status}
        </span>
      </div>
      <div className="admin-row__actions">
        <button className="icon-button" type="button" onClick={onToggle} title={isOpen ? "Свернуть" : "Открыть"}>
          {isOpen ? "−" : "+"}
        </button>
        <button className="icon-button icon-button--danger" type="button" onClick={onDelete} title="Удалить">
          ×
        </button>
      </div>

      {isOpen && (
        <div className="admin-row__details">
          <div className="admin-row__message">
            <strong style={{ display: "block", marginBottom: 8, color: "var(--c-forest-deep)" }}>Сообщение</strong>
            {row.message || <em style={{ color: "var(--c-muted)" }}>— пусто —</em>}
          </div>
          <div className="admin-row__editor">
            <label>
              Статус
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="new">Новая</option>
                <option value="in_progress">В работе</option>
                <option value="done">Готово</option>
                <option value="rejected">Отклонена</option>
              </select>
            </label>
            <label>
              Заметка
              <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} />
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                className="button"
                disabled={!dirty}
                onClick={() => onPatch({ status, note })}
              >
                Сохранить
              </button>
              <button type="button" className="button button--ghost" onClick={onBlacklist}>
                Заблокировать IP
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function Blacklist({ items, newIp, onNewIpChange, onAdd, onRemove }) {
  return (
    <div className="admin-blacklist">
      <div className="admin-blacklist__head">
        <div>
          <span className="eyebrow">Блок-лист</span>
          <h3 style={{ marginTop: 8 }}>IP-адреса под запретом</h3>
        </div>
        <div className="admin-blacklist__form">
          <input
            type="text"
            value={newIp}
            onChange={(e) => onNewIpChange(e.target.value)}
            placeholder="например, 1.2.3.4"
          />
          <button type="button" className="button" onClick={onAdd}>
            Добавить
          </button>
        </div>
      </div>
      {items.length === 0 ? (
        <p style={{ color: "var(--c-muted)" }}>Пока пусто — никто никого не банил.</p>
      ) : (
        <ul>
          {items.map((ip) => (
            <li key={ip}>
              <span>{ip}</span>
              <button className="icon-button icon-button--danger" type="button" onClick={() => onRemove(ip)} title="Убрать">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
