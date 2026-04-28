import {
  CreateAddressInfoDto,
  CreatePackageDto,
  CreatedPackageResult,
} from '../types';
import {
  addPackageIdToToken,
  createAddress,
  createPackage,
  createPackageLog,
  createPackageToken,
} from '../repository/createPackage.repo';
import { mapsService } from '@/app/lib/maps/maps.service';
import { applyPackageStatusSideEffects } from '../../../../lib/packageStatus/packageStatusSideEffects.service';

export async function createPackageService(
  packageInfo: CreatePackageDto,
  address_info: CreateAddressInfoDto
): Promise<CreatedPackageResult> {
  const { lat, lng } = await mapsService.geocodeAddress(
    `${address_info.street}, ${address_info.city}, ${address_info.postal_code}` // => "123 Main St, Anytown, 12345"
  );

  const address_info_with_coords = {
    ...address_info,
    latitude: lat,
    longitude: lng,
  };

  const createdAddress = await createAddress(address_info_with_coords);

  const createdToken = await createPackageToken();

  const { createdPackage } = await createPackage(packageInfo, createdAddress);

  await addPackageIdToToken(createdToken.id, createdPackage.id);

  await createPackageLog(createdPackage);

  await applyPackageStatusSideEffects(
    [
      {
        packageId: createdPackage.id,
        oldStatus: null,
        newStatus: createdPackage.status,
      },
    ],
    createdPackage.created_by
  );

  return createdPackage;
}
