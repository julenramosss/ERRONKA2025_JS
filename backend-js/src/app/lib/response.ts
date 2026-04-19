import { secure } from "../config/envConfig";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from "./errors";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const res = {
  ok<T>(
    data: T,
    cookies?: { name: string; value: string; httpOnly?: boolean }[],
    deleteCookies?: string[]
  ): Response {
    const response = new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    if (cookies) {
      cookies.forEach(({ name, value, httpOnly = false }) => {
        const cookieStr = `${name}=${value}; Path=/; ${httpOnly ? "HttpOnly; " : ""}SameSite=Strict`;
        response.headers.append("Set-Cookie", cookieStr);
      });
    }

    if (deleteCookies) {
      deleteCookies.forEach((name) => {
        response.headers.append(
          "Set-Cookie",
          `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict ${secure};`
        );
      });
    }

    return response;
  },
  created<T>(data: T): Response {
    return jsonResponse(data, 201);
  },
  noContent(): Response {
    return new Response(null, { status: 204 });
  },
  validationError(message: string): Response {
    return jsonResponse({ error: message }, 400);
  },
  unauthorized(message = "Unauthorized"): Response {
    return jsonResponse({ error: message }, 401);
  },
  forbidden(message = "Forbidden"): Response {
    return jsonResponse({ error: message }, 403);
  },
  notFound(message = "Not found"): Response {
    return jsonResponse({ error: message }, 404);
  },
  conflict(message: string): Response {
    return jsonResponse({ error: message }, 409);
  },
  serverError(message = "Internal server error"): Response {
    return jsonResponse({ error: message }, 500);
  },
};

export function handleError(tag: string, error: unknown): Response {
  if (error instanceof ValidationError)
    return res.validationError(error.message);
  if (error instanceof UnauthorizedError)
    return res.unauthorized(error.message);
  if (error instanceof ForbiddenError) return res.forbidden(error.message);
  if (error instanceof NotFoundError) return res.notFound(error.message);
  if (error instanceof ConflictError) return res.conflict(error.message);
  console.error(tag, error);
  return res.serverError();
}
