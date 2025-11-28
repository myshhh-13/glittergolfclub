from flask import Blueprint, current_app, render_template

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template('index.html', title='Glitter Club', version=current_app.config['VERSION'], env=current_app.config['ENVIRONMENT'])
