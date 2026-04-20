import {
  CreateAddressInfoDto,
  CreatePackageDto,
  CreatedPackageResult,
} from "../types";
import {
  addPackageIdToToken,
  createAddress,
  createPackage,
  createPackageLog,
  createPackageToken,
} from "../repository/createPackage.repo";
import { SendPackageTrackingEmailParams } from "@/app/types";
import { sendPackageTrackingEmail } from "@/app/lib/email/sendPackageTrackingEmail";
import { tracking_base_url } from "@/app/config/envConfig";
import { mapsService } from "@/app/lib/maps/maps.service";

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

  const params: SendPackageTrackingEmailParams = {
    recipientEmail: createdPackage.recipient_email,
    recipientName: createdPackage.recipient_name,
    trackingUrl: `${tracking_base_url}/${createdToken.token}`,
    packageStatus: createdPackage.status,
    estimatedDelivery: createdPackage.estimated_delivery,
  };

  await sendPackageTrackingEmail(params);
  return createdPackage;
}
