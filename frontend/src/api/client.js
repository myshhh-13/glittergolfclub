const BASE = (import.meta.env.VITE_API_BASE || "/api").replace(/\/+$/, "");

const TOKEN_KEY = "ggc_admin_token";

export function getAdminToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setAdminToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

async function request(path, { method = "GET", body, admin = false } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (admin) {
    const token = getAdminToken();
    if (!token) {
      const err = new Error("Missing admin token");
      err.status = 401;
      throw err;
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const err = new Error((data && data.error) || `Request failed: ${response.status}`);
    err.status = response.status;
    err.details = data && data.details;
    throw err;
  }
  return data;
}

export const api = {
  info: () => request("/info"),
  courses: () => request("/courses"),
  news: () => request("/news"),
  about: () => request("/about"),
  submitRequest: (payload) => request("/requests", { method: "POST", body: payload }),

  admin: {
    ping: () => request("/admin/session", { admin: true }),
    stats: () => request("/admin/stats", { admin: true }),
    listRequests: (status) => {
      const qs = status ? `?status=${encodeURIComponent(status)}` : "";
      return request(`/admin/requests${qs}`, { admin: true });
    },
    updateRequest: (id, payload) =>
      request(`/admin/requests/${id}`, { method: "PATCH", body: payload, admin: true }),
    deleteRequest: (id) => request(`/admin/requests/${id}`, { method: "DELETE", admin: true }),
    listBlacklist: () => request("/admin/blacklist", { admin: true }),
    addBlacklist: (ip) => request("/admin/blacklist", { method: "POST", body: { ip }, admin: true }),
    removeBlacklist: (ip) => request(`/admin/blacklist/${encodeURIComponent(ip)}`, { method: "DELETE", admin: true }),
  },
};
