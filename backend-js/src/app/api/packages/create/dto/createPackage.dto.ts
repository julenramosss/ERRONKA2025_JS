import {
  isEmail,
  isNumber,
  isPackageValidStatus,
  isString,
  isValidUser,
} from "@/app/lib/dto";
import { CreateAddressInfoDto, CreatePackageDto } from "../types";
import { ValidationError } from "@/app/lib/errors";

export async function createPackageDto(body: unknown): Promise<{
  packageInfo: CreatePackageDto;
  address_info: CreateAddressInfoDto;
}> {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Invalid request body");
  }

  const { packageInfo, address_info } = body as Record<string, unknown>;

  if (typeof packageInfo !== "object" || packageInfo === null)
    throw new ValidationError("packageInfo is required");
  if (typeof address_info !== "object" || address_info === null)
    throw new ValidationError("address_info is required");

  const {
    recipient_name,
    recipient_email,
    assigned_to,
    created_by,
    status,
    weight_kg,
    description,
  } = packageInfo as CreatePackageDto;

  const { street, city, postal_code } = address_info as CreateAddressInfoDto;

  if (!isString(recipient_name))
    throw new ValidationError(
      "recipient_name is required and must be a non-empty string"
    );

  if (!isEmail(recipient_email))
    throw new ValidationError(
      "recipient_email is required and must be a valid email"
    );

  if (
    assigned_to !== null &&
    (!isNumber(assigned_to) || !(await isValidUser(assigned_to)))
  )
    throw new ValidationError("assigned_to must be a valid user ID");

  if (!isNumber(created_by) || !(await isValidUser(created_by)))
    throw new ValidationError(
      "created_by is required and must be a valid user ID"
    );

  if (!isPackageValidStatus(status))
    throw new ValidationError(
      "status is required and must be a valid package status"
    );

  if (!isNumber(weight_kg))
    throw new ValidationError(
      "weight_kg is required and must be a valid number"
    );

  if (description && !isString(description))
    throw new ValidationError(
      "description must be a non-empty string if provided"
    );

  if (!isString(street))
    throw new ValidationError(
      "street is required and must be a non-empty string"
    );

  if (!isString(city))
    throw new ValidationError(
      "city is required and must be a non-empty string"
    );

  if (!isString(postal_code))
    throw new ValidationError(
      "postal_code is required and must be a non-empty string"
    );

  return {
    packageInfo: packageInfo as CreatePackageDto,
    address_info: address_info as CreateAddressInfoDto,
  };
}
