import { AccessTokenPayload } from "@/app/lib/types";
import { USER_ROLES } from "@/app/types";
import { listByPackageRepo } from "../repository/listByPackage.repo";
import { ListByPackageDto, ListByPackageResult } from "../types";

export async function listByPackageService(
  filters: ListByPackageDto,
  caller: AccessTokenPayload
): Promise<ListByPackageResult> {
  const { packageId, page, limit } = filters;

  const assignedTo =
    caller.role === USER_ROLES.distributor ? caller.sub : undefined;

  return listByPackageRepo(packageId, page, limit, assignedTo);
}
