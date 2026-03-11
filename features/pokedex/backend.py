from __future__ import annotations

import json
import secrets
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlsplit
from urllib.request import Request, urlopen

from flask import (
    Blueprint,
    current_app,
    flash,
    redirect,
    render_template,
    request,
    session,
    url_for,
)

GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo'

bp = Blueprint('pokedex', __name__)


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
    )


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
    flash('Google 계정으로 로그인되었습니다.', 'success')
    return redirect(session.pop('google_oauth_next', url_for('pokedex.team_builder_page')))


@bp.post('/auth/logout')
def logout() -> Any:
    session.pop('google_user', None)
    session.pop('google_oauth_next', None)
    session.pop('google_oauth_state', None)
    flash('로그아웃되었습니다.', 'success')
    return redirect(_safe_next_url(request.form.get('next')))


def _current_user() -> dict[str, str] | None:
    return session.get('google_user')


def _is_google_oauth_configured() -> bool:
    return bool(current_app.config.get('GOOGLE_CLIENT_ID') and current_app.config.get('GOOGLE_CLIENT_SECRET'))


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


