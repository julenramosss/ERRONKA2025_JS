import { queryOptions } from "@tanstack/react-query";
import { getPackageLogs } from "../../lib/api/logs-api";
import { logsKeys } from "../keys/logs.keys";
import type { PackageLogsRequest } from "../../utils/types/api/log.types";

const STALE_TIME = 10 * 60 * 1000;

export function packageLogsQueryOptions({
  packageId,
  page = 1,
  limit = 20,
}: PackageLogsRequest) {
  return queryOptions({
    queryKey: logsKeys.list(packageId, page, limit),
    queryFn: () => getPackageLogs({ packageId, page, limit }),
    staleTime: STALE_TIME,
  });
}
