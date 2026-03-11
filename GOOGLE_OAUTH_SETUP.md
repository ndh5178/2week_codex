# Google OAuth 설정 가이드

이 프로젝트는 Google OAuth2 로그인 값을 코드에 하드코딩하지 않고 `.env`에서 읽도록 구성되어 있습니다.

## 1. `.env` 파일 만들기

프로젝트 루트에서 `.env.example`을 참고해 `.env` 파일을 만듭니다.

```env
SECRET_KEY=change-this-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:5000/auth/google/callback
```

## 2. Flask 앱 실행

```powershell
python app.py
```

## 3. 로그인 진입 경로

- `http://127.0.0.1:5000/login`

이 경로는 환경변수가 준비된 상태라면 즉시 Google 로그인 화면으로 이동합니다.

## 4. 설정/오류 확인 페이지

- `http://127.0.0.1:5000/login/setup`

이 페이지는 리디렉션 URI 확인, 설정값 점검, 로그인 오류 확인용으로 남겨 두었습니다.

## 5. 팀 빌더 페이지 접속

- `http://127.0.0.1:5000/pokedex/team-builder`

이 페이지에서 스타일을 고르면 자동으로 6마리 팀 추천과 시너지 설명을 확인할 수 있습니다.

## 6. 주요 라우트

- `/login`: Google 로그인 즉시 시작
- `/login/setup`: Google 로그인 설정/오류 확인 페이지
- `/auth/google/login`: Google OAuth 시작
- `/auth/google/callback`: Google OAuth 콜백
- `/auth/logout`: 로그아웃
- `/pokedex/team-builder`: 포켓몬 팀 빌더 페이지

## 7. 참고

- `GOOGLE_REDIRECT_URI`를 비워 두면 앱이 현재 호스트 기준 콜백 주소를 자동 계산합니다.
- 로컬 개발에서는 `http://127.0.0.1:5000/auth/google/callback`를 우선 맞춰 두는 것이 가장 간단합니다.
- 배포 시에는 배포 도메인의 콜백 주소로 `GOOGLE_REDIRECT_URI`를 바꿔 주세요.
