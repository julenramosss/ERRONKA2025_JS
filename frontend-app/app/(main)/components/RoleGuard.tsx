'use client';

import { notFound, redirect, usePathname } from 'next/navigation';
import { useMe } from '../../hooks/auth/useMe';
import {
  ALLOWED_ROLES,
  AllowedRolesPath,
  ROLE_GUARD_REDIRECTS,
} from '../types/allowedRoles';

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useMe();
  const pathname = usePathname();
  const allowedRolesForPath = pathname.split('/')[1] as AllowedRolesPath;

  if (isLoading || !user) return null;

  if (user && !ALLOWED_ROLES[allowedRolesForPath]?.includes(user.role)) {
    const redirectTo = ROLE_GUARD_REDIRECTS[allowedRolesForPath];
    if (redirectTo) {
      redirect(redirectTo);
    } else {
      notFound();
    }
  }

  return <>{children}</>;
}
