"use client";

import { useQuery } from "@tanstack/react-query";
import { trackingQueryOptions } from "../../query/options/tracking.options";

export function useTracking(trackingToken: string) {
  return useQuery(trackingQueryOptions(trackingToken));
}
