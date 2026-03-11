# codex2weeks

포켓몬 도감, 팀 빌더, 배틀, 키워드 배경화면 생성 기능을 하나의 Flask 프로젝트로 통합한 미니 프로젝트입니다.  
기능 단위 개발과 마지막 통합을 쉽게 하기 위해 `features/<기능명>` 중심 구조로 정리되어 있습니다.

## 프로젝트 개요

- 메인 페이지에서 포켓몬 도감을 탐색할 수 있습니다.
- 스타일 기반 추천 팀을 자동으로 생성하는 팀 빌더를 제공합니다.
- Google OAuth2 로그인 후 추천 팀을 저장하고 불러올 수 있습니다.
- 저장한 팀을 배틀 페이지에서 불러와 카드 배틀 흐름에 활용할 수 있습니다.
- 포켓몬 + 키워드 조합으로 배경화면 PNG를 생성할 수 있습니다.
- 전체 페이지에서 공통 BGM 플레이어를 사용할 수 있습니다.

## 주요 기능

### 1. 포켓몬 도감

- 메인 화면에서 지역, 검색, 필터를 기반으로 포켓몬을 탐색합니다.
- 오늘의 포켓몬, 상세 모달, 타입/종족값/이미지 표시를 지원합니다.
- 일부 포켓몬은 상세 모달에서 팀 초안에 바로 추가할 수 있습니다.

### 2. 포켓몬 팀 빌더

- 스타일 선택 기반으로 6마리 추천 팀을 생성합니다.
- 예시 스타일:
  - 공격형 팀
  - 귀여운 팀
  - 물 타입 중심 팀
  - 전설 제외 팀
  - 초보자 추천 팀
- PokeAPI 기반 데이터와 프론트 로직을 이용해 후보를 필터링하고 팀 시너지를 설명합니다.
- 로그인 상태에서는 현재 추천 팀을 MongoDB에 저장할 수 있습니다.
- 저장된 추천 팀은 다시 보기와 삭제가 가능합니다.

### 3. 내 팀 관리

- 도감에서 고른 포켓몬을 팀 초안으로 모을 수 있습니다.
- 초안을 완성하면 별도 내 팀으로 저장할 수 있습니다.
- 저장된 내 팀은 JSON 파일 기반으로 관리됩니다.
- 배틀 페이지에서 최근 저장 팀을 불러오는 흐름과 연결됩니다.

### 4. 배틀 페이지

- `/game`에서 카드형 배틀 화면을 제공합니다.
- 기본 카드 덱과 내 팀 불러오기 흐름을 지원합니다.
- 저장된 내 팀을 불러와 배틀 카드로 사용할 수 있습니다.
- 포켓몬 타입, 능력치, 특성 정보를 배틀 표시와 일부 로직에 반영합니다.

### 5. 키워드 배경화면 생성기

- 포켓몬과 키워드를 조합해 배경화면을 생성합니다.
- Canvas 기반으로 렌더링하며 PNG 저장을 지원합니다.

### 6. Google OAuth2 로그인

- Google 계정으로 로그인할 수 있습니다.
- 로그인 후 팀 빌더 저장 기능과 사용자별 데이터 접근이 가능해집니다.
- `/login`은 설정이 완료되어 있으면 바로 Google 로그인으로 이동합니다.

## 기술 스택

- Backend: Python, Flask, Jinja2
- Frontend: HTML, CSS, JavaScript
- Data:
  - MongoDB: 추천 팀 저장
  - 로컬 JSON 파일: 팀 초안, 내 팀 저장
- Auth: Google OAuth2

## 프로젝트 구조

```text
app.py
feature_registry.py
requirements.txt

blueprints/
  main_routes.py

features/
  meongseok/
    backend.py
    feature.md
  pokedex/
    backend.py
    draft_store.py
    team_store.py
    TeamBuilder.md
    feature.md
  pokemon-keyword-wallpaper/
    backend.py
    feature.md

templates/
  index.html
  game.html
  auth/
    login.html
  features/
    meongseok/
      template_fragment.html
    pokedex/
      template_fragment.html
      team_builder.html
      my_teams.html
      Info.md
    pokemon-keyword-wallpaper/
      template_fragment.html

static/
  css/
    base.css
    global_bgm.css
  js/
    global_bgm.js
  features/
    meongseok/
      frontend.css
      frontend.js
    pokedex/
      frontend.css
      frontend.js
      my_teams.js
      team_builder.css
      team_builder.js
      official-form-pokedex-data.json
    pokemon-keyword-wallpaper/
      frontend.css
      frontend.js

data/
  team_builder_drafts.json
  team_builder_teams.json
```

## 기능 단위 협업 규칙

이 프로젝트는 여러 명이 동시에 작업해도 충돌을 줄이기 위해 기능 단위 구조를 사용합니다.

- 각 팀원은 주로 `features/<기능명>/` 범위 안에서 작업합니다.
- 기능별 화면 조각은 `templates/features/<기능명>/`에 둡니다.
- 기능별 정적 파일은 `static/features/<기능명>/`에 둡니다.
- 기능별 백엔드는 `features/<기능명>/backend.py`에 둡니다.
- 공통 진입점은 `app.py`, `feature_registry.py`, `templates/index.html`입니다.

