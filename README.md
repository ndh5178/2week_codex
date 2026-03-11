# Mini Project Feature-Based Structure

이 프로젝트는 4명이 각자 기능 단위로 작업한 뒤 마지막에 통합하기 쉽도록 구성되어 있습니다.

## 핵심 규칙

- 각 팀원은 `features/<기능명>/` 폴더 하나만 주로 수정합니다.
- 공통 파일인 `app.py`, `feature_registry.py`, `templates/index.html`은 통합 담당만 수정합니다.
- 각 기능 폴더는 아래 파일을 갖습니다.
  - `backend.py`
  - `frontend.js`
  - `frontend.css`
  - `template_fragment.html`
  - `feature.md`

## 현재 포함된 기능

- `features/pokedex`: 기존 포켓몬 도감 메인 기능

## 실행 방법

1. `.venv\Scripts\activate`
2. `python app.py`
3. `http://127.0.0.1:5000` 접속
