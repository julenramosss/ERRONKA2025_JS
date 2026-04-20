"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../lib/api/auth-api";
import { clearAccessToken } from "../../lib/api/auth-token";
import { authKeys } from "../../query/keys/auth.keys";
import { logsKeys } from "../../query/keys/logs.keys";
import { packagesKeys } from "../../query/keys/packages.keys";
import { routesKeys } from "../../query/keys/routes.keys";
import type { LogoutResponse } from "../../types/api/auth.types";
import type { AppError } from "../../types/api/common.types";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<LogoutResponse, AppError, void>({
    mutationFn: logout,
    onSettled: () => {
      clearAccessToken();
      queryClient.removeQueries({ queryKey: authKeys.all() });
      queryClient.removeQueries({ queryKey: packagesKeys.all() });
      queryClient.removeQueries({ queryKey: logsKeys.all() });
      queryClient.removeQueries({ queryKey: routesKeys.all() });
    },
  });
}
