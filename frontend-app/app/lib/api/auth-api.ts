import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  RefreshResponse,
} from "../../types/api/auth.types";
import { apiClient } from "./helpers/client";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

export async function logout(): Promise<LogoutResponse> {
  const response = await apiClient.post<LogoutResponse>("/auth/logout");
  return response.data;
}

export async function refresh(): Promise<RefreshResponse> {
  const response = await apiClient.post<RefreshResponse>("/auth/refresh");
  return response.data;
}

export async function getMe(): Promise<MeResponse> {
  const response = await apiClient.get<MeResponse>("/auth/me");
  return response.data;
}
