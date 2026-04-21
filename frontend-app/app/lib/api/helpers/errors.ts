import axios from "axios";
import type { AppError } from "../../../utils/types/api/common.types";
import { isApiErrorResponse } from "./response-helpers";

export function isAppError(error: unknown): error is AppError {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const maybeError = error as Partial<AppError>;

  return (
    typeof maybeError.message === "string" &&
    typeof maybeError.isNetworkError === "boolean"
  );
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const payload = error.response?.data;
    const status = error.response?.status;
    const message = isApiErrorResponse(payload)
      ? payload.error
      : error.message || "Unexpected API error";

    return {
      message,
      status,
      isNetworkError: !error.response,
      payload,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      isNetworkError: false,
    };
  }

  return {
    message: "Unexpected API error",
    isNetworkError: false,
    payload: error,
  };
}
