from __future__ import annotations

from flask import Flask

from blueprints.main_routes import main_bp
from feature_registry import get_registered_features, register_feature_blueprints


def create_app() -> Flask:
    app = Flask(__name__)
    app.config['REGISTERED_FEATURES'] = get_registered_features()
    app.register_blueprint(main_bp)
    register_feature_blueprints(app)
    return app


app = create_app()


if __name__ == '__main__':
    app.run(debug=True)
