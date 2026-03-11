from __future__ import annotations

from dataclasses import dataclass
from importlib import import_module
from pathlib import Path

from flask import Flask

BASE_DIR = Path(__file__).resolve().parent
FEATURES_DIR = BASE_DIR / 'features'


@dataclass(frozen=True)
class FeatureDefinition:
    key: str
    label: str
    template_fragment: str
    css_file: str
    js_file: str
    module_path: str


def get_registered_features() -> list[FeatureDefinition]:
    features: list[FeatureDefinition] = []

    for feature_dir in sorted(FEATURES_DIR.iterdir()):
        if not feature_dir.is_dir() or feature_dir.name.startswith('_'):
            continue

        features.append(
            FeatureDefinition(
                key=feature_dir.name,
                label=feature_dir.name.replace('-', ' ').replace('_', ' ').title(),
                template_fragment=f"features/{feature_dir.name}/template_fragment.html",
                css_file=f"features/{feature_dir.name}/frontend.css",
                js_file=f"features/{feature_dir.name}/frontend.js",
                module_path=f"features.{feature_dir.name}.backend",
            )
        )

    return features


def register_feature_blueprints(app: Flask) -> None:
    for feature in get_registered_features():
        module = import_module(feature.module_path)
        blueprint = getattr(module, 'bp', None)
        if blueprint is not None:
            app.register_blueprint(blueprint)
