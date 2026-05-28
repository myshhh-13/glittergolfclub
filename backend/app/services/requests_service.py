from datetime import datetime, timezone
from typing import Any

from ..extensions import get_redis


_COUNTER_KEY = "request:next_id"
_INDEX_KEY = "requests:index"


def _request_key(request_id: int | str) -> str:
    return f"request:{request_id}"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def create_request(data: dict[str, str], ip: str) -> dict[str, Any]:
    redis = get_redis()
    request_id = int(redis.incr(_COUNTER_KEY))
    created_at = _now_iso()

    record = {
        "id": str(request_id),
        "first_name": data["first_name"],
        "last_name": data["last_name"],
        "org_name": data["org_name"],
        "email": data["email"],
        "message": data["message"],
        "ip": ip,
        "status": "new",
        "note": "",
        "created_at": created_at,
        "updated_at": created_at,
    }

    pipe = redis.pipeline()
    pipe.hset(_request_key(request_id), mapping=record)
    pipe.zadd(_INDEX_KEY, {str(request_id): _zscore(created_at)})
    pipe.execute()

    return _to_public(record)


def get_request(request_id: int | str) -> dict[str, Any] | None:
    record = get_redis().hgetall(_request_key(request_id))
    if not record:
        return None
    return _to_public(record)


def list_requests(status: str | None = None, limit: int = 100) -> list[dict[str, Any]]:
    redis = get_redis()
    ids = redis.zrevrange(_INDEX_KEY, 0, max(limit, 1) - 1)
    if not ids:
        return []

    pipe = redis.pipeline()
    for rid in ids:
        pipe.hgetall(_request_key(rid))
    rows = pipe.execute()

    result: list[dict[str, Any]] = []
    for row in rows:
        if not row:
            continue
        if status and row.get("status") != status:
            continue
        result.append(_to_public(row))
    return result


def update_request(request_id: int | str, *, status: str | None = None, note: str | None = None) -> dict[str, Any] | None:
    redis = get_redis()
    key = _request_key(request_id)
    if not redis.exists(key):
        return None

    updates: dict[str, str] = {"updated_at": _now_iso()}
    if status is not None:
        updates["status"] = status
    if note is not None:
        updates["note"] = note

    redis.hset(key, mapping=updates)
    return get_request(request_id)


def delete_request(request_id: int | str) -> bool:
    redis = get_redis()
    pipe = redis.pipeline()
    pipe.delete(_request_key(request_id))
    pipe.zrem(_INDEX_KEY, str(request_id))
    removed, _ = pipe.execute()
    return bool(removed)


def stats() -> dict[str, int]:
    counters: dict[str, int] = {"total": 0, "new": 0, "in_progress": 0, "done": 0, "rejected": 0}
    redis = get_redis()
    ids = redis.zrange(_INDEX_KEY, 0, -1)
    if not ids:
        return counters

    pipe = redis.pipeline()
    for rid in ids:
        pipe.hget(_request_key(rid), "status")
    statuses = pipe.execute()

    for s in statuses:
        if s is None:
            continue
        counters["total"] += 1
        if s in counters:
            counters[s] += 1
    return counters


def _to_public(record: dict[str, str]) -> dict[str, Any]:
    return {
        "id": int(record.get("id", 0)),
        "first_name": record.get("first_name", ""),
        "last_name": record.get("last_name", ""),
        "org_name": record.get("org_name", ""),
        "email": record.get("email", ""),
        "message": record.get("message", ""),
        "ip": record.get("ip", ""),
        "status": record.get("status", "new"),
        "note": record.get("note", ""),
        "created_at": record.get("created_at", ""),
        "updated_at": record.get("updated_at", ""),
    }


def _zscore(iso_timestamp: str) -> float:
    return datetime.fromisoformat(iso_timestamp).timestamp()
