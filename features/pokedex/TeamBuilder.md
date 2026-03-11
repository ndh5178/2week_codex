# TeamBuilder 기능 정리

## 개요

`features/pokedex`의 팀 빌더는 사용자가 원하는 스타일을 고르면 포켓몬 6마리를 자동 추천하고, 팀 시너지 설명을 함께 보여주는 페이지입니다.

페이지 경로:

- `/team-builder`
- `/pokedex/team-builder`

렌더링 템플릿:

- `templates/features/pokedex/team_builder.html`

## 현재 구현된 기능

### 1. 스타일 클릭 즉시 팀 변경

사용 가능한 스타일:

- 공격형 팀
- 귀여운 팀
- 물 타입 중심 팀
- 전설 제외 팀
- 초보자 추천 팀

이제 스타일 카드를 클릭하면 별도의 추가 이동 없이 바로 해당 방향의 추천 팀이 다시 생성됩니다.

### 2. PokeAPI 기반 데이터 수집

아래 CSV 데이터를 프런트에서 직접 불러옵니다.

- `pokemon.csv`
- `pokemon_species.csv`
- `pokemon_species_names.csv`
- `pokemon_stats.csv`
- `pokemon_types.csv`

가져오는 주요 정보:

- 한글 이름
- 타입
- 종족값
- 이미지 URL
- 전설/환상 여부
- 타입 약점/반감 정보

### 3. 6마리 랜덤 추천 조합

추천 로직은 다음을 함께 고려합니다.

- 스타일별 기본 점수
- 팀에 없는 타입 추가 보너스
- 중복 타입 패널티
- 현재 팀의 약점 보완 여부
- 속도, 내구도, 역할 분산
- 상위 후보군 안에서의 랜덤 선택

그래서 같은 스타일을 다시 눌러도 결과가 고정되지 않고 달라질 수 있습니다.

### 4. 팀 시너지 설명 출력

추천 팀이 만들어지면 다음 내용을 자동으로 생성합니다.

- 스타일에 맞는 팀 방향 설명
- 약점 보완 설명
- 평균 종족값/속도/운영 성향 요약

예시:

- `불꽃 약점을 보완하려고 물/드래곤 타입을 함께 넣었습니다.`
- `속도가 빠른 포켓몬 비중을 높여 선공권을 잡기 쉽게 만들었습니다.`

### 5. Google 로그인 연동

로그인 상태는 세션 기반으로 관리합니다.

관련 라우트:

- `/login`: 설정 완료 시 즉시 Google 로그인 시작
- `/login/setup`: 설정/오류 확인 페이지
- `/auth/google/login`: OAuth 시작
- `/auth/google/callback`: OAuth 콜백
- `/auth/logout`: 로그아웃

### 6. 로그인 시 현재 팀 저장

로그인 상태이고 MongoDB가 연결되어 있으면, 현재 화면에 보이는 추천 팀을 `현재 팀 저장` 버튼으로 직접 저장할 수 있습니다.

저장 조건:

- 로그인 상태여야 함
- `MONGO_URI` 또는 `MONGODB_URI`가 설정되어 있어야 함
- 6마리 팀이 완성되어 있어야 함

저장 데이터:

- 사용자 정보
- 선택한 스타일
- 팀 요약 정보
- 팀 멤버 6마리
- 각 멤버의 타입/이미지/설명/종족값 일부
- 저장 시각

관련 API:

- `GET /api/pokedex/team-builder/saved`
- `POST /api/pokedex/team-builder/save`

### 7. 저장된 추천 팀 목록 표시

로그인 상태이고 MongoDB 설정이 되어 있으면, 최근 저장된 추천 팀 최대 8개를 화면 오른쪽 패널에 보여줍니다.

표시 정보:

- 저장 시각
- 스타일 이름
- 팀 제목
- 멤버 이름 목록

### 8. 저장된 추천 팀 다시 보기

저장 목록에서 `이 팀 다시 보기` 버튼을 누르면 현재 결과 영역에 해당 추천 팀을 다시 렌더링합니다.

동작:

- 저장된 요약 정보 복원
- 저장된 팀 6마리 복원
- 결과 영역으로 스크롤 이동
- 저장 상태 메시지 갱신

## MongoDB 설정

현재 팀 저장을 사용하려면 환경변수 중 하나가 필요합니다.

```env
MONGO_URI=your-mongodb-connection-string
```

또는

```env
MONGODB_URI=your-mongodb-connection-string
```

선택적으로 DB 이름도 지정할 수 있습니다.

```env
MONGO_DB_NAME=codex2weeks
```

기본 DB 이름은 `codex2weeks`입니다.

## 관련 파일

### 백엔드

- `features/pokedex/backend.py`

역할:

- 팀 빌더 페이지 렌더링
- Google OAuth 처리
- 현재 팀 저장 API
- 저장 팀 조회 API
- MongoDB 연결

### 템플릿

- `templates/features/pokedex/team_builder.html`

역할:

- 팀 빌더 메인 화면
- 저장 상태 표시
- 현재 팀 저장 버튼
- 저장 목록 표시
- 저장 팀 다시 보기 버튼

### 프런트엔드 로직

- `static/features/pokedex/team_builder.js`

역할:

- PokeAPI 데이터 로드
- 스타일 클릭 시 즉시 재추천
- 랜덤 팀 추천 계산
- 현재 팀 저장 호출
- 저장 목록 로드
- 저장 팀 복원

### 스타일

- `static/features/pokedex/team_builder.css`

역할:

- 팀 빌더 전용 디자인
- 저장 패널 UI
- 복원 버튼/상태 칩 스타일
- 비활성화 버튼 상태 표현

## 현재 동작 요약

1. 팀 빌더 페이지 접속
2. 스타일 선택 또는 추천 팀 만들기 클릭
3. 랜덤 추천 팀 자동 생성
4. 시너지 설명 출력
5. 로그인 + MongoDB 설정 상태라면 `현재 팀 저장` 버튼으로 저장
6. 저장 목록에 반영
7. 저장된 팀 다시 보기 가능
