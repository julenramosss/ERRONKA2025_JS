import { queryOptions } from "@tanstack/react-query";
import { getTracking } from "../../lib/api/tracking-api";
import { trackingKeys } from "../keys/tracking.keys";

const TRACKING_STALE_TIME = 5 * 60 * 1000;

export function trackingQueryOptions(trackingToken: string) {
  return queryOptions({
    queryKey: trackingKeys.detail(trackingToken),
    queryFn: () => getTracking(trackingToken),
    staleTime: TRACKING_STALE_TIME,
  });
}
