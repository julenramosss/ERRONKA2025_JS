import type { ApiErrorResponse } from "../../../utils/types/api/common.types";

export function omitUndefinedParams(
  params: Record<string, string | number | boolean | undefined>
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number | boolean>;
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybeError = value as Partial<ApiErrorResponse>;
  return typeof maybeError.error === "string";
}
