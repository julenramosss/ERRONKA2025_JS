import { isValidPackage } from '@/app/lib/dto';
import { ValidationError } from '@/app/lib/errors';
import { ListByPackageDto } from '../types';

export async function listByPackageDto(url: URL): Promise<ListByPackageDto> {
  const params = url.searchParams;

  const packageIdRaw = params.get('packageId');
  const pageRaw = params.get('page');
  const limitRaw = params.get('limit');

  if (packageIdRaw === null) {
    throw new ValidationError('packageId is required');
  }

  const packageId = parseInt(packageIdRaw, 10);
  if (isNaN(packageId) || packageId < 1) {
    throw new ValidationError('packageId must be a positive integer');
  }

  if (!(await isValidPackage(packageId))) {
    throw new ValidationError('packageId must be a valid package ID');
  }

  const page = pageRaw ? Math.max(1, parseInt(pageRaw, 10) || 1) : 1;
  const limit = limitRaw
    ? Math.min(100, Math.max(1, parseInt(limitRaw, 10) || 20))
    : 20;

  return { packageId, page, limit };
}
