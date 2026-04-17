import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./app/lib/jwt";

export function middleware(request: NextRequest) {
  const header =
    request.headers.get("authorization") ??
    request.headers.get("Authorization");

  if (!header?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Authorization goiburua falta da" },
      { status: 401 }
    );
  }

  const token = header.slice(7);

  try {
    verifyAccessToken(token);
    return NextResponse.next();
  } catch {
    // Token expirado o inválido → el cliente debe llamar a /api/auth/refresh
    return NextResponse.json(
      { error: "Token baliogabea edo iraungita" },
      { status: 401 }
    );
  }
}

export const config = {
  // Protege todas las rutas /api/* EXCEPTO /api/auth/*
  matcher: [
    "/api/((?!auth/).*)",
    "/api/tracking/getByToken",
    "/api/users/changePwd",
  ],
};
