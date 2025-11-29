from flask import Blueprint, current_app, render_template

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template('index.html', title='Glitter Club', version=current_app.config['VERSION'], env=current_app.config['ENVIRONMENT'])


@bp.route('/contactus')
def contactus():
    return render_template('contactus.html', title='Glitter Club', version=current_app.config['VERSION'], env=current_app.config['ENVIRONMENT'])


@bp.route('/news')
def news():
    return render_template('news.html', title='Glitter Club', version=current_app.config['VERSION'], env=current_app.config['ENVIRONMENT'])


@bp.route('/ourfields')
def ourfields():
    return render_template('ourfields.html', title='Glitter Club', version=current_app.config['VERSION'], env=current_app.config['ENVIRONMENT'])


@bp.route('/about')
def about():
    return render_template('about.html', title='Glitter Club', version=current_app.config['VERSION'], env=current_app.config['ENVIRONMENT'])
