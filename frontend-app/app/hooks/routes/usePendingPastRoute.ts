"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  continueFromPast,
  getPendingPastRoute,
} from "../../lib/api/routes-api";
import { packagesKeys } from "../../query/keys/packages.keys";
import { routesKeys } from "../../query/keys/routes.keys";
import type {
  ContinueFromPastResponse,
  GetPendingPastRouteResponse,
} from "../../utils/types/api/route.types";
import type { AppError } from "../../utils/types/api/common.types";

export function usePendingPastRoute() {
  return useQuery<GetPendingPastRouteResponse, AppError>({
    queryKey: routesKeys.pendingPast(),
    queryFn: getPendingPastRoute,
    staleTime: 60 * 1000,
  });
}

export function useContinueFromPast() {
  const queryClient = useQueryClient();

  return useMutation<ContinueFromPastResponse, AppError>({
    mutationFn: continueFromPast,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: routesKeys.all() }),
        queryClient.invalidateQueries({ queryKey: packagesKeys.all() }),
      ]);
    },
  });
}
