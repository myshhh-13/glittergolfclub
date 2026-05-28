import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

_BACKEND_ROOT = Path(__file__).resolve().parent.parent
_VERSION_FILE = _BACKEND_ROOT.parent / "VERSION"


def _read_version() -> str:
    try:
        return _VERSION_FILE.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        return "0.0.0"


def _env_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    if raw is None or raw == "":
        return default
    try:
        return int(raw)
    except ValueError:
        return default


class Config:
    ENVIRONMENT = os.getenv("ENVIRONMENT", "dev")
    VERSION = _read_version()

    CORS_ORIGIN = os.getenv("CORS_ORIGIN", "*")

    IGNORE_CLIENTS_AFTER = _env_int("IGNORE_CLIENTS_AFTER", 5)
    BLACKLIST_CLIENTS_AFTER = _env_int("BLACKLIST_CLIENTS_AFTER", 20)
    FORGIVE_CLIENTS_AFTER = _env_int("FORGIVE_CLIENTS_AFTER", 3600)

    REDIS_HOST = os.getenv("REDIS_HOST", os.getenv("REDIS_IP", "redis"))
    REDIS_PORT = _env_int("REDIS_PORT", 6379)
    REDIS_DB = _env_int("REDIS_DB", 0)
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD") or None

    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = _env_int("SMTP_PORT", 465)
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    MAIL_FROM = os.getenv("MAIL_FROM")
    MAIL_TO = os.getenv("MAIL_TO")
    MAIL_ENABLED = os.getenv("MAIL_ENABLED", "false").lower() in ("1", "true", "yes")

    ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")
