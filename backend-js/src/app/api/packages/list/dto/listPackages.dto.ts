import { isPackageValidStatus } from '@/app/lib/dto';
import { ValidationError } from '@/app/lib/errors';
import { ListPackagesFilters } from '../types';

export function listPackagesDto(url: URL): ListPackagesFilters {
  const params = url.searchParams;

  const statusRaw = params.get('status');
  const assignedToRaw = params.get('assigned_to');
  const cityRaw = params.get('city');
  const pageRaw = params.get('page');
  const limitRaw = params.get('limit');

  let status: ListPackagesFilters['status'];
  if (statusRaw !== null) {
    if (!isPackageValidStatus(statusRaw))
      throw new ValidationError('status must be a valid package status');
    status = statusRaw;
  }

  let assigned_to: number | undefined;
  if (assignedToRaw !== null) {
    const parsed = parseInt(assignedToRaw, 10);
    if (isNaN(parsed) || parsed < 1)
      throw new ValidationError('assigned_to must be a positive integer');
    assigned_to = parsed;
  }

  const city = cityRaw ?? undefined;

  const page = pageRaw ? Math.max(1, parseInt(pageRaw, 10) || 1) : 1;
  const limit = limitRaw
    ? Math.min(100, Math.max(1, parseInt(limitRaw, 10) || 20))
    : 20;

  return { status, assigned_to, city, page, limit };
}
