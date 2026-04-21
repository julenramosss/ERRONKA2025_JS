import { queryOptions } from "@tanstack/react-query";
import { getMyDailyRoute } from "../../lib/api/routes-api";
import { routesKeys } from "../keys/routes.keys";

const STALE_TIME = 10 * 60 * 1000;

export function myDailyRouteQueryOptions(date?: string) {
  return queryOptions({
    queryKey: routesKeys.daily(date ?? "today"),
    queryFn: () => getMyDailyRoute(date),
    staleTime: STALE_TIME,
  });
}
