# 구글 클라우드 설정 및 배포 체크리스트

이 문서는 Google Cloud Console 설정부터 앱 설정, 그리고 배포까지의 모든 과정을 단계별로 안내합니다.

## 1. Google Cloud Console 설정

### ✅ 1-1. 프로젝트 생성
- [ ] [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
- [ ] 새 프로젝트를 생성하거나 기존 프로젝트를 선택합니다.

### ✅ 1-2. API 활성화
- [ ] 메뉴에서 **APIs & Services** > **Library**로 이동합니다.
- [ ] 다음 API들을 검색하여 각각 **ENABLE(사용 설정)**을 클릭합니다:
    - [ ] **Google Calendar API**
    - [ ] **Google Tasks API**
    - [ ] **Google Drive API**

### ✅ 1-3. OAuth 동의 화면 (Consent Screen) 구성
- [ ] 메뉴에서 **APIs & Services** > **OAuth consent screen**으로 이동합니다.
- [ ] **User Type**: `External`(외부) 선택 후 만들기 클릭.
- [ ] **App Information**: 앱 이름, 지원 이메일 입력.
- [ ] **Developer Contact Information**: 개발자 이메일 입력.
- [ ] **Scopes (범위)**:
    - [ ] **ADD OR REMOVE SCOPES** 클릭.
    - [ ] 다음 범위들을 검색하여 체크 후 추가:
        - `.../auth/calendar.readonly`
        - `.../auth/tasks`
        - `.../auth/drive.file`
- [ ] **Test Users (테스트 사용자)**:
    - [ ] 앱을 테스트할 Google 계정(본인 이메일 등)을 추가합니다. (앱이 'Publish' 되기 전까지는 여기에 등록된 사용자만 로그인 가능합니다.)

### ✅ 1-4. 사용자 인증 정보 (Credentials) 생성
- [ ] 메뉴에서 **APIs & Services** > **Credentials**로 이동합니다.

#### 1) API 키 생성 (Google API Key)
- [ ] **+ CREATE CREDENTIALS** > **API Key** 선택.
- [ ] 생성된 키를 복사해둡니다. (앱 설정의 `Google API Key`에 사용)
- [ ] (선택사항) 'Restrict Key'를 클릭하여 위에서 활성화한 API들만 호출 가능하도록 제한하면 보안에 좋습니다.

#### 2) OAuth 2.0 클라이언트 ID 생성 (Google Client ID)
- [ ] **+ CREATE CREDENTIALS** > **OAuth 2.0 Client ID** 선택.
- [ ] **Application type**: `Web application` 선택.
- [ ] **Name**: 식별 가능한 이름 입력 (예: `DJD SOAP Web Client`).
- [ ] **Authorized JavaScript origins (승인된 자바스크립트 원본)**:
    - [ ] `http://localhost:5173` (개발용)
    - [ ] (배포 후 추가) `https://your-project-id.web.app` (Firebase 배포 도메인 등)
- [ ] **Authorized redirect URIs (승인된 리디렉션 URI)**:
    - [ ] `http://localhost:5173`
    - [ ] `http://localhost:5173/`
    - [ ] (배포 후 추가) `https://your-project-id.web.app`
    - [ ] (배포 후 추가) `https://your-project-id.web.app/`
- [ ] **CREATE** 클릭 후 **Client ID**를 복사해둡니다.

---

## 2. 내가 해야 할 일 (앱 설정 및 테스트)

이 앱은 `.env` 파일 대신 **브라우저 로컬 스토리지**를 사용하여 키를 관리합니다. 따라서 앱을 실행한 후 UI에서 직접 키를 입력해야 합니다.

### ✅ 2-1. 앱 실행 및 설정 입력
- [ ] 로컬 개발 서버 실행:
  ```bash
  npm run dev
  ```
- [ ] 브라우저에서 `http://localhost:5173` 접속.
- [ ] 우측 상단 **설정(톱니바퀴 아이콘)** 클릭.
- [ ] 다음 항목들을 입력하고 **저장** 클릭:
    - [ ] **Gemini API Key**: [Google AI Studio](https://aistudio.google.com/app/apikey)에서 발급받은 키.
    - [ ] **Google API Key**: 위 1-4에서 생성한 API Key.
    - [ ] **Client ID**: 위 1-4에서 생성한 OAuth 2.0 Client ID.

### ✅ 2-2. 기능 테스트
- [ ] **구글 로그인**: 우측 상단 구글 아이콘 클릭 -> 로그인 및 권한 허용 -> 로그인 상태 유지 확인.
- [ ] **캘린더/Tasks 확인**: 버튼 클릭 시 일정이 잘 불러와지는지 확인.
- [ ] **Drive 저장 테스트**: 차트 생성 후 Drive 저장 버튼 동작 확인.

---

## 3. 배포 (Firebase Hosting 권장)

React/Vite 앱을 가장 쉽게 배포하고 Google Cloud와 연동하기 좋은 **Firebase Hosting**을 기준으로 설명합니다.

### ✅ 3-1. Firebase CLI 설치 및 로그인
- [ ] 터미널에서 Firebase 도구 설치:
  ```bash
  npm install -g firebase-tools
  ```
- [ ] Firebase 로그인:
  ```bash
  firebase login
  ```

### ✅ 3-2. 프로젝트 초기화
- [ ] 프로젝트 루트 폴더에서 실행:
  ```bash
  firebase init hosting
  ```
- [ ] 질문에 대한 답변:
    - **Project Setup**: `Use an existing project` -> 위 1번에서 만든 Google Cloud 프로젝트 선택. (목록에 없으면 `Add Firebase to an existing Google Cloud Platform project` 메뉴를 웹 콘솔에서 먼저 진행해야 할 수도 있습니다. 혹은 새 프로젝트 생성)
    - **Public directory**: `dist` (Vite 빌드 폴더)
    - **Configure as a single-page app?**: `Yes` (중요!)
    - **Set up automatic builds and deploys with GitHub?**: `No` (나중에 설정 가능)

### ✅ 3-3. 빌드 및 배포
- [ ] 앱 빌드:
  ```bash
  npm run build
  ```
- [ ] 배포 (터미널에서 명령어 입력):
  ```bash
  firebase deploy
  ```
- [ ] 배포 완료 후 제공되는 **Hosting URL** (예: `https://abcd-1234.web.app`) 복사.

### ✅ 3-4. (중요) Google Cloud Console 재설정
배포된 도메인에서도 로그인이 되도록 설정을 추가해야 합니다.

- [ ] [Google Cloud Console](https://console.cloud.google.com/) > **APIs & Services** > **Credentials** 이동.
- [ ] 아까 만든 **OAuth 2.0 Client ID** 수정(연필 아이콘).
- [ ] **Authorized JavaScript origins**에 배포된 URL 추가. (예: `https://abcd-1234.web.app`)
- [ ] **Authorized redirect URIs**에 배포된 URL 추가. (예: `https://abcd-1234.web.app` **및** `https://abcd-1234.web.app/`)
- [ ] 저장.

### ✅ 3-5. 최종 확인
- [ ] 배포된 URL로 접속.
- [ ] 설정(톱니바퀴) 메뉴에 API Key들이 잘 저장되어 있는지 확인 (로컬 스토리지라 배포 사이트에서는 다시 입력해야 할 수 있음).
- [ ] 구글 로그인 및 기능 정상 작동 확인.
