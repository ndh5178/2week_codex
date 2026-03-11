from __future__ import annotations

from flask import Blueprint, current_app, render_template

main_bp = Blueprint('main', __name__)


@main_bp.get('/')
def index() -> str:
    return render_template('index.html', features=current_app.config['REGISTERED_FEATURES'])
