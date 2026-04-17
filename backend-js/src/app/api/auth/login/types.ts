import { UserRole } from "@/app/lib/jwt";

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

export interface LoginResponse {
  user: AuthenticatedUser;
  access_token: string;
  refresh_token: string;
}