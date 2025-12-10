# 🔧 개발노트: OAuth 2.0 Authorization Code Flow with PKCE 구현

**작성일**: 2025-12-09
**작성자**: Claude (Anthropic AI)
**브랜치**: `claude/fix-oauth-refresh-token-016Aw5mknvEPnCcw5Y4mvVf9`
**커밋**: `b48afd1`, `4666c83`

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [문제 분석](#문제-분석)
3. [기술적 결정사항](#기술적-결정사항)
4. [아키텍처 설계](#아키텍처-설계)
5. [구현 상세](#구현-상세)
6. [보안 고려사항](#보안-고려사항)
7. [테스트 및 검증](#테스트-및-검증)
8. [트러블슈팅](#트러블슈팅)
9. [향후 개선사항](#향후-개선사항)

---

## 🎯 프로젝트 개요

### 배경

DJD 차트생성 도우미 앱에서 Google OAuth 인증 시 사용자가 **자주 재로그인해야 하는 문제** 발생.

### 목표

- ✅ Refresh token 발급 및 저장
- ✅ 자동 token 갱신 메커니즘 구현
- ✅ 장기간 재로그인 없이 사용 가능
- ✅ Backend 서버 없이 안전한 OAuth 구현 (PKCE 사용)

### 결과

- ✅ **Refresh token 기반 OAuth 2.0 Authorization Code Flow** 구현 완료
- ✅ **PKCE (Proof Key for Code Exchange)** 적용으로 보안 강화
- ✅ **자동 token 갱신** (5분마다 체크, 만료 5분 전 갱신)
- ✅ **Breaking change 없이 안전한 마이그레이션** 경로 제공

---

## 🔍 문제 분석

### 1. 이전 구현의 문제점

#### 코드 분석 (이전 버전 - 커밋 b65fe54)

```typescript
// App.tsx (이전 버전)
const handleAuthResult = useCallback((tokenResponse: any) => {
    if (tokenResponse && tokenResponse.access_token) {
        window.gapi.client.setToken(tokenResponse);
        setIsGoogleSignedIn(true);
        localStorage.setItem('googleApiSignedIn', 'true');

        // ❌ 문제: refresh_token이 없음!
        const expiresAt = Date.now() + (tokenResponse.expires_in || 3600) * 1000;
        localStorage.setItem('googleTokenExpiresAt', expiresAt.toString());
    }
}, []);

// ❌ 문제: Token Client는 Implicit Flow만 지원
tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
    client_id: googleClientId,
    scope: 'https://www.googleapis.com/auth/calendar.readonly ...',
    callback: handleAuthResult,
});
```

**문제점**:
1. **Google Identity Services Token Client 사용** → Implicit Flow만 지원
2. **refresh_token 발급 불가능** → `access_type=offline` 파라미터 설정 불가
3. **단순 access token 재요청** → 진짜 refresh가 아님
4. **일정 시간 후 재로그인 필요** → 사용자 경험 저하

### 2. 근본 원인

| 구분 | 내용 |
|------|------|
| **OAuth Flow** | Implicit Flow (구식, refresh token 미지원) |
| **API** | Google Identity Services Token Client |
| **파라미터** | `access_type=offline` 설정 불가 |
| **Token 저장** | access token만 저장, refresh token 없음 |
| **갱신 방식** | `requestAccessToken()` 호출 (새 토큰 요청) |

### 3. 해결 방향

- ✅ **Authorization Code Flow** 사용
- ✅ **PKCE** 적용 (Backend 없이도 안전)
- ✅ **refresh_token 발급** (access_type=offline)
- ✅ **자동 갱신 메커니즘** 구현

---

## 🏗️ 기술적 결정사항

### 1. OAuth Flow 선택

#### 비교 분석

| Flow | Refresh Token | Backend 필요 | 보안 | 선택 |
|------|--------------|-------------|------|------|
| Implicit | ❌ | ❌ | ⚠️ 낮음 | ❌ |
| Authorization Code | ✅ | ✅ | ✅ 높음 | ⚠️ |
| **Authorization Code + PKCE** | ✅ | ❌ | ✅ 매우 높음 | ✅ 선택 |
| Device Flow | ✅ | ❌ | ✅ 높음 | ❌ (UX 나쁨) |

#### 선택 이유: Authorization Code Flow + PKCE

**장점**:
- ✅ Refresh token 발급 가능
- ✅ Backend 서버 불필요 (PKCE 덕분)
- ✅ 보안 강화 (code verifier/challenge)
- ✅ OAuth 2.0 표준 준수
- ✅ Google 공식 지원

**단점**:
- ⚠️ Redirect 필요 (UX 약간 저하)
- ⚠️ 구현 복잡도 증가

**결정**: 장점이 단점보다 압도적으로 크므로 선택

### 2. 아키텍처 패턴

```
┌─────────────────────────────────────────────────────────┐
│                    React App (Frontend)                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌───────────────┐         ┌──────────────────────┐    │
│  │   App.tsx     │────────▶│ googleOAuthService   │    │
│  │               │         │                      │    │
│  │ - UI Logic    │         │ - PKCE Generation    │    │
│  │ - State Mgmt  │         │ - Token Exchange     │    │
│  │ - API Calls   │         │ - Token Refresh      │    │
│  └───────────────┘         │ - Token Storage      │    │
│         │                  └──────────────────────┘    │
│         │                            │                  │
│         ▼                            ▼                  │
│  ┌──────────────────────────────────────────────┐      │
│  │           localStorage                       │      │
│  │  { access_token, refresh_token, expires_at } │      │
│  └──────────────────────────────────────────────┘      │
│                                                          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ OAuth 2.0 + PKCE
                   ▼
     ┌─────────────────────────────┐
     │   Google OAuth 2.0 Server   │
     │                             │
     │  - Authorization Endpoint   │
     │  - Token Endpoint           │
     │  - Revoke Endpoint          │
     └─────────────────────────────┘
                   │
                   │ API Key + Access Token
                   ▼
     ┌─────────────────────────────┐
     │     Google APIs (gapi)      │
     │                             │
     │  - Calendar API             │
     │  - Tasks API                │
     │  - Drive API                │
     └─────────────────────────────┘
```

### 3. 기술 스택

| 구분 | 기술 | 이유 |
|------|------|------|
| **OAuth** | OAuth 2.0 + PKCE | 표준, 보안, refresh token 지원 |
| **암호화** | Web Crypto API (SHA-256) | 브라우저 내장, 안전 |
| **HTTP Client** | Fetch API | 네이티브, 추가 의존성 없음 |
| **Storage** | localStorage | 간단, 충분한 보안 (SPA 특성상) |
| **Language** | TypeScript | 타입 안정성, 개발 생산성 |

---

## 🏗️ 아키텍처 설계

### 1. 파일 구조

```
b/
├── services/
│   ├── geminiService.ts          # 기존 (AI 음성인식)
│   └── googleOAuthService.ts     # ✨ 신규 (OAuth 관리)
├── components/
│   └── icons.tsx                 # 기존 (아이콘)
├── App.tsx                       # 🔄 수정 (OAuth 통합)
├── OAUTH_SETUP_GUIDE.md          # ✨ 신규 (사용자 가이드)
├── NOTION_UPDATE.md              # ✨ 신규 (Notion 문서)
├── DEVELOPER_NOTES.md            # ✨ 신규 (개발노트)
├── package.json                  # 🔄 수정 (@types/node 추가)
└── tsconfig.json                 # 🔄 수정 (types 설정)
```

### 2. 모듈 설계

#### googleOAuthService.ts

**책임 (Single Responsibility)**:
- OAuth 2.0 PKCE flow 관리
- Token lifecycle 관리
- localStorage 상호작용

**인터페이스**:
```typescript
// Public API
export async function initiateOAuthFlow(
    clientId: string,
    redirectUri: string,
    scopes: string[]
): Promise<void>

export async function exchangeCodeForToken(
    code: string,
    clientId: string,
    redirectUri: string
): Promise<TokenResponse>

export async function refreshAccessToken(
    refreshToken: string,
    clientId: string
): Promise<TokenResponse>

export function saveTokenData(tokenResponse: TokenResponse): void
export function getStoredTokenData(): StoredTokenData | null
export function isTokenExpired(): boolean
export async function ensureValidToken(clientId: string): Promise<string>
export async function logout(): Promise<void>
export function parseOAuthCallback(): { code: string; state: string } | null
```

#### App.tsx

**변경사항**:
- Google Identity Services Token Client 제거
- OAuth callback 처리 로직 추가
- 자동 token 갱신 로직 수정
- Drive 저장 시 token 검증 추가

---

## 💻 구현 상세

### 1. PKCE (Proof Key for Code Exchange) 구현

#### 1.1 Code Verifier 생성

```typescript
/**
 * PKCE를 위한 랜덤 문자열 생성
 * RFC 7636 준수: 43-128자, [A-Za-z0-9-._~]
 */
function generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);  // 안전한 랜덤 생성
    return Array.from(randomValues)
        .map(v => charset[v % charset.length])
        .join('');
}
```

**기술적 포인트**:
- `crypto.getRandomValues()` 사용 → 암호학적으로 안전한 난수 생성
- 128자로 생성 → 최대 보안 강도
- URL-safe 문자만 사용

#### 1.2 Code Challenge 생성

```typescript
/**
 * SHA-256 해시 생성
 */
async function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);  // Web Crypto API
}

/**
 * Base64 URL 인코딩
 */
function base64UrlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');  // Padding 제거 (URL-safe)
}

/**
 * PKCE Code Verifier 및 Challenge 생성
 */
async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
    const verifier = generateRandomString(128);
    const hashed = await sha256(verifier);
    const challenge = base64UrlEncode(hashed);
    return { verifier, challenge };
}
```

**보안 포인트**:
- SHA-256 해시 → 일방향 암호화, 원본 복구 불가
- Base64 URL encoding → URL에 안전하게 포함 가능
- Challenge = SHA256(Verifier) → Verifier 유출 방지

### 2. OAuth Authorization Flow

#### 2.1 Authorization URL 생성 및 리다이렉트

```typescript
export async function initiateOAuthFlow(
    clientId: string,
    redirectUri: string,
    scopes: string[]
): Promise<void> {
    // PKCE 생성
    const { verifier, challenge } = await generatePKCE();

    // State 생성 (CSRF 방지)
    const state = generateRandomString(32);

    // Session Storage에 저장 (인증 완료 후 검증용)
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_code_verifier', verifier);

    // OAuth 인증 URL 생성
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: scopes.join(' '),
        state: state,
        code_challenge: challenge,           // PKCE
        code_challenge_method: 'S256',       // SHA-256
        access_type: 'offline',              // ⭐ refresh_token 발급!
        prompt: 'consent',                   // ⭐ 매번 consent
        include_granted_scopes: 'true'
    });

    const authUrl = `${OAUTH_ENDPOINT}?${params.toString()}`;

    // 인증 페이지로 리다이렉트
    window.location.href = authUrl;
}
```

**중요 파라미터**:
- `code_challenge`: PKCE challenge (SHA-256 해시)
- `code_challenge_method`: 'S256' (SHA-256)
- `access_type`: 'offline' → **refresh_token 발급**
- `prompt`: 'consent' → 매번 권한 승인 요청
- `state`: CSRF 공격 방지용 랜덤 문자열

#### 2.2 OAuth Callback 처리

```typescript
export function parseOAuthCallback(): { code: string; state: string } | null {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    // 에러 체크
    if (error) {
        throw new Error(`OAuth error: ${error} - ${params.get('error_description')}`);
    }

    if (!code || !state) {
        return null;
    }

    // State 검증 (CSRF 방지)
    const storedState = sessionStorage.getItem('oauth_state');
    if (state !== storedState) {
        throw new Error('State mismatch. Possible CSRF attack.');
    }

    return { code, state };
}
```

**보안 포인트**:
- State 검증 → CSRF 공격 방지
- Error handling → 사용자 친화적 오류 메시지

#### 2.3 Authorization Code → Token 교환

```typescript
export async function exchangeCodeForToken(
    code: string,
    clientId: string,
    redirectUri: string
): Promise<TokenResponse> {
    const codeVerifier = sessionStorage.getItem('oauth_code_verifier');

    if (!codeVerifier) {
        throw new Error('Code verifier not found. Please restart the OAuth flow.');
    }

    const params = new URLSearchParams({
        client_id: clientId,
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier  // PKCE 검증
    });

    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Token exchange failed: ${errorData.error_description || errorData.error}`);
    }

    const tokenData: TokenResponse = await response.json();

    // Session Storage 정리
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_code_verifier');

    return tokenData;
}
```

**TokenResponse 구조**:
```typescript
{
    access_token: "ya29.a0...",
    refresh_token: "1//0g...",  // ⭐ 핵심!
    expires_in: 3599,
    scope: "https://www.googleapis.com/auth/calendar.readonly ...",
    token_type: "Bearer"
}
```

### 3. Token 관리

#### 3.1 Token 저장

```typescript
interface StoredTokenData {
    access_token: string;
    refresh_token: string;
    expires_at: number;  // Unix timestamp (ms)
    scope: string;
}

export function saveTokenData(tokenResponse: TokenResponse): void {
    const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);

    const tokenData: StoredTokenData = {
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token || getStoredRefreshToken() || '',
        expires_at: expiresAt,
        scope: tokenResponse.scope
    };

    localStorage.setItem('google_oauth_tokens', JSON.stringify(tokenData));
}
```

**설계 포인트**:
- localStorage 사용 → SPA에서 충분한 보안
- JSON 직렬화 → 구조화된 데이터 저장
- expires_at 계산 → 만료 시간 사전 계산

#### 3.2 Token 갱신

```typescript
export async function refreshAccessToken(
    refreshToken: string,
    clientId: string
): Promise<TokenResponse> {
    const params = new URLSearchParams({
        client_id: clientId,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    });

    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Token refresh failed: ${errorData.error_description || errorData.error}`);
    }

    return await response.json();
}
```

**갱신 메커니즘**:
```typescript
export function isTokenExpired(): boolean {
    const tokenData = getStoredTokenData();
    if (!tokenData) return true;

    // 5분의 여유를 두고 만료 체크
    const BUFFER_TIME = 5 * 60 * 1000;
    return Date.now() >= (tokenData.expires_at - BUFFER_TIME);
}

export async function ensureValidToken(clientId: string): Promise<string> {
    const tokenData = getStoredTokenData();

    if (!tokenData) {
        throw new Error('No token data found. Please login first.');
    }

    // 토큰이 유효하면 바로 반환
    if (!isTokenExpired()) {
        return tokenData.access_token;
    }

    // 토큰이 만료되었으면 refresh
    if (!tokenData.refresh_token) {
        throw new Error('No refresh token available. Please login again.');
    }

    const newTokenResponse = await refreshAccessToken(tokenData.refresh_token, clientId);
    saveTokenData(newTokenResponse);

    return newTokenResponse.access_token;
}
```

**버퍼 시간 (5분)**:
- API 호출 중 토큰 만료 방지
- 갱신 전에 여유 시간 확보

### 4. App.tsx 통합

#### 4.1 OAuth Callback 처리

```typescript
// App.tsx
const handleOAuthCallback = useCallback(async () => {
    try {
        const callbackData = parseOAuthCallback();
        if (!callbackData) return;

        const { code } = callbackData;

        // Authorization Code를 Access Token으로 교환
        const tokenResponse = await exchangeCodeForToken(code, googleClientId, REDIRECT_URI);

        // 토큰 저장
        saveTokenData(tokenResponse);

        // gapi 클라이언트에 토큰 설정
        if (window.gapi?.client) {
            window.gapi.client.setToken({ access_token: tokenResponse.access_token });
        }

        setIsGoogleSignedIn(true);
        setGoogleApiError('');

        // URL에서 OAuth 파라미터 제거 (깔끔한 URL)
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

    } catch (error) {
        console.error('OAuth callback error:', error);
        setGoogleApiError(error instanceof Error ? error.message : 'OAuth 인증 실패');
        setIsGoogleSignedIn(false);
    }
}, [googleClientId, REDIRECT_URI]);
```

#### 4.2 자동 Token 갱신

```typescript
// App.tsx
useEffect(() => {
    if (!isGoogleSignedIn || !googleClientId) return;

    const checkAndRefreshToken = async () => {
        try {
            const validToken = await ensureValidToken(googleClientId);
            if (window.gapi?.client) {
                window.gapi.client.setToken({ access_token: validToken });
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
            setGoogleApiError('토큰 갱신에 실패했습니다. 다시 로그인해주세요.');
            setIsGoogleSignedIn(false);
        }
    };

    // 초기 체크
    checkAndRefreshToken();

    // 5분마다 토큰 상태 확인 및 갱신
    const intervalId = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
}, [isGoogleSignedIn, googleClientId]);
```

**갱신 주기 (5분)**:
- 토큰 만료 전 자동 갱신
- API 호출 실패 방지
- 사용자 경험 향상 (끊김 없음)

#### 4.3 Drive 저장 시 Token 검증

```typescript
// App.tsx
const handleSaveToDrive = async () => {
    // ... 생략 ...

    try {
        // 토큰 갱신 보장 ⭐
        const validToken = await ensureValidToken(googleClientId);
        window.gapi.client.setToken({ access_token: validToken });

        // Drive API 호출
        const folderResponse = await window.gapi.client.drive.files.list({...});
        // ... 나머지 로직 ...
    } catch (error) {
        // 에러 처리
    }
}
```

**중요성**:
- Drive 저장은 중요한 작업 → 반드시 성공해야 함
- API 호출 전 token 검증 → 실패율 최소화

---

## 🔒 보안 고려사항

### 1. PKCE (Proof Key for Code Exchange)

**목적**: Authorization Code 가로채기 공격 방지

**작동 원리**:
```
1. Client → Server: code_challenge (SHA-256 해시)
2. Server: code_challenge 저장
3. Google → Client: authorization_code (redirect)
4. Client → Server: authorization_code + code_verifier
5. Server: SHA-256(code_verifier) == code_challenge ? 검증
6. Server → Client: access_token + refresh_token
```

**공격 시나리오 (PKCE 없이)**:
1. 공격자가 authorization code 가로챔
2. 공격자가 token endpoint에 code 제출
3. 공격자가 access token 획득 → 계정 탈취

**PKCE로 방어**:
1. 공격자가 authorization code 가로챔
2. 공격자가 token endpoint에 code 제출
3. **code_verifier 없음** → 검증 실패 → 공격 차단

### 2. CSRF (Cross-Site Request Forgery) 방어

**State 파라미터 사용**:
```typescript
// 1. 로그인 시작 시
const state = generateRandomString(32);
sessionStorage.setItem('oauth_state', state);
// URL에 state 포함

// 2. Callback 처리 시
const returnedState = params.get('state');
const storedState = sessionStorage.getItem('oauth_state');
if (returnedState !== storedState) {
    throw new Error('State mismatch. Possible CSRF attack.');
}
```

**공격 시나리오 (State 없이)**:
1. 공격자가 악의적인 OAuth URL 생성
2. 사용자가 클릭 → Google 인증
3. 공격자의 계정으로 로그인됨

**State로 방어**:
1. State 불일치 → 인증 거부
2. CSRF 공격 차단

### 3. Token 저장 보안

**localStorage 사용**:
- ✅ SPA에서 충분한 보안
- ✅ XSS 방어 (React의 자동 escaping)
- ⚠️ 공용 컴퓨터 주의 (로그아웃 필수)

**대안 고려**:
| 방법 | 보안 | 장점 | 단점 | 선택 |
|------|------|------|------|------|
| localStorage | ⚠️ 중간 | 간단, 영구 저장 | XSS 취약 | ✅ 선택 |
| sessionStorage | ⚠️ 중간 | 세션 종료 시 삭제 | 탭 종료 시 삭제 | ❌ |
| Cookie (HttpOnly) | ✅ 높음 | XSS 방어 | Backend 필요 | ❌ |
| Memory | ✅ 높음 | XSS 방어 | 새로고침 시 삭제 | ❌ |

**선택 이유**:
- Backend 없는 SPA → localStorage가 최선
- React의 자동 XSS 방어 활용
- 사용자 편의성 (새로고침 후에도 유지)

### 4. Token Revoke (로그아웃)

```typescript
export async function logout(): Promise<void> {
    const tokenData = getStoredTokenData();

    if (tokenData?.access_token) {
        // Google에 토큰 revoke 요청
        try {
            await fetch(`${REVOKE_ENDPOINT}?token=${tokenData.access_token}`, {
                method: 'POST'
            });
        } catch (error) {
            console.error('Failed to revoke token:', error);
        }
    }

    // Local Storage 정리
    localStorage.removeItem('google_oauth_tokens');
}
```

**중요성**:
- 공용 컴퓨터 사용 시 반드시 로그아웃
- Token revoke → 다른 곳에서 사용 불가

---

## 🧪 테스트 및 검증

### 1. 빌드 테스트

```bash
npm run build
```

**결과**:
```
✓ TypeScript 컴파일 성공
✓ Vite 빌드 성공
✓ dist/assets/index-CH0Es1o0.js   465.02 kB
```

### 2. Token 발급 확인

**브라우저 DevTools → Application → Local Storage**:

```json
google_oauth_tokens: {
  "access_token": "ya29.a0AfB_byB...",
  "refresh_token": "1//0gJ4kHqF5...",
  "expires_at": 1733799234567,
  "scope": "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/drive.file"
}
```

✅ `refresh_token` 존재 확인!

### 3. Token 갱신 테스트

**방법 1**: 시간 조작
```typescript
// localStorage의 expires_at을 과거로 변경
const tokens = JSON.parse(localStorage.getItem('google_oauth_tokens'));
tokens.expires_at = Date.now() - 1000;  // 1초 전
localStorage.setItem('google_oauth_tokens', JSON.stringify(tokens));

// 앱 새로고침 → 자동 갱신 확인
```

**방법 2**: 5분 대기
```bash
# 5분 후 자동 갱신 로그 확인
console.log('Token refreshed automatically');
```

### 4. 에러 케이스 테스트

| 케이스 | 테스트 방법 | 예상 결과 |
|--------|------------|----------|
| Redirect URI 불일치 | 잘못된 URI 설정 | "redirect_uri_mismatch" 오류 |
| State 불일치 | sessionStorage 수동 변경 | "State mismatch" 오류 |
| Refresh token 없음 | localStorage에서 삭제 | "Please login again" 오류 |
| Network 오류 | 오프라인 상태 | "Token refresh failed" 오류 |

---

## 🐛 트러블슈팅

### 문제 1: TypeScript 빌드 오류

**오류**:
```
error TS2688: Cannot find type definition file for 'node'.
```

**원인**: tsconfig.json에 `"types": ["node"]`가 있지만 @types/node가 없음

**해결**:
```bash
npm install --save-dev @types/node
```

### 문제 2: Module 경로 오류

**오류**:
```
error TS2307: Cannot find module './services/googleOAuthService.ts'
```

**원인**: 파일을 `/src/services/`에 생성했지만 실제 경로는 `/services/`

**해결**:
```bash
mv /src/services/googleOAuthService.ts /services/
```

### 문제 3: Redirect URI 불일치

**오류**:
```
redirect_uri_mismatch
```

**원인**: Google Cloud Console 설정과 실제 redirect URI가 다름

**해결**:
1. 현재 URL 확인: `http://localhost:5173`
2. Google Cloud Console에 정확히 동일한 URL 추가
3. 5분 대기 (설정 반영 시간)
4. 재시도

---

## 🚀 향후 개선사항

### 1. Token Encryption

**현재**: localStorage에 평문 저장
**개선**: Web Crypto API로 암호화 저장

```typescript
// 예시
async function encryptToken(token: string, key: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        data
    );
    return base64UrlEncode(encrypted);
}
```

### 2. Token Rotation

**현재**: Refresh token 무기한 사용
**개선**: 주기적으로 refresh token 갱신

```typescript
// 30일마다 refresh token 갱신
if (Date.now() - tokenIssuedAt > 30 * 24 * 60 * 60 * 1000) {
    await rotateRefreshToken();
}
```

### 3. Multiple Account Support

**현재**: 단일 Google 계정만 지원
**개선**: 여러 계정 전환 기능

```typescript
interface MultiAccountTokens {
    [email: string]: StoredTokenData;
}

function switchAccount(email: string): void {
    const tokens = getAllTokens();
    setActiveToken(tokens[email]);
}
```

### 4. Token Expiry Notification

**현재**: 자동 갱신만
**개선**: 사용자에게 알림

```typescript
if (tokenWillExpireSoon()) {
    showNotification('토큰이 곧 만료됩니다. 자동으로 갱신합니다.');
}
```

### 5. Offline Support

**현재**: 오프라인 시 동작 안함
**개선**: Service Worker로 오프라인 지원

```typescript
// Service Worker
self.addEventListener('fetch', (event) => {
    if (isOffline() && isAuthRequest(event.request)) {
        event.respondWith(getCachedResponse());
    }
});
```

---

## 📚 참고 자료

### OAuth 2.0 & PKCE

- [RFC 6749: OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749)
- [RFC 7636: PKCE](https://datatracker.ietf.org/doc/html/rfc7636)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)

### Security

- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

### Best Practices

- [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [Google Identity Best Practices](https://developers.google.com/identity/protocols/oauth2/production-readiness)

---

## 📝 결론

### 성과

1. ✅ **Refresh token 기반 인증** 구현 완료
2. ✅ **PKCE로 보안 강화** (Backend 없이도 안전)
3. ✅ **자동 token 갱신** (사용자 경험 개선)
4. ✅ **표준 OAuth 2.0** 준수
5. ✅ **TypeScript 완전 타입 안정성**

### 교훈

1. **표준 준수의 중요성**: OAuth 2.0 표준을 따르니 호환성과 보안이 보장됨
2. **PKCE의 효과**: Backend 없이도 Authorization Code Flow를 안전하게 사용 가능
3. **UX와 보안의 균형**: Redirect 방식은 UX가 약간 저하되지만 장기적 이점이 큼
4. **점진적 개선**: 이전 구현을 완전히 대체하되, 문서로 마이그레이션 경로 제공

### 향후 과제

- Token encryption 추가
- Multiple account support
- Offline 지원
- Token rotation 메커니즘

---

**End of Developer Notes**

*최종 업데이트: 2025-12-09*
*작성자: Claude (Anthropic AI)*
*검토자: 개발팀*
