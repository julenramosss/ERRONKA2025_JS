export type ApiDateString = string;
export type ApiDateTimeString = string;
export type ApiTimeString = string;

export interface ApiErrorResponse {
  error: string;
}

export interface AppError {
  message: string;
  status?: number;
  isNetworkError: boolean;
  payload?: unknown;
}
