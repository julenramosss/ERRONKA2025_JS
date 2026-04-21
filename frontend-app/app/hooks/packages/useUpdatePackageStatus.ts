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
      const packageIds =
        "package_ids" in variables && Array.isArray(variables.package_ids)
          ? variables.package_ids
          : typeof variables.package_id === "number"
            ? [variables.package_id]
            : [];

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: packagesKeys.myPackages() }),
        ...packageIds.map((packageId) =>
          queryClient.invalidateQueries({
            queryKey: packagesKeys.detail(packageId),
          })
        ),
        ...packageIds.map((packageId) =>
          queryClient.invalidateQueries({
            queryKey: logsKeys.package(packageId),
          })
        ),
        queryClient.invalidateQueries({ queryKey: routesKeys.all() }),
      ]);
    },
  });
}
