import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./app/lib/jwt";
import { is_dev } from "./app/config/envConfig";

const ALLOWED_ORIGINS = ["http://localhost:3001", "http://127.0.0.1:3001"];

const PUBLIC_PATHS = [
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/forgotPassword",
  "/api/auth/changePwd",
];

function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/api/tracking/")
  );
}

function addCorsHeaders(response: NextResponse, origin: string | null): void {
  if (is_dev) {
    // En desarrollo: permitir cualquier origen
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
  } else {
    // En producción: solo orígenes permitidos
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
  }
  response.headers.set("Access-Control-Allow-Credentials", "true");
}

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin");
  const pathname = new URL(request.url).pathname;

  // Handle preflight OPTIONS
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });

    if (is_dev) {
      response.headers.set("Access-Control-Allow-Origin", origin || "*");
    } else if (origin && ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Max-Age", "86400");

    return response;
  }

  // Public paths: solo añadir CORS, no validar auth
  if (isPublicPath(pathname)) {
    const response = NextResponse.next();
    addCorsHeaders(response, origin);
    return response;
  }

  // Protected paths: validar auth
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

  const token = header.slice(7); // quitamos la parte "Bearer "

  try {
    verifyAccessToken(token);
    const response = NextResponse.next();
    addCorsHeaders(response, origin);
    return response;
  } catch {
    // Token expirado o inválido → el cliente debe llamar a /api/auth/refresh
    const response = NextResponse.json(
      { error: "Token baliogabea edo iraungita" },
      { status: 401 }
    );
    addCorsHeaders(response, origin);
    return response;
  }
}

export const config = {
  // Aplica a TODAS las rutas /api/* para añadir CORS
  // La validación de auth se decide dentro de proxy() según isPublicPath()
  matcher: "/api/:path*",
};
