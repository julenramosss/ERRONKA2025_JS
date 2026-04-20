import { queryOptions } from "@tanstack/react-query";
import { getPackageLogs } from "../../lib/api/logs-api";
import { logsKeys } from "../keys/logs.keys";
import type { PackageLogsRequest } from "../../types/api/log.types";

const PACKAGE_LOGS_STALE_TIME = 5 * 60 * 1000;

export function packageLogsQueryOptions({
  packageId,
  page = 1,
  limit = 20,
}: PackageLogsRequest) {
  return queryOptions({
    queryKey: logsKeys.list(packageId, page, limit),
    queryFn: () => getPackageLogs({ packageId, page, limit }),
    staleTime: PACKAGE_LOGS_STALE_TIME,
  });
}
