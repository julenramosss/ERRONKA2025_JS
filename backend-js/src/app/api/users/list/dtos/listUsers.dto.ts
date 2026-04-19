import { ValidationError } from "@/app/lib/errors";
import { isUserRole } from "@/app/lib/dto";
import { UserListFilters } from "../types";
import { UserRole } from "@/app/types";

export function validateListUsersDto(params: URLSearchParams): UserListFilters {
  const filters: UserListFilters = {};

  const role = params.get("role");
  if (role !== null) {
    if (!isUserRole(role)) {
      throw new ValidationError("role must be one of: admin, distributor");
    }
    filters.role = role as UserRole;
  }

  const isActive = params.get("is_active");
  if (isActive !== null) {
    if (isActive !== "true" && isActive !== "false") {
      throw new ValidationError("is_active must be 'true' or 'false'");
    }
    filters.is_active = isActive === "true";
  }

  return filters;
}
