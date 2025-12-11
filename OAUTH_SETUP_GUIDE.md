# Google OAuth 2.0 설정 가이드

이 앱은 **OAuth 2.0 Authorization Code Flow with PKCE**를 사용하여 Google API (Calendar, Tasks, Drive)에 접근합니다.

## 🔑 주요 변경사항

### ✅ Refresh Token 지원

이제 앱이 **refresh token**을 발급받아 장기간 사용자 재인증 없이 Google API를 사용할 수 있습니다.

- ✅ `access_type=offline` 파라미터 추가
- ✅ `prompt=consent` 파라미터 추가
- ✅ `include_granted_scopes=true` 파라미터 추가
- ✅ Refresh token을 localStorage에 안전하게 저장
- ✅ Access token 자동 갱신 (5분마다 체크)

---

## 📋 Google Cloud Console 설정

### 1. OAuth 2.0 클라이언트 ID 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 또는 생성
3. **APIs & Services** > **Credentials** 이동
4. **+ CREATE CREDENTIALS** > **OAuth 2.0 Client ID** 선택

### 2. 애플리케이션 유형 선택

**중요**: 애플리케이션 유형을 **"Web application"**으로 선택하세요.

### 3. Redirect URI 설정

**승인된 리디렉션 URI (Authorized redirect URIs)**에 다음 URL을 추가하세요:

#### 개발 환경:
```
http://localhost:5173
http://localhost:5173/
```

#### 프로덕션 환경:
```
https://yourdomain.com
https://yourdomain.com/
```

**주의사항**:
- 정확한 URL을 입력해야 합니다 (포트 번호 포함)
- 후행 슬래시(/) 유무를 모두 추가하는 것이 안전합니다
- HTTP와 HTTPS를 구분해야 합니다

### 4. 승인된 JavaScript 출처 (선택사항)

다음 URL을 추가하세요:

#### 개발 환경:
```
http://localhost:5173
```

#### 프로덕션 환경:
```
https://yourdomain.com
```

### 5. API 활성화

다음 API를 활성화해야 합니다:

1. **Google Calendar API**
2. **Google Tasks API**
3. **Google Drive API**

**APIs & Services** > **Library**에서 각 API를 검색하여 활성화하세요.

---

## 🔧 앱 설정

### 1. API 키 및 클라이언트 ID 입력

앱 실행 후 **설정** 버튼을 클릭하여:

1. **Gemini API Key**: Google AI Studio에서 발급받은 API 키
2. **Google API Key**: Google Cloud Console에서 발급받은 API 키
3. **Google Client ID**: OAuth 2.0 클라이언트 ID

### 2. Google 로그인

1. 앱 상단의 **"Google 로그인"** 버튼 클릭
2. Google 계정 선택
3. 권한 승인 (Calendar, Tasks, Drive)
4. 자동으로 앱으로 리디렉션

### 3. Refresh Token 확인

로그인 성공 후, 브라우저의 **Developer Tools** > **Application** > **Local Storage**에서 `google_oauth_tokens` 항목을 확인하면:

```json
{
  "access_token": "ya29.a0...",
  "refresh_token": "1//0g...",
  "expires_at": 1234567890123,
  "scope": "..."
}
```

`refresh_token` 필드가 있으면 성공입니다!

---

## 🐛 문제 해결

### ❌ "redirect_uri_mismatch" 오류

**원인**: Redirect URI가 Google Cloud Console 설정과 일치하지 않습니다.

**해결**:
1. 현재 앱의 URL을 확인 (예: `http://localhost:5173`)
2. Google Cloud Console에서 정확히 동일한 URL을 Redirect URI에 추가
3. 변경 사항 저장 후 5분 정도 기다림
4. 다시 로그인 시도

### ❌ "invalid_client" 오류

**원인**: Client ID가 잘못되었거나 만료되었습니다.

**해결**:
1. Google Cloud Console에서 OAuth 2.0 Client ID 확인
2. 앱 설정에서 올바른 Client ID 입력
3. 페이지 새로고침 후 다시 시도

### ❌ Refresh token이 저장되지 않음

**원인**: Google이 이미 권한을 승인한 경우, 기본적으로 refresh token을 다시 발급하지 않습니다.

**해결**:
1. [Google Account Permissions](https://myaccount.google.com/permissions) 접속
2. 해당 앱 권한 삭제
3. 앱에서 다시 로그인
4. 권한 승인

### ❌ 토큰 갱신 실패

**원인**: Refresh token이 만료되었거나 revoke되었습니다.

**해결**:
1. 로그아웃 버튼 클릭
2. 다시 로그인

---

## 🔒 보안 고려사항

### PKCE (Proof Key for Code Exchange)

이 앱은 **PKCE**를 사용하여 Authorization Code Flow를 보호합니다:

- ✅ Backend 서버 없이도 안전한 OAuth 구현
- ✅ Authorization Code 가로채기 공격 방지
- ✅ SHA-256 해시 사용

### Refresh Token 저장

Refresh token은 **localStorage**에 저장됩니다:

- ⚠️ 공용 컴퓨터에서는 사용 후 반드시 로그아웃하세요
- ⚠️ XSS (Cross-Site Scripting) 공격에 주의하세요
- ✅ 로그아웃 시 token이 자동으로 revoke됩니다

---

## 📚 추가 정보

### OAuth 2.0 Flow 동작 방식

1. 사용자가 "Google 로그인" 버튼 클릭
2. PKCE code verifier 및 challenge 생성
3. Google OAuth 인증 페이지로 리디렉션
4. 사용자가 권한 승인
5. Authorization code와 함께 앱으로 리디렉션
6. Code verifier를 사용하여 authorization code를 access token 및 refresh token으로 교환
7. 토큰을 localStorage에 저장
8. Access token 만료 시 refresh token으로 자동 갱신

### 자동 토큰 갱신

앱은 5분마다 토큰 상태를 확인하고, 만료 5분 전이면 자동으로 갱신합니다.

### API 호출 전 토큰 검증

중요한 API 호출 (예: Drive 저장) 전에는 항상 `ensureValidToken()`을 호출하여 유효한 토큰을 보장합니다.

---

## 📞 지원

문제가 계속되면 다음을 확인하세요:

1. Google Cloud Console 설정이 올바른지
2. API가 모두 활성화되었는지
3. Redirect URI가 정확히 일치하는지
4. 브라우저 콘솔에 오류 메시지가 있는지

---

© 2025 DJD Quality-improvement in Clinical Practice. All rights reserved.
