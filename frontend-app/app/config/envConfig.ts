export const isDev = process.env.NODE_ENV !== "production";

export const API_BASE_URL = isDev
  ? process.env.NEXT_PUBLIC_API_BASE_URL!
  : "https://api.tolosaerronka.es/api";
export const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY!;

export const JSON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
export const AUTH_REFRESH_PATH = "/auth/refresh";
export const AUTH_LOGIN_PATH = "/auth/login";
export const AUTH_FORGOT_PASSWORD_PATH = "/auth/forgotPassword";
export const TRACKING_PATH_PREFIX = "/tracking/";

export const ACCESS_TOKEN_STORAGE_KEY = "access_token";
