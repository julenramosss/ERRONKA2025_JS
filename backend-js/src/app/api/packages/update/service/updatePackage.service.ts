import { NotFoundError, ValidationError } from "@/app/lib/errors";
import { applyPackageStatusSideEffects } from "@/app/lib/packageStatus/packageStatusSideEffects.service";
import {
  findPackageById,
  updateAddressFields,
  updatePackageFields,
  validateDistributorExists,
} from "../repository/updatePackage.repo";
import {
  PackageWithAddress,
  UpdateAddressDto,
  UpdatePackageDto,
} from "../types";
import { mapsService } from "@/app/lib/maps/maps.service";

export async function updatePackageService(
  id: number,
  packageInfo: UpdatePackageDto,
  addressInfo: UpdateAddressDto | undefined,
  changedBy: number
): Promise<PackageWithAddress> {
  const current = await findPackageById(id);
  if (!current) throw new NotFoundError("Package not found");

  const resolvedPackageInfo = { ...packageInfo };

  if (
    resolvedPackageInfo.assigned_to !== undefined &&
    resolvedPackageInfo.assigned_to !== null
  ) {
    const valid = await validateDistributorExists(
      resolvedPackageInfo.assigned_to
    );
    if (!valid) {
      throw new ValidationError(
        "assigned_to must be an existing active distributor"
      );
    }
    if (
      current.status === "pending" &&
      resolvedPackageInfo.status === undefined
    ) {
      resolvedPackageInfo.status = "assigned";
    }
  }

  const oldStatus = current.status;
  const newStatus = resolvedPackageInfo.status;

  if (Object.keys(resolvedPackageInfo).length > 0) {
    await updatePackageFields(id, resolvedPackageInfo);
  }

  if (addressInfo && Object.keys(addressInfo).length > 0) {
    const sets: string[] = [];
    const params: unknown[] = [];

    const { lat, lng } = await mapsService.geocodeAddress(
      `${addressInfo.street ?? current.street}, ${addressInfo.city ?? current.city}, ${addressInfo.postal_code ?? current.postal_code}`
    );

    if (addressInfo.street !== undefined) {
      sets.push("street = ?");
      params.push(addressInfo.street);
    }
    if (addressInfo.city !== undefined) {
      sets.push("city = ?");
      params.push(addressInfo.city);
    }
    if (addressInfo.postal_code !== undefined) {
      sets.push("postal_code = ?");
      params.push(addressInfo.postal_code);
    }
    if (addressInfo.country !== undefined) {
      sets.push("country = ?");
      params.push(addressInfo.country);
    }
    sets.push("latitude = ?", "longitude = ?");
    params.push(lat, lng);

    params.push(current.address_id);

    await updateAddressFields(sets, params);
  }

  if (newStatus !== undefined && newStatus !== oldStatus) {
    await applyPackageStatusSideEffects(
      [{ packageId: id, oldStatus, newStatus }],
      changedBy,
      {
        defaultDistributorId:
          resolvedPackageInfo.assigned_to ?? current.assigned_to,
      }
    );
  }

  const updated = await findPackageById(id);
  return updated!;
}
