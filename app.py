from __future__ import annotations

import os
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover - optional during first bootstrap
    def load_dotenv(*_args: object, **_kwargs: object) -> bool:
        return False

from flask import Flask

from blueprints.main_routes import main_bp
from feature_registry import get_registered_features, register_feature_blueprints

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.update(
        SECRET_KEY=os.getenv('SECRET_KEY', 'dev-secret-key-change-me'),
        GOOGLE_CLIENT_ID=os.getenv('GOOGLE_CLIENT_ID', ''),
        GOOGLE_CLIENT_SECRET=os.getenv('GOOGLE_CLIENT_SECRET', ''),
        GOOGLE_REDIRECT_URI=os.getenv('GOOGLE_REDIRECT_URI', ''),
        REGISTERED_FEATURES=get_registered_features(),
    )
    app.register_blueprint(main_bp)
    register_feature_blueprints(app)
    return app


app = create_app()


if __name__ == '__main__':
    app.run(debug=True)
