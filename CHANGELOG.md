## [2.0.0] – 2026-05-28
### Changed
- Project split into `backend/` (Flask JSON API) and `frontend/` (React + Vite).
- Backend refactored into blueprints + service layer (`requests`, `ratelimit`, `email`).

### Added
- React SPA: home, news, about, contact form with submission states.
- Admin panel at `/admin` with bearer-token auth, status updates, notes, IP blacklist management.
- Persistent storage of contact requests in Redis (counter + sorted index + hashes).
- `docker-compose.yml` wiring redis + backend (gunicorn) + frontend (nginx).
- `/api/info`, `/api/courses`, `/api/news`, `/api/about` content endpoints.

### Removed
- Jinja templates and Flask-served static assets.

## [1.0.0] – 2025-12-01
### Added
- First version.
