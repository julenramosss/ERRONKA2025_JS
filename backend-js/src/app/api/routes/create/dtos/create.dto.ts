import { isNumber, isString, isValidPackage, isValidUser } from "@/app/lib/dto";
import { ValidationError } from "@/app/lib/errors";
import { CreateRouteDto } from "../types";

export async function validateCreateRouteDto(
  body: unknown
): Promise<CreateRouteDto> {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Invalid request body");
  }

  const { user_id, date, package_ids } = body as Record<string, unknown>;

  if (
    typeof user_id !== "number" ||
    !isNumber(user_id) ||
    !(await isValidUser(user_id))
  ) {
    throw new ValidationError(
      "user_id is required and must be a valid user ID"
    );
  }

  if (!isString(date) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ValidationError(
      "date is required and must be in YYYY-MM-DD format"
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const routeDate = new Date(date);
  if (routeDate <= today) {
    throw new ValidationError("Route date must be at least tomorrow");
  }

  if (!Array.isArray(package_ids) || package_ids.length === 0) {
    throw new ValidationError(
      "package_ids is required and must be a non-empty array"
    );
  }

  for (const id of package_ids) {
    if (
      typeof id !== "number" ||
      !isNumber(id) ||
      !(await isValidPackage(id))
    ) {
      throw new ValidationError("All package_ids must be valid package IDs");
    }
  }

  const unique = new Set<number>(package_ids as number[]);
  if (unique.size !== package_ids.length) {
    throw new ValidationError("package_ids must not contain duplicates");
  }

  return { user_id, date, package_ids: package_ids as number[] };
}
