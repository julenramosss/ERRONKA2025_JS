import axios, {
  AxiosHeaders,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import type { RefreshResponse } from "../../../types/api/auth.types";
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth-token";
import { toAppError } from "./errors";
import {
  API_BASE_URL,
  AUTH_LOGIN_PATH,
  AUTH_REFRESH_PATH,
  JSON_HEADERS,
  TRACKING_PATH_PREFIX,
} from "../../../config/envConfig";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function applyAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  accessToken: string
): void {
  const headers = AxiosHeaders.from(config.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  config.headers = headers;
}

function shouldSkipAuthRefresh(url?: string): boolean {
  if (!url) {
    return false;
  }

  return (
    url.includes(AUTH_LOGIN_PATH) ||
    url.includes(AUTH_REFRESH_PATH) ||
    url.includes(TRACKING_PATH_PREFIX)
  );
}

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: JSON_HEADERS,
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: JSON_HEADERS,
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<RefreshResponse>(AUTH_REFRESH_PATH)
      .then(({ data }) => {
        setAccessToken(data.access_token);
        return data.access_token;
      })
      .catch((error: unknown) => {
        clearAccessToken();
        throw toAppError(error);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();

  if (accessToken && !shouldSkipAuthRefresh(config.url)) {
    applyAuthorizationHeader(config, accessToken);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      shouldSkipAuthRefresh(originalRequest.url)
    ) {
      return Promise.reject(toAppError(error));
    }

    originalRequest._retry = true;

    try {
      const refreshedAccessToken = await refreshAccessToken();
      applyAuthorizationHeader(originalRequest, refreshedAccessToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      return Promise.reject(toAppError(refreshError));
    }
  }
);
