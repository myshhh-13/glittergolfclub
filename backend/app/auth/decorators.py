from functools import wraps

from flask import current_app, jsonify, request


def admin_required(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        configured = current_app.config.get("ADMIN_TOKEN") or ""
        if not configured:
            return jsonify(error="Admin access is not configured"), 503

        header = request.headers.get("Authorization", "")
        token = header[7:].strip() if header.lower().startswith("bearer ") else ""

        if token != configured:
            return jsonify(error="Unauthorized"), 401

        return view(*args, **kwargs)

    return wrapper
