import { isNumber, isPackageValidStatus } from "@/app/lib/dto";
import { ValidationError } from "@/app/lib/errors";
import { UpdateStatusDto } from "../types";

export function updateStatusDto(body: unknown): UpdateStatusDto {
  if (typeof body !== "object" || body === null)
    throw new ValidationError("Request body must be an object");

  const { package_id, new_status } = body as Record<string, unknown>;

  if (!isNumber(package_id) || package_id < 1)
    throw new ValidationError("package_id must be a positive integer");

  if (!isPackageValidStatus(new_status))
    throw new ValidationError("new_status must be a valid package status");

  return { package_id, new_status };
}
