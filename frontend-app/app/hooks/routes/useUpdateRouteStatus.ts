"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRouteStatus } from "../../lib/api/routes-api";
import { packagesKeys } from "../../query/keys/packages.keys";
import { routesKeys } from "../../query/keys/routes.keys";
import type {
  UpdateRouteStatusRequest,
  UpdateRouteStatusResponse,
} from "../../utils/types/api/route.types";
import type { AppError } from "../../utils/types/api/common.types";

interface UpdateRouteStatusVariables {
  routeId: number;
  payload: UpdateRouteStatusRequest;
}

export function useUpdateRouteStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateRouteStatusResponse,
    AppError,
    UpdateRouteStatusVariables
  >({
    mutationFn: ({ routeId, payload }) => updateRouteStatus(routeId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: routesKeys.all() }),
        queryClient.invalidateQueries({ queryKey: packagesKeys.all() }),
      ]);
    },
  });
}
