from flask import Blueprint, current_app, render_template, request, jsonify
from datetime import datetime, timedelta


bp = Blueprint('main', __name__)


requst_log = {}
blacklist = set()


def is_blacklisted(ip):
    return ip in blacklist




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


@bp.route('/requests', methods=['POST'])
def requests():
    ip = request.remote_addr

    print(ip)

    first_name = request.form.get('first_name', '').strip()
    last_name = request.form.get('last_name', '').strip()
    org_name = request.form.get('org_name', 'Natural person').strip()
    email = request.form.get('email', '').strip()
    message = request.form.get('message', '').strip()

    return jsonify({'ip': ip}), 200
