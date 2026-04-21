import { isNumber, isPackageValidStatus } from "@/app/lib/dto";
import { ValidationError } from "@/app/lib/errors";
import { UpdateStatusDto } from "../types";

export function updateStatusDto(body: unknown): UpdateStatusDto {
  if (typeof body !== "object" || body === null)
    throw new ValidationError("Request body must be an object");

  const { package_id, package_ids, new_status } = body as Record<
    string,
    unknown
  >;

  const hasPackageId = package_id !== undefined;
  const hasPackageIds = package_ids !== undefined;

  if (hasPackageId === hasPackageIds) {
    throw new ValidationError(
      "Provide exactly one of package_id or package_ids"
    );
  }

  if (hasPackageId && (!isNumber(package_id) || package_id < 1)) {
    throw new ValidationError("package_id must be a positive integer");
  }

  if (hasPackageIds) {
    if (!Array.isArray(package_ids) || package_ids.length === 0) {
      throw new ValidationError(
        "package_ids must be a non-empty array of positive integers"
      );
    }

    const uniqueIds = new Set<number>();
    for (const id of package_ids) {
      if (!isNumber(id) || id < 1) {
        throw new ValidationError(
          "package_ids must be a non-empty array of positive integers"
        );
      }
      uniqueIds.add(id);
    }

    if (uniqueIds.size !== package_ids.length) {
      throw new ValidationError("package_ids must not contain duplicates");
    }
  }

  if (!isPackageValidStatus(new_status))
    throw new ValidationError("new_status must be a valid package status");

  return hasPackageId
    ? { package_id: package_id as number, new_status }
    : { package_ids: package_ids as number[], new_status };
}
