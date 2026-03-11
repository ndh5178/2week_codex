from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parents[2] / 'data'
DATA_FILE = DATA_DIR / 'team_builder_drafts.json'


def _ensure_data_file() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text('{}', encoding='utf-8')


def _read_drafts() -> dict[str, list[dict[str, Any]]]:
    _ensure_data_file()
    try:
        data = json.loads(DATA_FILE.read_text(encoding='utf-8'))
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def _write_drafts(drafts: dict[str, list[dict[str, Any]]]) -> None:
    _ensure_data_file()
    DATA_FILE.write_text(json.dumps(drafts, ensure_ascii=False, indent=2), encoding='utf-8')


def list_draft_members(owner_id: str) -> list[dict[str, Any]]:
    drafts = _read_drafts()
    members = drafts.get(owner_id, [])
    return members if isinstance(members, list) else []


def save_draft_members(owner_id: str, members: list[dict[str, Any]]) -> None:
    drafts = _read_drafts()
    drafts[owner_id] = members
    _write_drafts(drafts)


def clear_draft_members(owner_id: str) -> None:
    drafts = _read_drafts()
    if owner_id in drafts:
        drafts.pop(owner_id, None)
        _write_drafts(drafts)


def delete_draft_member(owner_id: str, member_id: str) -> bool:
    drafts = _read_drafts()
    members = drafts.get(owner_id, [])
    remaining = [member for member in members if str(member.get('id')) != str(member_id)]
    if len(remaining) == len(members):
        return False
    drafts[owner_id] = remaining
    _write_drafts(drafts)
    return True
