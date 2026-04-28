import { ForbiddenError, NotFoundError } from '@/app/lib/errors';
import { AccessTokenPayload } from '@/app/lib/types';
import { findPackageById } from '../repository/getPackageById.repo';
import { PackageWithAddress } from '../types';

export async function getPackageByIdService(
  id: number,
  auth: AccessTokenPayload
): Promise<PackageWithAddress> {
  const pkg = await findPackageById(id);
  if (!pkg) throw new NotFoundError('Package not found');

  if (auth.role === 'distributor' && pkg.assigned_to !== auth.sub) {
    throw new ForbiddenError('Access denied');
  }

  return pkg;
}
