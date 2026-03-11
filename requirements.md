## Python 가상환경 및 패키지 설치 가이드

이 문서는 `venv` 가상환경 생성, 가상환경 실행, `requirements.txt` 설치 방법을 정리한 파일입니다.

### 1. 가상환경 생성

프로젝트 루트에서 아래 명령어를 실행합니다.

```powershell
python -m venv venv
```

### 2. 가상환경 실행

PowerShell 기준으로 아래 명령어를 실행합니다.

```powershell
.\venv\Scripts\Activate.ps1
```

가상환경이 정상적으로 실행되면 터미널 앞에 `(venv)`가 표시됩니다.

### 3. requirements.txt 설치

가상환경이 활성화된 상태에서 아래 명령어를 실행합니다.

```powershell
pip install -r requirements.txt
```

현재 `requirements.txt`에는 아래 패키지가 포함되어 있습니다.

- `Flask==3.1.0`
- `pymongo==4.10.1`
- `python-dotenv==1.0.1`

### 4. 설치 확인

필요하면 아래 명령어로 설치된 패키지를 확인할 수 있습니다.

```powershell
pip list
```

### 5. 실행 예시

패키지 설치가 끝나면 아래 명령어로 프로젝트를 실행할 수 있습니다.

```powershell
python app.py
```

브라우저에서 `http://127.0.0.1:5000`으로 접속하면 됩니다.
