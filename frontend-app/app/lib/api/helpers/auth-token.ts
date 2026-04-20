import { ACCESS_TOKEN_STORAGE_KEY } from "../../../config/envConfig";

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  const storage = getSessionStorage();

  if (!storage) {
    return null;
  }

  return storage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(accessToken: string): void {
  const storage = getSessionStorage();

  if (!storage) {
    return;
  }

  storage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

export function clearAccessToken(): void {
  const storage = getSessionStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}
