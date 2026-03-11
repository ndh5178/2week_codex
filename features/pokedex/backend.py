from __future__ import annotations

import json
import os
import secrets
from datetime import datetime, timezone
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlsplit
from urllib.request import Request, urlopen
from uuid import uuid4

from flask import (
    Blueprint,
    current_app,
    flash,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)

try:
    from bson.errors import InvalidId
    from bson.objectid import ObjectId
    from pymongo import DESCENDING, MongoClient
    from pymongo.errors import PyMongoError
except ImportError:  # pragma: no cover - optional during bootstrap
    DESCENDING = -1
    MongoClient = None
    ObjectId = None

    class PyMongoError(Exception):
        pass

    class InvalidId(Exception):
        pass

from features.pokedex.draft_store import clear_draft_members, delete_draft_member, list_draft_members, save_draft_members
from features.pokedex.team_store import delete_team, list_user_teams, save_team

GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo'
TEAM_SAVE_COLLECTION = 'team_builder_saves'
DRAFT_OWNER_SESSION_KEY = 'pokedex_team_draft_owner'
TEAM_DRAFT_LIMIT = 6

bp = Blueprint('pokedex', __name__)

_mongo_client: Any | None = None


@bp.get('/api/pokedex/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}


@bp.get('/team-builder')
@bp.get('/pokedex/team-builder')
def team_builder_page() -> str:
    return render_template(
        'features/pokedex/team_builder.html',
        user=_current_user(),
        google_oauth_configured=_is_google_oauth_configured(),
        team_save_enabled=_is_team_storage_enabled(),
    )


@bp.get('/my-teams')
@bp.get('/pokedex/my-teams')
def my_teams_page() -> str:
    return render_template(
        'features/pokedex/my_teams.html',
        user=_current_user(),
        google_oauth_configured=_is_google_oauth_configured(),
    )


@bp.get('/api/pokedex/team-builder/saved')
def saved_team_builds() -> tuple[dict[str, Any], int] | dict[str, Any]:
    user = _current_user()
    if not user:
        return {'ok': False, 'message': '로그인 후 저장된 추천 팀을 볼 수 있습니다.'}, 401

    collection = _get_team_collection()
    if collection is None:
        return {'ok': False, 'message': 'MongoDB 설정이 아직 준비되지 않았습니다.'}, 503

    try:
        documents = collection.find({'user.id': user['id']}).sort('created_at', DESCENDING).limit(8)
        return {'ok': True, 'items': [_serialize_saved_team(document) for document in documents]}
    except PyMongoError:
        return {'ok': False, 'message': '저장된 추천 팀을 읽어오지 못했습니다.'}, 500


@bp.post('/api/pokedex/team-builder/save')
def save_team_build() -> tuple[dict[str, Any], int] | dict[str, Any]:
    user = _current_user()
    if not user:
        return {'ok': False, 'message': '로그인 후 추천 팀을 저장할 수 있습니다.'}, 401

    collection = _get_team_collection()
    if collection is None:
        return {'ok': False, 'message': 'MongoDB 설정이 없어 추천 팀을 저장할 수 없습니다.'}, 503

    payload = request.get_json(silent=True) or {}
    team = payload.get('team') or []
    style = payload.get('style') or {}
    summary = payload.get('summary') or {}

    if len(team) != 6:
        return {'ok': False, 'message': '6마리 추천 팀만 저장할 수 있습니다.'}, 400

    document = {
        'user': {
            'id': user.get('id', ''),
            'name': user.get('name', ''),
            'email': user.get('email', ''),
        },
        'style': {
            'key': style.get('key', ''),
            'label': style.get('label', ''),
        },
        'summary': {
            'title': summary.get('title', ''),
            'badges': summary.get('badges', []),
            'insights': summary.get('insights', []),
        },
        'team': [
            {
                'id': member.get('id'),
                'speciesId': member.get('speciesId'),
                'name': member.get('displayName', ''),
                'types': member.get('types', []),
                'imageUrl': member.get('imageUrl', ''),
                'rationale': member.get('rationale', ''),
                'stats': member.get('stats', {}),
                'total': member.get('total', 0),
            }
            for member in team
        ],
        'created_at': datetime.now(timezone.utc),
    }

    try:
        result = collection.insert_one(document)
    except PyMongoError:
        return {'ok': False, 'message': '추천 팀 저장 중 오류가 발생했습니다.'}, 500

    document['_id'] = result.inserted_id
    return {
        'ok': True,
        'message': '추천 팀을 자동 저장했습니다.',
        'item': _serialize_saved_team(document),
    }


@bp.delete('/api/pokedex/team-builder/<item_id>')
def delete_team_build(item_id: str) -> tuple[dict[str, Any], int] | dict[str, Any]:
    user = _current_user()
    if not user:
        return {'ok': False, 'message': '로그인 후 저장된 추천 팀을 삭제할 수 있습니다.'}, 401

    collection = _get_team_collection()
    if collection is None:
        return {'ok': False, 'message': 'MongoDB 설정이 아직 준비되지 않았습니다.'}, 503

    if ObjectId is None:
        return {'ok': False, 'message': '삭제 기능을 사용할 수 없는 환경입니다.'}, 503

    try:
        object_id = ObjectId(item_id)
    except (InvalidId, TypeError):
        return {'ok': False, 'message': '삭제할 추천 팀 ID가 올바르지 않습니다.'}, 400

    try:
        result = collection.delete_one({'_id': object_id, 'user.id': user['id']})
    except PyMongoError:
        return {'ok': False, 'message': '추천 팀 삭제 중 오류가 발생했습니다.'}, 500

    if result.deleted_count == 0:
        return {'ok': False, 'message': '삭제할 추천 팀을 찾지 못했습니다.'}, 404

    return {'ok': True, 'message': '추천 팀을 삭제했습니다.', 'id': item_id}


@bp.get('/api/pokedex/team-builder/teams')
def get_my_teams() -> tuple[Any, int] | Any:
    user = _current_user()
    if not user:
        return jsonify({'message': '로그인이 필요합니다.'}), 401
    return jsonify({'teams': list_user_teams(user['id'])})


@bp.get('/api/pokedex/team-builder/draft')
def get_team_draft() -> Any:
    return jsonify({'team': _get_team_draft()})


@bp.post('/api/pokedex/team-builder/draft/members')
def add_team_draft_member() -> tuple[Any, int]:
    payload = request.get_json(silent=True) or {}
    member_id = payload.get('id')
    display_name = str(payload.get('displayName', '')).strip()
    image_url = str(payload.get('imageUrl', '')).strip()
    types = payload.get('types', [])

    if not member_id or not display_name:
        return jsonify({'message': '포켓몬 정보가 올바르지 않습니다.'}), 400
    if not isinstance(types, list):
        return jsonify({'message': '포켓몬 타입 정보가 올바르지 않습니다.'}), 400

    draft = _get_team_draft()
    if any(str(member.get('id')) == str(member_id) for member in draft):
        return jsonify({'message': '이미 팀 후보에 담긴 포켓몬입니다.', 'reason': 'duplicate', 'team': draft}), 409
    if len(draft) >= TEAM_DRAFT_LIMIT:
        return jsonify({'message': '팀 후보는 최대 6마리까지 담을 수 있습니다.', 'reason': 'full', 'team': draft}), 400

    draft.append(
        {
            'id': member_id,
            'name': str(payload.get('name', '')).strip(),
            'displayName': display_name,
            'imageUrl': image_url,
            'types': types,
            'region': str(payload.get('region', '')).strip(),
            'rationale': str(payload.get('rationale', '')).strip(),
            'stats': payload.get('stats', {}),
            'ability': payload.get('ability', None),
        }
    )
    _set_team_draft(draft)
    return jsonify({'team': draft, 'count': len(draft)}), 201


@bp.delete('/api/pokedex/team-builder/draft/members/<member_id>')
def remove_team_draft_member(member_id: str) -> tuple[Any, int]:
    if not delete_draft_member(_get_draft_owner_id(), member_id):
        return jsonify({'message': '삭제할 팀 후보를 찾지 못했습니다.'}), 404
    return jsonify({'ok': True})


@bp.delete('/api/pokedex/team-builder/draft')
def clear_team_draft() -> Any:
    clear_draft_members(_get_draft_owner_id())
    return jsonify({'ok': True})


@bp.post('/api/pokedex/team-builder/teams')
def create_team() -> tuple[Any, int]:
    user = _current_user()
    if not user:
        return jsonify({'message': '로그인이 필요합니다.'}), 401

    payload = request.get_json(silent=True) or {}
    team_name = str(payload.get('team_name', '')).strip()
    style = str(payload.get('style', '')).strip()
    members = payload.get('members', [])
    summary = payload.get('summary', {})

    if not team_name:
        return jsonify({'message': '팀 이름을 입력해 주세요.'}), 400
    if not style:
        return jsonify({'message': '팀 스타일 정보가 필요합니다.'}), 400
    if not isinstance(members, list) or len(members) != 6:
        return jsonify({'message': '저장할 팀은 6마리여야 합니다.'}), 400

    team = save_team(
        {
            'id': uuid4().hex,
            'user_id': user['id'],
            'user_name': user.get('name', 'Trainer'),
            'team_name': team_name,
            'style': style,
            'members': members,
            'summary': summary,
        }
    )
    return jsonify({'team': team}), 201


@bp.delete('/api/pokedex/team-builder/teams/<team_id>')
def remove_team(team_id: str) -> tuple[Any, int]:
    user = _current_user()
    if not user:
        return jsonify({'message': '로그인이 필요합니다.'}), 401
    if not delete_team(user['id'], team_id):
        return jsonify({'message': '삭제할 팀을 찾지 못했습니다.'}), 404
    return jsonify({'ok': True})


@bp.get('/login')
def login_page() -> Any:
    next_url = _safe_next_url(request.args.get('next'))
    if _current_user():
        return redirect(next_url)
    if _is_google_oauth_configured():
        return redirect(url_for('pokedex.google_login', next=next_url))
    return redirect(url_for('pokedex.login_setup_page', next=next_url))


@bp.get('/login/setup')
def login_setup_page() -> str:
    return render_template(
        'auth/login.html',
        user=_current_user(),
        google_oauth_configured=_is_google_oauth_configured(),
        google_redirect_uri=_google_redirect_uri(),
        next_url=_safe_next_url(request.args.get('next')),
    )


@bp.get('/auth/google/login')
def google_login() -> Any:
    next_url = _safe_next_url(request.args.get('next'))
    if _current_user():
        return redirect(next_url)
    if not _is_google_oauth_configured():
        flash('Google OAuth 설정이 아직 비어 있습니다. .env 파일에 클라이언트 정보를 먼저 입력해 주세요.', 'warning')
        return redirect(url_for('pokedex.login_setup_page', next=next_url))

    state = secrets.token_urlsafe(32)
    session['google_oauth_state'] = state
    session['google_oauth_next'] = next_url

    query = urlencode(
        {
            'client_id': current_app.config['GOOGLE_CLIENT_ID'],
            'redirect_uri': _google_redirect_uri(),
            'response_type': 'code',
            'scope': 'openid email profile',
            'state': state,
            'access_type': 'offline',
            'prompt': 'consent select_account',
        }
    )
    return redirect(f'{GOOGLE_AUTH_URL}?{query}')


@bp.get('/auth/google/callback')
def google_callback() -> Any:
    error = request.args.get('error')
    if error:
        flash(f'Google 로그인에 실패했습니다: {error}', 'error')
        return redirect(url_for('pokedex.login_setup_page'))

    state = request.args.get('state', '')
    expected_state = session.pop('google_oauth_state', '')
    if not state or state != expected_state:
        flash('로그인 요청 상태값이 일치하지 않습니다. 다시 시도해 주세요.', 'error')
        return redirect(url_for('pokedex.login_setup_page'))

    code = request.args.get('code')
    if not code:
        flash('Google에서 인증 코드를 전달하지 않았습니다.', 'error')
        return redirect(url_for('pokedex.login_setup_page'))

    try:
        token_payload = _post_form(
            GOOGLE_TOKEN_URL,
            {
                'code': code,
                'client_id': current_app.config['GOOGLE_CLIENT_ID'],
                'client_secret': current_app.config['GOOGLE_CLIENT_SECRET'],
                'redirect_uri': _google_redirect_uri(),
                'grant_type': 'authorization_code',
            },
        )
        user_info = _get_json(
            GOOGLE_USERINFO_URL,
            headers={'Authorization': f"Bearer {token_payload['access_token']}"},
        )
    except (HTTPError, URLError, KeyError, ValueError) as exc:
        flash(f'Google 사용자 정보를 가져오지 못했습니다. 설정값과 리디렉션 URI를 확인해 주세요. ({exc})', 'error')
        return redirect(url_for('pokedex.login_setup_page'))

    session['google_user'] = {
        'id': user_info.get('sub', ''),
        'name': user_info.get('name') or user_info.get('given_name') or 'Trainer',
        'email': user_info.get('email', ''),
        'picture': user_info.get('picture', ''),
    }
    return redirect(session.pop('google_oauth_next', url_for('pokedex.team_builder_page')))


@bp.post('/auth/logout')
def logout() -> Any:
    session.pop('google_user', None)
    session.pop('google_oauth_next', None)
    session.pop('google_oauth_state', None)
    return redirect(_safe_next_url(request.form.get('next')))


def _current_user() -> dict[str, str] | None:
    return session.get('google_user')


def _get_team_draft() -> list[dict[str, Any]]:
    return list_draft_members(_get_draft_owner_id())


def _set_team_draft(draft: list[dict[str, Any]]) -> None:
    save_draft_members(_get_draft_owner_id(), draft)


def _get_draft_owner_id() -> str:
    user = _current_user()
    if user and user.get('id'):
        return f"user:{user['id']}"

    owner_id = session.get(DRAFT_OWNER_SESSION_KEY)
    if not owner_id:
        owner_id = f"guest:{uuid4().hex}"
        session[DRAFT_OWNER_SESSION_KEY] = owner_id
        session.modified = True
    return owner_id


def _is_google_oauth_configured() -> bool:
    return bool(current_app.config.get('GOOGLE_CLIENT_ID') and current_app.config.get('GOOGLE_CLIENT_SECRET'))


def _is_team_storage_enabled() -> bool:
    return bool(MongoClient and (_mongo_uri() is not None))


def _mongo_uri() -> str | None:
    return os.getenv('MONGODB_URI') or os.getenv('MONGO_URI')


def _get_team_collection():
    global _mongo_client
    if MongoClient is None:
        return None

    mongo_uri = _mongo_uri()
    if not mongo_uri:
        return None

    if _mongo_client is None:
        _mongo_client = MongoClient(mongo_uri, serverSelectionTimeoutMS=3000)

    database_name = os.getenv('MONGO_DB_NAME', 'codex2weeks')
    return _mongo_client[database_name][TEAM_SAVE_COLLECTION]


def _serialize_saved_team(document: dict[str, Any]) -> dict[str, Any]:
    created_at = document.get('created_at')
    return {
        'id': str(document.get('_id', '')),
        'style': document.get('style', {}),
        'summary': document.get('summary', {}),
        'team': document.get('team', []),
        'createdAt': created_at.isoformat() if hasattr(created_at, 'isoformat') else '',
    }


def _google_redirect_uri() -> str:
    configured = current_app.config.get('GOOGLE_REDIRECT_URI')
    if configured:
        return configured
    return url_for('pokedex.google_callback', _external=True)


def _safe_next_url(candidate: str | None) -> str:
    if not candidate:
        return url_for('pokedex.team_builder_page')
    parsed = urlsplit(candidate)
    if parsed.scheme or parsed.netloc:
        return url_for('pokedex.team_builder_page')
    if not candidate.startswith('/'):
        return url_for('pokedex.team_builder_page')
    return candidate


def _post_form(url: str, payload: dict[str, str]) -> dict[str, Any]:
    body = urlencode(payload).encode('utf-8')
    request_object = Request(url, data=body, headers={'Content-Type': 'application/x-www-form-urlencoded'})
    with urlopen(request_object, timeout=15) as response:
        return json.loads(response.read().decode('utf-8'))


def _get_json(url: str, headers: dict[str, str] | None = None) -> dict[str, Any]:
    request_object = Request(url, headers=headers or {})
    with urlopen(request_object, timeout=15) as response:
        return json.loads(response.read().decode('utf-8'))
