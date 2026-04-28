import { SECURE } from '../../../config/envConfig';
import { ACCESS_TOKEN_STORAGE_KEY } from '../../../config/envConfig';

// Access token lifetime in seconds — must match JWT expiry on the backend
const COOKIE_MAX_AGE = 15 * 60; // 15 minutes

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Strict${SECURE}`;
}

function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict${SECURE}`;
}

export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(accessToken: string): void {
  setCookie(ACCESS_TOKEN_STORAGE_KEY, accessToken, COOKIE_MAX_AGE);
}

export function clearAccessToken(): void {
  deleteCookie(ACCESS_TOKEN_STORAGE_KEY);
}
