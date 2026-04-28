'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAccessToken } from '../lib/api/helpers/auth-token';

const PUBLIC_ROUTES = ['/login'];

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    const checkToken = async () => {
      const token = await getAccessToken();

      // Si estás en login y tienes token válido → redirigir a /
      if (isPublicRoute && token && isTokenValid(token)) {
        router.replace('/');
        return;
      }

      // Si estás en ruta protegida sin token → redirigir a login
      if (!isPublicRoute && (!token || !isTokenValid(token))) {
        sessionStorage.setItem('redirect_after_login', pathname);
        router.replace('/login');
      }
    };

    checkToken();
  }, [pathname, router, isPublicRoute]);

  return <>{children}</>;
}
