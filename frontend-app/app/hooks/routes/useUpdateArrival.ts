"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateArrival } from "../../lib/api/routes-api";
import { routesKeys } from "../../query/keys/routes.keys";
import type {
  UpdateArrivalRequest,
  UpdateArrivalResponse,
} from "../../utils/types/api/route.types";
import type { AppError } from "../../utils/types/api/common.types";

export function useUpdateArrival() {
  const queryClient = useQueryClient();

  return useMutation<UpdateArrivalResponse, AppError, UpdateArrivalRequest>({
    mutationFn: updateArrival,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: routesKeys.all() });
    },
  });
}
