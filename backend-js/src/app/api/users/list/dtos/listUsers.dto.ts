import { ValidationError } from '@/app/lib/errors';
import { isUserRole } from '@/app/lib/dto';
import { UserListFilters } from '../types';
import { UserRole } from '@/app/types';

export function validateListUsersDto(params: URLSearchParams): UserListFilters {
  const filters: Partial<UserListFilters> = {};

  const role = params.get('role');
  if (role !== null) {
    if (!isUserRole(role)) {
      throw new ValidationError('role must be one of: admin, distributor');
    }
    filters.role = role as UserRole;
  }

  const isActive = params.get('is_active');
  if (isActive !== null) {
    if (isActive !== 'true' && isActive !== 'false') {
      throw new ValidationError("is_active must be 'true' or 'false'");
    }
    filters.is_active = isActive === 'true';
  }

  const pageRaw = params.get('page');
  const limitRaw = params.get('limit');
  const page = pageRaw ? Math.max(1, parseInt(pageRaw, 10) || 1) : 1;
  const limit = limitRaw
    ? Math.min(100, Math.max(1, parseInt(limitRaw, 10) || 20))
    : 20;

  return { ...filters, page, limit };
}
