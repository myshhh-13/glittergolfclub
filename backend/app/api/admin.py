from flask import Blueprint, jsonify, request

from ..auth.decorators import admin_required
from ..schemas import known_statuses, validate_status
from ..services import ratelimit_service, requests_service


bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@bp.get("/session")
@admin_required
def session():
    return jsonify(ok=True)


@bp.get("/stats")
@admin_required
def stats():
    return jsonify(
        statuses=known_statuses(),
        counts=requests_service.stats(),
        blacklist_size=len(ratelimit_service.list_blacklist()),
    )


@bp.get("/requests")
@admin_required
def list_requests():
    status_filter = validate_status(request.args.get("status"))
    raw_limit = request.args.get("limit", "200")
    try:
        limit = max(1, min(int(raw_limit), 1000))
    except ValueError:
        limit = 200

    items = requests_service.list_requests(status=status_filter, limit=limit)
    return jsonify(items=items)


@bp.get("/requests/<int:request_id>")
@admin_required
def get_request(request_id: int):
    item = requests_service.get_request(request_id)
    if item is None:
        return jsonify(error="Not found"), 404
    return jsonify(item)


@bp.patch("/requests/<int:request_id>")
@admin_required
def update_request(request_id: int):
    payload = request.get_json(silent=True) or {}

    status = None
    if "status" in payload:
        status = validate_status(payload.get("status"))
        if status is None:
            return jsonify(error="Invalid status", allowed=list(known_statuses())), 400

    note = payload.get("note")
    if note is not None and not isinstance(note, str):
        return jsonify(error="note must be a string"), 400
    if isinstance(note, str):
        note = note.strip()[:2000]

    updated = requests_service.update_request(request_id, status=status, note=note)
    if updated is None:
        return jsonify(error="Not found"), 404
    return jsonify(updated)


@bp.delete("/requests/<int:request_id>")
@admin_required
def delete_request(request_id: int):
    if not requests_service.delete_request(request_id):
        return jsonify(error="Not found"), 404
    return jsonify(ok=True)


@bp.get("/blacklist")
@admin_required
def list_blacklist():
    return jsonify(items=ratelimit_service.list_blacklist())


@bp.post("/blacklist")
@admin_required
def add_to_blacklist():
    payload = request.get_json(silent=True) or {}
    ip = (payload.get("ip") or "").strip()
    if not ip:
        return jsonify(error="ip is required"), 400
    added = ratelimit_service.blacklist(ip)
    return jsonify(ip=ip, added=added)


@bp.delete("/blacklist/<path:ip>")
@admin_required
def remove_from_blacklist(ip: str):
    removed = ratelimit_service.unblacklist(ip)
    if not removed:
        return jsonify(error="Not found"), 404
    return jsonify(ok=True)
