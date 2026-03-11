from __future__ import annotations

from flask import Blueprint

bp = Blueprint('meongseok', __name__, url_prefix='/api/meongseok')


@bp.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}
