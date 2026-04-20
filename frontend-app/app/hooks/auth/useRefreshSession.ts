"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refresh } from "../../lib/api/auth-api";
import { setAccessToken } from "../../lib/api/auth-token";
import { authKeys } from "../../query/keys/auth.keys";
import type { RefreshResponse } from "../../types/api/auth.types";
import type { AppError } from "../../types/api/common.types";

export function useRefreshSession() {
  const queryClient = useQueryClient();

  return useMutation<RefreshResponse, AppError, void>({
    mutationFn: refresh,
    onSuccess: async (response) => {
      setAccessToken(response.access_token);
      await queryClient.invalidateQueries({ queryKey: authKeys.all() });
    },
  });
}
