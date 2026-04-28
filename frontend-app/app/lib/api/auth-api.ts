import type {
  ChangeMyPwdRequest,
  ChangeMyPwdResponse,
  ForgotPassword,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  RefreshResponse,
} from '../../utils/types/api/auth.types';
import { clearAccessToken } from './helpers/auth-token';
import { apiClient } from './helpers/client';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload);
  return response.data;
}

export async function logout(): Promise<LogoutResponse> {
  const response = await apiClient.post<LogoutResponse>('/auth/logout');
  clearAccessToken();
  return response.data;
}

export async function refresh(): Promise<RefreshResponse> {
  const response = await apiClient.post<RefreshResponse>('/auth/refresh');
  return response.data;
}

export async function getMe(): Promise<MeResponse> {
  const response = await apiClient.get<MeResponse>('/auth/me');
  return response.data;
}

export async function forgotPassword(email: string): Promise<ForgotPassword> {
  const response = await apiClient.post<ForgotPassword>(
    '/auth/forgotPassword',
    { email }
  );
  return response.data;
}

export async function changeMyPwd(
  payload: ChangeMyPwdRequest
): Promise<ChangeMyPwdResponse> {
  const response = await apiClient.patch<ChangeMyPwdResponse>(
    '/users/changeMyPwd',
    payload
  );

  return response.data;
}
