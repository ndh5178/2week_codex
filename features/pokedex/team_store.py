from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parents[2] / 'data'
DATA_FILE = DATA_DIR / 'team_builder_teams.json'


def _ensure_data_file() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text('[]', encoding='utf-8')


def _read_teams() -> list[dict[str, Any]]:
    _ensure_data_file()
    try:
        return json.loads(DATA_FILE.read_text(encoding='utf-8'))
    except json.JSONDecodeError:
        return []


def _write_teams(teams: list[dict[str, Any]]) -> None:
    _ensure_data_file()
    DATA_FILE.write_text(json.dumps(teams, ensure_ascii=False, indent=2), encoding='utf-8')


def list_user_teams(user_id: str) -> list[dict[str, Any]]:
    teams = [team for team in _read_teams() if team.get('user_id') == user_id]
    return sorted(teams, key=lambda team: team.get('updated_at', ''), reverse=True)


def save_team(team: dict[str, Any]) -> dict[str, Any]:
    teams = _read_teams()
    now = datetime.now(timezone.utc).isoformat()
    saved_team = {
        **team,
        'created_at': team.get('created_at', now),
        'updated_at': now,
    }
    teams.append(saved_team)
    _write_teams(teams)
    return saved_team


def delete_team(user_id: str, team_id: str) -> bool:
    teams = _read_teams()
    remaining = [team for team in teams if not (team.get('user_id') == user_id and team.get('id') == team_id)]
    if len(remaining) == len(teams):
        return False
    _write_teams(remaining)
    return True
