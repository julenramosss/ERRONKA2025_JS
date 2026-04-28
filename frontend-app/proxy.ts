import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_STORAGE_KEY } from './app/config/envConfig';

const PUBLIC_ROUTES = ['/login'];

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const payloadB64 = token.split('.')[1];
    if (!payloadB64) return null;
    // atob works in Edge runtime
    const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
}

function isTokenValid(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken =
    request.cookies.get(ACCESS_TOKEN_STORAGE_KEY)?.value || null;
  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r);

  // Si está en una ruta pública y ya tiene token válido → al inicio
  if (isPublic && accessToken && isTokenValid(accessToken)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si está en una ruta protegida sin token o con token caducado → al login
  if (!isPublic && (!accessToken || !isTokenValid(accessToken))) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Guardamos la ruta original en una cookie efímera (no visible en la URL)
    response.cookies.set('redirect_to', pathname, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 300, // 5 minutos, suficiente para hacer login
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Excluye:
     * - _next/static, _next/image (assets de Next)
     * - favicon.ico, archivos públicos con extensión
     * - /api/* (las llamadas a la API no pasan por aquí)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)',
  ],
};
