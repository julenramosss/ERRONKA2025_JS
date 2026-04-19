import {
  isEmail,
  isNumber,
  isPackageValidStatus,
  isString,
} from "@/app/lib/dto";
import { ValidationError } from "@/app/lib/errors";
import {
  UpdateAddressDto,
  UpdatePackageDto,
  UpdatePackageInput,
} from "../types";

export function updatePackageDto(
  idRaw: string | null,
  body: unknown
): UpdatePackageInput {
  if (idRaw === null) throw new ValidationError("id is required");
  const id = parseInt(idRaw, 10);
  if (isNaN(id) || id < 1)
    throw new ValidationError("id must be a positive integer");

  if (typeof body !== "object" || body === null)
    throw new ValidationError("Request body must be an object");

  const { packageInfo: rawPackage, address_info: rawAddress } = body as Record<
    string,
    unknown
  >;

  const packageInfo: UpdatePackageDto = {};
  const address_info: UpdateAddressDto = {};

  if (rawPackage !== undefined) {
    if (typeof rawPackage !== "object" || rawPackage === null)
      throw new ValidationError("packageInfo must be an object");

    const p = rawPackage as Record<string, unknown>;

    if (p.recipient_name !== undefined) {
      if (!isString(p.recipient_name))
        throw new ValidationError("recipient_name must be a non-empty string");
      packageInfo.recipient_name = p.recipient_name;
    }
    if (p.recipient_email !== undefined) {
      if (!isEmail(p.recipient_email))
        throw new ValidationError("recipient_email must be a valid email");
      packageInfo.recipient_email = p.recipient_email;
    }
    if (p.assigned_to !== undefined) {
      if (p.assigned_to !== null && !isNumber(p.assigned_to))
        throw new ValidationError("assigned_to must be a number or null");
      packageInfo.assigned_to = p.assigned_to as number | null;
    }
    if (p.status !== undefined) {
      if (!isPackageValidStatus(p.status))
        throw new ValidationError("status must be a valid package status");
      packageInfo.status = p.status;
    }
    if (p.weight_kg !== undefined) {
      if (!isNumber(p.weight_kg))
        throw new ValidationError("weight_kg must be a number");
      packageInfo.weight_kg = p.weight_kg;
    }
    if (p.description !== undefined) {
      if (!isString(p.description))
        throw new ValidationError("description must be a non-empty string");
      packageInfo.description = p.description;
    }
    if (p.estimated_delivery !== undefined) {
      if (!isString(p.estimated_delivery))
        throw new ValidationError("estimated_delivery must be a string");
      packageInfo.estimated_delivery = p.estimated_delivery;
    }
  }

  if (rawAddress !== undefined) {
    if (typeof rawAddress !== "object" || rawAddress === null)
      throw new ValidationError("address_info must be an object");

    const a = rawAddress as Record<string, unknown>;

    if (a.street !== undefined) {
      if (!isString(a.street))
        throw new ValidationError("street must be a non-empty string");
      address_info.street = a.street;
    }
    if (a.city !== undefined) {
      if (!isString(a.city))
        throw new ValidationError("city must be a non-empty string");
      address_info.city = a.city;
    }
    if (a.postal_code !== undefined) {
      if (!isString(a.postal_code))
        throw new ValidationError("postal_code must be a non-empty string");
      address_info.postal_code = a.postal_code;
    }
    if (a.latitude === undefined && a.longitude === undefined) {
      throw new ValidationError(
        "At least one of latitude or longitude must be provided when updating address coordinates"
      );
    }
    if (a.latitude !== undefined) {
      if (!isNumber(a.latitude))
        throw new ValidationError("latitude must be a number");
      address_info.latitude = a.latitude;
    }
    if (a.longitude !== undefined) {
      if (!isNumber(a.longitude))
        throw new ValidationError("longitude must be a number");
      address_info.longitude = a.longitude;
    }
    if (a.country !== undefined) {
      if (!isString(a.country))
        throw new ValidationError("country must be a non-empty string");
      address_info.country = a.country;
    }
  }

  const hasPackageFields = Object.keys(packageInfo).length > 0;
  const hasAddressFields = Object.keys(address_info).length > 0;

  if (!hasPackageFields && !hasAddressFields)
    throw new ValidationError("At least one field must be provided to update");

  return {
    id,
    packageInfo,
    addressInfo: hasAddressFields ? address_info : undefined,
  };
}
