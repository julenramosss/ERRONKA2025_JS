import type {
  PackageLogsRequest,
  PackageLogsResponse,
} from "../../types/api/log.types";
import { apiClient } from "./helpers/client";
import { omitUndefinedParams } from "./helpers/response-helpers";

export async function getPackageLogs({
  packageId,
  page,
  limit,
}: PackageLogsRequest): Promise<PackageLogsResponse> {
  const response = await apiClient.get<PackageLogsResponse>(
    "/logs/listByPackage",
    {
      params: omitUndefinedParams({
        packageId,
        page,
        limit,
      }),
    }
  );

  return response.data;
}
