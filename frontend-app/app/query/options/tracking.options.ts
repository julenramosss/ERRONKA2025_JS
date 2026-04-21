import { queryOptions } from "@tanstack/react-query";
import { getTracking } from "../../lib/api/tracking-api";
import { trackingKeys } from "../keys/tracking.keys";

const STALE_TIME = 10 * 60 * 1000;

export function trackingQueryOptions(trackingToken: string) {
  return queryOptions({
    queryKey: trackingKeys.detail(trackingToken),
    queryFn: () => getTracking(trackingToken),
    staleTime: STALE_TIME,
  });
}
