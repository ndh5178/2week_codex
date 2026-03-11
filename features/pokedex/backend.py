from __future__ import annotations

from flask import Blueprint

bp = Blueprint('pokedex', __name__, url_prefix='/api/pokedex')


@bp.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}