자동 등록 구조:

- `feature_registry.py`가 `features/*`를 순회하며 feature 정보를 수집합니다.
- 각 feature의 `backend.py`에 `bp` 블루프린트가 있으면 앱 시작 시 자동 등록합니다.

## 실행 방법

### 1. 가상환경 활성화

```powershell
.\venv\Scripts\Activate.ps1
```

### 2. 패키지 설치

```powershell
pip install -r requirements.txt
```

현재 `requirements.txt`:

- Flask==3.1.0
- pymongo==4.10.1
- python-dotenv==1.0.1

### 3. `.env` 파일 작성

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```env
SECRET_KEY=change-this-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:5000/auth/google/callback
MONGO_URI=your-mongodb-connection-string
MONGO_DB_NAME=codex2weeks
```

참고:

- MongoDB 저장은 `MONGO_URI` 또는 `MONGODB_URI`가 설정되어 있을 때 활성화됩니다.
- `MONGO_DB_NAME`이 없으면 기본 DB 이름은 코드 기준 기본값을 사용합니다.

### 4. 앱 실행

```powershell
python app.py
```

### 5. 접속

- 메인 페이지: `http://127.0.0.1:5000`
- 배틀 페이지: `http://127.0.0.1:5000/game`
- 팀 빌더: `http://127.0.0.1:5000/pokedex/team-builder`
- 내 팀 관리: `http://127.0.0.1:5000/pokedex/my-teams`

## 주요 라우트

### 공통

- `GET /`: 메인 페이지
- `GET /game`: 배틀 페이지

### Pokedex / Team Builder

- `GET /team-builder`
- `GET /pokedex/team-builder`
- `GET /my-teams`
- `GET /pokedex/my-teams`
- `GET /api/pokedex/health`

### Google OAuth2

- `GET /login`
- `GET /login/setup`
- `GET /auth/google/login`
- `GET /auth/google/callback`
- `POST /auth/logout`

### 추천 팀 저장 API

- `GET /api/pokedex/team-builder/saved`
- `POST /api/pokedex/team-builder/save`
- `DELETE /api/pokedex/team-builder/<item_id>`

### 팀 초안 / 내 팀 API

- `GET /api/pokedex/team-builder/draft`
- `POST /api/pokedex/team-builder/draft/members`
- `DELETE /api/pokedex/team-builder/draft/members/<member_id>`
- `DELETE /api/pokedex/team-builder/draft`
- `GET /api/pokedex/team-builder/teams`
- `POST /api/pokedex/team-builder/teams`
- `DELETE /api/pokedex/team-builder/teams/<team_id>`

### 배경화면 생성기 API

- `GET /api/wallpaper/options`

## 저장 구조

### 1. MongoDB

추천 팀 저장 기능은 MongoDB를 사용합니다.

- 사용자별 추천 팀 저장
- 최근 저장 추천 팀 조회
- 저장된 추천 팀 삭제

관련 구현:

- `features/pokedex/backend.py`

### 2. 로컬 JSON 파일

내 팀과 팀 초안은 로컬 JSON 파일에 저장됩니다.

- `data/team_builder_drafts.json`: 팀 초안
- `data/team_builder_teams.json`: 저장된 내 팀

관련 구현:

- `features/pokedex/draft_store.py`
- `features/pokedex/team_store.py`

## 화면 흐름

### 메인 페이지

1. 포켓몬 도감을 탐색합니다.
2. 원하는 포켓몬을 상세 모달에서 확인합니다.
3. 필요하면 팀 초안에 추가합니다.
4. 팀 빌더나 배틀 페이지로 이동합니다.

### 팀 빌더

1. 원하는 팀 방향을 선택합니다.
2. 추천 팀이 자동 생성됩니다.
3. 로그인 상태면 현재 팀 저장이 가능합니다.
4. 최근 저장된 추천 팀을 다시 보거나 삭제할 수 있습니다.

### 내 팀 관리

1. 도감에서 담아둔 팀 초안을 확인합니다.
2. 팀 이름을 정하고 저장합니다.
3. 저장된 내 팀을 다시 확인하거나 삭제합니다.

### 배틀

1. 기본 카드 배틀을 시작합니다.
2. 저장된 내 팀을 불러옵니다.
3. 포켓몬 카드와 특성 정보를 바탕으로 배틀을 진행합니다.

## 참고 문서

- `features/pokedex/TeamBuilder.md`
- `templates/features/pokedex/Info.md`
- `GOOGLE_OAUTH_SETUP.md`
- `requirements.md`

## 현재 프로젝트 성격

이 프로젝트는 단순한 단일 페이지가 아니라, 아래 흐름을 하나로 묶은 통합형 포켓몬 웹 앱입니다.

- 도감 탐색
- 팀 초안 수집
- 추천 팀 생성
- 팀 저장 및 관리
- 배틀 연동
- 배경화면 생성
- 공통 로그인 및 BGM 경험

즉, `README2.md`에 정리되어 있던 작업 흐름과 `README.md`의 협업 규칙을 현재 코드 구조에 맞춰 통합한 공식 README입니다.
