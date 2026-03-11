# Pokedex Feature

## 역할
- 기존 포켓몬 도감 화면과 프론트 로직을 담당합니다.
- 포켓몬 팀 빌더 페이지와 Google 로그인 흐름을 함께 제공합니다.
- 다른 팀원이 기능을 추가할 때 이 폴더를 복사해서 새 기능 폴더를 만들 수 있습니다.

## 포함 파일
- `backend.py`: 기능별 Flask 블루프린트와 OAuth 라우트
- `frontend.js`: 메인 도감 전용 프론트 로직
- `team_builder.js`: 팀 빌더 추천 로직
- `frontend.css`: 메인 도감 전용 스타일
- `team_builder.css`: 팀 빌더와 로그인 페이지 스타일
- `template_fragment.html`: 메인 템플릿에 삽입되는 HTML 조각

## 페이지 경로
- `/`: 메인 포켓몬 도감
- `/pokedex/team-builder`: 팀 빌더 페이지
- `/login`: Google 로그인 즉시 시작
- `/login/setup`: Google 로그인 설정/오류 확인 페이지

