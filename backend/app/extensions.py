from flask import Flask, current_app
import redis


_redis_client: redis.Redis | None = None


def init_redis(app: Flask) -> None:
    global _redis_client
    _redis_client = redis.Redis(
        host=app.config["REDIS_HOST"],
        port=app.config["REDIS_PORT"],
        db=app.config["REDIS_DB"],
        password=app.config["REDIS_PASSWORD"],
        decode_responses=True,
        socket_connect_timeout=3,
        socket_timeout=3,
    )


def get_redis() -> redis.Redis:
    if _redis_client is None:
        raise RuntimeError("Redis is not initialised. Call init_redis(app) first.")
    return _redis_client
