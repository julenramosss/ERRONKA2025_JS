import { USER_ROLES, UserRole } from '../../utils/types';

export const ALLOWED_ROLES = {
  dashboard: [USER_ROLES.distributor] as UserRole[],
  myPackages: [USER_ROLES.distributor] as UserRole[],
  myRoute: [USER_ROLES.distributor] as UserRole[],
  history: [USER_ROLES.distributor] as UserRole[],
  settings: [USER_ROLES.distributor, USER_ROLES.admin] as UserRole[],
};

export type AllowedRolesPath = keyof typeof ALLOWED_ROLES;
export type AllowedRoles = typeof ALLOWED_ROLES;

// Rutas que redirigen a otra página en lugar de mostrar 404
export const ROLE_GUARD_REDIRECTS: Partial<Record<AllowedRolesPath, string>> = {
  dashboard: '/settings',
};
