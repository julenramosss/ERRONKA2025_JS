import { ValidationError } from "@/app/lib/errors";
import { UserListFilters } from "../types";

export function validateListUsersDto(
  params: URLSearchParams
): UserListFilters {
  const filters: UserListFilters = {};

  const role = params.get("role");
  if (role !== null) {
    if (role !== "admin" && role !== "distributor") {
      throw new ValidationError("role ez da baliozkoa");
    }
    filters.role = role;
  }

  const isActive = params.get("is_active");
  if (isActive !== null) {
    if (isActive !== "true" && isActive !== "false") {
      throw new ValidationError("is_active 'true' edo 'false' izan behar du");
    }
    filters.is_active = isActive === "true";
  }

  return filters;
}
