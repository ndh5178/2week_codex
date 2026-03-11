from __future__ import annotations

from flask import Blueprint, abort, current_app, render_template

main_bp = Blueprint('main', __name__)


@main_bp.get('/')
def index() -> str:
    features = [feature for feature in current_app.config['REGISTERED_FEATURES'] if feature.key != 'meongseok']
    return render_template('index.html', features=features)


@main_bp.get('/game')
def game() -> str:
    feature = next(
        (feature for feature in current_app.config['REGISTERED_FEATURES'] if feature.key == 'meongseok'),
        None,
    )
    if feature is None:
        abort(404)
    return render_template('game.html', feature=feature)
