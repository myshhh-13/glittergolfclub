from flask import Flask, current_app
import redis
from werkzeug.middleware.proxy_fix import ProxyFix

from .config import Config
from .routes import bp as main_bp


def create_app():
    app = Flask(__name__)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)
    app.config.from_object(Config)

    redis_client = redis.Redis(
        host=current_app.config['REDIS_IP'],
        port=current_app.config['REDIS_PORT'],
        db=current_app.config['REDIS_DB'],
        password=current_app.config['REDIS_PASSWORD']
    )
    app.extensions = getattr(app, 'extensions', {})
    app.extensions['redis'] = redis_client

    app.register_blueprint(main_bp)

    return app
