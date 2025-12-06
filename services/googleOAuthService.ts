/**
 * Google OAuth 2.0 Authorization Code Flow with PKCE
 *
 * PKCE (Proof Key for Code Exchange)를 사용하여 Backend 서버 없이도
 * refresh token을 안전하게 발급받을 수 있습니다.
 */

const OAUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const REVOKE_ENDPOINT = 'https://oauth2.googleapis.com/revoke';

interface TokenResponse {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

interface StoredTokenData {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    scope: string;
}

/**
 * PKCE를 위한 랜덤 문자열 생성
 */
function generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    return Array.from(randomValues)
        .map(v => charset[v % charset.length])
        .join('');
}

/**
 * SHA-256 해시 생성
 */
async function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
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
        .replace(/=/g, '');
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

/**
 * OAuth 인증 URL 생성 및 리다이렉트
 */
export async function initiateOAuthFlow(clientId: string, redirectUri: string, scopes: string[]): Promise<void> {
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
        code_challenge: challenge,
        code_challenge_method: 'S256',
        access_type: 'offline',  // ✅ refresh token 발급
        prompt: 'consent',       // ✅ 매번 consent 요청
        include_granted_scopes: 'true'
    });

    const authUrl = `${OAUTH_ENDPOINT}?${params.toString()}`;

    // 인증 페이지로 리다이렉트
    window.location.href = authUrl;
}

/**
 * Authorization Code를 Access Token으로 교환
 */
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
        code_verifier: codeVerifier
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

/**
 * Refresh Token을 사용하여 새로운 Access Token 발급
 */
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

/**
 * 토큰을 Local Storage에 안전하게 저장
 */
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

/**
 * Local Storage에서 토큰 데이터 불러오기
 */
export function getStoredTokenData(): StoredTokenData | null {
    const data = localStorage.getItem('google_oauth_tokens');
    if (!data) return null;

    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

/**
 * Refresh Token만 가져오기
 */
export function getStoredRefreshToken(): string | null {
    const tokenData = getStoredTokenData();
    return tokenData?.refresh_token || null;
}

/**
 * Access Token 유효성 확인
 */
export function isTokenExpired(): boolean {
    const tokenData = getStoredTokenData();
    if (!tokenData) return true;

    // 5분의 여유를 두고 만료 체크
    const BUFFER_TIME = 5 * 60 * 1000;
    return Date.now() >= (tokenData.expires_at - BUFFER_TIME);
}

/**
 * 토큰 자동 갱신 (필요시)
 */
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

/**
 * 로그아웃 (토큰 삭제 및 revoke)
 */
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
    localStorage.removeItem('googleApiSignedIn');
    localStorage.removeItem('googleTokenExpiresAt');
}

/**
 * URL에서 OAuth callback 파라미터 파싱
 */
export function parseOAuthCallback(): { code: string; state: string } | null {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

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

/**
 * 로그인 상태 확인
 */
export function isLoggedIn(): boolean {
    const tokenData = getStoredTokenData();
    return tokenData !== null && tokenData.refresh_token !== '';
}
