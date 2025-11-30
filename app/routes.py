from flask import Blueprint, current_app, render_template, request, jsonify
from datetime import datetime, timedelta


bp = Blueprint('main', __name__)


request_log = {}
blacklist = set()


def register_request(ip):
    now = datetime.utcnow()
    request_log[ip] = [t for t in request_log.get(ip, []) if now - t < int(current_app.config['FORGIVE_TIME'])]
    request_log.setdefault(ip, []).append(now)
    return len(request_log[ip])


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

    if ip in blacklist:
        return jsonify({'error': 'Forbidden'}), 403

    count = register_request(ip)

    if count > int(current_app.config['IGNORE_CLIENTS_AFTER']):
        if count > int(current_app.config['BLACKLIST_CLIENTS_AFTER']):
            blacklist.add(ip)
            return jsonify({'error': 'IP blacklisted. Fuck off, spammer'}), 403
        return jsonify({'error': 'Too many requests'}), 429
    
    request_data = {
        'first_name': request.form.get('first_name', '').strip(),
        'last_name': request.form.get('last_name', '').strip(),
        'org_name': request.form.get('org_name', 'Natural person').strip(),
        'email': request.form.get('email', '').strip(),
        'message': request.form.get('message', '').strip(),
    }

    return jsonify({'ip': ip, 'request_data': request_data}), 200
