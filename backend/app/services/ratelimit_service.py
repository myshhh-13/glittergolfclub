from flask import current_app

from ..extensions import get_redis


_BLACKLIST_KEY = "blacklist"


def _rl_key(ip: str) -> str:
    return f"rl:{ip}"


def register_hit(ip: str) -> int:
    redis = get_redis()
    pipe = redis.pipeline()
    pipe.incr(_rl_key(ip))
    pipe.ttl(_rl_key(ip))
    count, ttl = pipe.execute()

    if ttl in (-1, -2):
        redis.expire(_rl_key(ip), current_app.config["FORGIVE_CLIENTS_AFTER"])

    return int(count)


def is_blacklisted(ip: str) -> bool:
    return bool(get_redis().sismember(_BLACKLIST_KEY, ip))


def blacklist(ip: str) -> bool:
    return bool(get_redis().sadd(_BLACKLIST_KEY, ip))


def unblacklist(ip: str) -> bool:
    return bool(get_redis().srem(_BLACKLIST_KEY, ip))


def list_blacklist() -> list[str]:
    members = get_redis().smembers(_BLACKLIST_KEY)
    return sorted(members)
