import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./app/lib/jwt";
import { isDev } from "./app/config/envConfig";

const ALLOWED_ORIGINS = [
  "http://localhost:3001",
  "http://localhost:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3000",
  "http://10.23.26.64:3000",
  "http://10.23.26.64:3001",
];

const PUBLIC_PATHS = [
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/forgotPassword",
  "/api/auth/changePwd",
];

function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/api/tracking/")
  );
}

function addCorsHeaders(response: NextResponse, origin: string | null): void {
  if (isDev) {
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    if (origin) {
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
  } else if (!origin) {
    response.headers.set("Access-Control-Allow-Origin", "*");
  } else if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  response.headers.set("Vary", "Origin");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept, Origin, Cookie, X-CSRF-Token"
  );
}

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin");
  const pathname = request.nextUrl.pathname;

  console.log(
    "[PROXY]",
    request.method,
    pathname,
    "| Origin:",
    origin || "null"
  );

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    addCorsHeaders(response, origin);
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
  }

  if (isPublicPath(pathname)) {
    const response = NextResponse.next();
    addCorsHeaders(response, origin);
    return response;
  }

  // Protected paths require a Bearer access token.
  const header =
    request.headers.get("authorization") ??
    request.headers.get("Authorization");

  if (!header?.startsWith("Bearer ")) {
    const response = NextResponse.json(
      { error: "Authorization goiburua falta da" },
      { status: 401 }
    );
    addCorsHeaders(response, origin);
    return response;
  }

  try {
    verifyAccessToken(header.slice(7));
    const response = NextResponse.next();
    addCorsHeaders(response, origin);
    return response;
  } catch {
    // Token invalid or expired
    const response = NextResponse.json(
      { error: "Token baliogabea edo iraungita" },
      { status: 401 }
    );
    addCorsHeaders(response, origin);
    return response;
  }
}

export const config = {
  matcher: "/api/:path*",
};
