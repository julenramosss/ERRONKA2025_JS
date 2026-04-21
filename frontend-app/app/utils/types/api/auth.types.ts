import type { ApiDateTimeString } from "./common.types";

export type UserRole = "admin" | "distributor";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  access_token: string;
}

export interface RefreshResponse {
  access_token: string;
}

export interface LogoutResponse {
  message: string;
}

export interface MeResponse extends AuthUser {
  created_at: ApiDateTimeString;
}

export interface ForgotPassword {
  message: string;
}
