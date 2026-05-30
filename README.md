# Glitter Golf Club

Дипломная работа Осиповой Полины Сергеевны — сайт частного гольф-клуба с админ-панелью для обработки заявок.

Проект состоит из двух независимо собираемых частей:

- `backend/` — Flask JSON API (Python 3.12), Redis для хранения заявок и rate-limit.
- `frontend/` — React + Vite + React Router, продакшн-сборка раздаётся через nginx.
- `docker-compose.yml` поднимает оба сервиса вместе с Redis.

## Архитектура

```
┌──────────┐    /api/*    ┌──────────┐    HSET/ZADD   ┌──────────┐
│ frontend │ ───────────► │ backend  │ ─────────────► │  redis   │
│ (nginx + │              │ (Flask + │                │          │
│ React)   │              │ gunicorn)│                │          │
└──────────┘              └──────────┘                └──────────┘
   :8080                     :5000                       :6379
```

В контейнерной сборке nginx сам проксирует `/api/*` в backend, поэтому фронт ходит на тот же origin, что и страницы — никаких CORS-проблем.

### Структура

```
backend/
  app/
    __init__.py        # фабрика, CORS, error handlers
    config.py          # загрузка env-переменных
    extensions.py      # singleton redis client
    content.py         # статический контент (поля, новости, about)
    schemas.py         # валидация payload'ов
    api/
      public.py        # /api/info, /api/courses, /api/news, /api/about, POST /api/requests
      admin.py         # /api/admin/* (требуется Authorization: Bearer)
    auth/
      decorators.py    # admin_required
    services/
      requests_service.py
      ratelimit_service.py
      email_service.py
  wsgi.py
  requirements.txt
  Dockerfile

frontend/
  src/
    api/client.js
    components/        # Header, Footer, Layout
    pages/             # Home, News, About, Contact, AdminLogin, Admin, 404
    styles/            # tokens + per-page CSS
  public/img/          # фотографии полей и иконка
  nginx.conf
  Dockerfile

docker-compose.yml
```

## Как запустить

### Вариант 1 — Docker Compose (рекомендуемый)

1. Скопируйте конфиг и задайте свой `ADMIN_TOKEN`:
   ```powershell
   Copy-Item .env.example backend/.env
   notepad backend/.env
   ```
2. Соберите и запустите:
   ```powershell
   docker compose up --build
   ```
3. Откройте сайт: <http://localhost:8080>
4. Админка: <http://localhost:8080/admin/login> — вставьте `ADMIN_TOKEN` из `.env`.

Остановить: `docker compose down`. Данные Redis сохраняются в томе `redis-data`.

### Вариант 2 — Локальный dev (без Docker)

Понадобятся Python 3.12, Node 20 и запущенный Redis (например `docker run -p 6379:6379 redis`).

**Backend:**
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# поменяйте REDIS_HOST на 127.0.0.1 и задайте ADMIN_TOKEN
python wsgi.py
```
Бэк слушает <http://localhost:5000>.

**Frontend (в отдельном терминале):**
```powershell
cd frontend
npm install
npm run dev
```
Vite поднимется на <http://localhost:5173> и будет проксировать `/api/*` в `localhost:5000` (см. [vite.config.js](frontend/vite.config.js)).

## API

### Публичные

| Метод | Путь | Что делает |
| --- | --- | --- |
| GET | `/api/info` | версия и окружение |
| GET | `/api/courses` | список полей |
| GET | `/api/news` | новости клуба |
| GET | `/api/about` | блок «О клубе» |
| POST | `/api/requests` | приём заявки (rate-limited по IP) |

### Админские (требуют `Authorization: Bearer <ADMIN_TOKEN>`)

| Метод | Путь | Что делает |
| --- | --- | --- |
| GET | `/api/admin/session` | проверка токена |
| GET | `/api/admin/stats` | счётчики заявок и размер блок-листа |
| GET | `/api/admin/requests?status=new` | список заявок |
| GET | `/api/admin/requests/{id}` | одна заявка |
| PATCH | `/api/admin/requests/{id}` | сменить статус (`new`/`in_progress`/`done`/`rejected`) и заметку |
| DELETE | `/api/admin/requests/{id}` | удалить |
| GET | `/api/admin/blacklist` | список IP в бане |
| POST | `/api/admin/blacklist` | добавить IP (`{"ip":"1.2.3.4"}`) |
| DELETE | `/api/admin/blacklist/{ip}` | убрать IP |

## Хранение в Redis

- `request:next_id` — счётчик ID заявок.
- `request:{id}` — хэш с полями заявки.
- `requests:index` — sorted set, score = unix-таймстамп `created_at`.
- `rl:{ip}` — счётчик rate-limit с TTL.
- `blacklist` — set IP-адресов под запретом.

## Email-уведомления

По умолчанию `MAIL_ENABLED=false` — заявки только сохраняются. Чтобы получать письма, задайте SMTP-настройки и поднимите `MAIL_ENABLED=true`. См. [backend/app/services/email_service.py](backend/app/services/email_service.py).
