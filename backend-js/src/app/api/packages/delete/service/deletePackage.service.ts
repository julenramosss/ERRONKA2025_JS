import { NotFoundError, ValidationError } from '@/app/lib/errors';
import {
  deleteAddressById,
  deletePackageById,
  findPackageById,
} from '../repository/deletePackage.repo';

export async function deletePackageService(id: number): Promise<void> {
  const pkg = await findPackageById(id);
  if (!pkg) throw new NotFoundError('Package not found');

  if (pkg.status !== 'pending') {
    throw new ValidationError(
      'Package can only be deleted when status is pending'
    );
  }

  await deletePackageById(id);
  await deleteAddressById(pkg.address_id);
}
