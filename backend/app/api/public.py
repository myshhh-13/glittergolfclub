from flask import Blueprint, current_app, jsonify, request

from ..content import ABOUT, COURSES, NEWS
from ..schemas import validate_request_payload
from ..services import email_service, ratelimit_service, requests_service


bp = Blueprint("public", __name__, url_prefix="/api")


@bp.get("/info")
def info():
    return jsonify(
        version=current_app.config["VERSION"],
        environment=current_app.config["ENVIRONMENT"],
    )


@bp.get("/courses")
def courses():
    return jsonify(items=COURSES)


@bp.get("/news")
def news():
    return jsonify(items=NEWS)


@bp.get("/about")
def about():
    return jsonify(ABOUT)


@bp.post("/requests")
def create_request():
    ip = request.remote_addr or "unknown"

    if ratelimit_service.is_blacklisted(ip):
        return jsonify(error="Your IP is blocked"), 403

    count = ratelimit_service.register_hit(ip)
    ignore_after = current_app.config["IGNORE_CLIENTS_AFTER"]
    blacklist_after = current_app.config["BLACKLIST_CLIENTS_AFTER"]

    if count > ignore_after:
        if count > blacklist_after:
            ratelimit_service.blacklist(ip)
            return jsonify(error="Your IP is blocked"), 403
        return jsonify(error="Too many requests, please slow down"), 429

    payload = request.get_json(silent=True) or request.form.to_dict() or {}
    cleaned, errors = validate_request_payload(payload)
    if errors:
        return jsonify(error="Validation failed", details=errors), 400

    created = requests_service.create_request(cleaned, ip=ip)

    try:
        email_service.send_request_notification(created)
    except Exception:
        current_app.logger.exception("Failed to send notification email")

    return jsonify(id=created["id"], status=created["status"]), 201
