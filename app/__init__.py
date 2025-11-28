from flask import Flask

from .config import Config
from .routes import bp as main_bp


def create_app():
    conf = Config()

    if conf.ENVIRONMENT == 'dev':
        static_url_path = '/dev/static'
    else:
        static_url_path = '/static'

    app = Flask(__name__, static_folder='static', static_url_path=static_url_path)
    app.config.from_object(Config)
    app.register_blueprint(main_bp)

    return app
