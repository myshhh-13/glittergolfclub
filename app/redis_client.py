from flask import current_app
import redis


client = redis.Redis(
    host=current_app.config['REDIS_IP'],
    port=current_app.config['REDIS_PORT'],
    db=current_app.config['REDIS_DB'],
    password=current_app.config['REDIS_PASSWORD']
)


def add_request(ip):
    pipe = client.pipeline()
    pipe.incr(ip)
    pipe.ttl(ip)
    incr_val, cur_ttl = pipe.execute()

    if cur_ttl in (-1, -2):
        client.expire(ip, int(current_app.config['FORGIVE_CLIENTS_AFTER']))

    return incr_val


def blacklist(ip):
    added = client.sadd("blacklist", ip)
    return bool(added)

def is_blacklisted(ip):
    return client.sismember("blacklist", ip)
