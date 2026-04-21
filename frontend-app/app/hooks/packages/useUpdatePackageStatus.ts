"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePackageStatus } from "../../lib/api/packages-api";
import { logsKeys } from "../../query/keys/logs.keys";
import { packagesKeys } from "../../query/keys/packages.keys";
import { routesKeys } from "../../query/keys/routes.keys";
import type {
  UpdatePackageStatusRequest,
  UpdatePackageStatusResponse,
} from "../../utils/types/api/package.types";
import type { AppError } from "../../utils/types/api/common.types";

export function useUpdatePackageStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdatePackageStatusResponse,
    AppError,
    UpdatePackageStatusRequest
  >({
    mutationFn: updatePackageStatus,
    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: packagesKeys.myPackages() }),
        queryClient.invalidateQueries({
          queryKey: packagesKeys.detail(variables.package_id),
        }),
        queryClient.invalidateQueries({
          queryKey: logsKeys.package(variables.package_id),
        }),
        queryClient.invalidateQueries({ queryKey: routesKeys.all() }),
      ]);
    },
  });
}
