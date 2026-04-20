import { queryOptions } from "@tanstack/react-query";
import { getMyDailyRoute } from "../../lib/api/routes-api";
import { routesKeys } from "../keys/routes.keys";

const DAILY_ROUTE_STALE_TIME = 2 * 60 * 1000;

export function myDailyRouteQueryOptions(date?: string) {
  return queryOptions({
    queryKey: routesKeys.daily(date ?? "today"),
    queryFn: () => getMyDailyRoute(date),
    staleTime: DAILY_ROUTE_STALE_TIME,
  });
}
