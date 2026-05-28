from typing import Any


_REQUEST_STATUSES = ("new", "in_progress", "done", "rejected")


def validate_request_payload(payload: dict[str, Any] | None) -> tuple[dict[str, str], list[str]]:
    if not isinstance(payload, dict):
        return {}, ["Body must be an object"]

    errors: list[str] = []
    cleaned: dict[str, str] = {}

    for field in ("first_name", "last_name", "email", "message"):
        value = (payload.get(field) or "").strip()
        if not value:
            errors.append(f"{field} is required")
        cleaned[field] = value

    cleaned["org_name"] = (payload.get("org_name") or "").strip() or "Natural person"

    email = cleaned.get("email", "")
    if email and ("@" not in email or "." not in email.split("@")[-1]):
        errors.append("email looks invalid")

    for field, limit in (("first_name", 80), ("last_name", 80), ("org_name", 120), ("email", 200), ("message", 4000)):
        if len(cleaned.get(field, "")) > limit:
            errors.append(f"{field} exceeds {limit} characters")

    return cleaned, errors


def validate_status(value: str | None) -> str | None:
    if value is None:
        return None
    if value not in _REQUEST_STATUSES:
        return None
    return value


def known_statuses() -> tuple[str, ...]:
    return _REQUEST_STATUSES
