"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../lib/api/auth-api";
import { setAccessToken } from "../../lib/api/auth-token";
import { authKeys } from "../../query/keys/auth.keys";
import { meQueryOptions } from "../../query/options/auth.options";
import type { LoginRequest, LoginResponse } from "../../types/api/auth.types";
import type { AppError } from "../../types/api/common.types";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, AppError, LoginRequest>({
    mutationFn: login,
    onSuccess: async (response) => {
      setAccessToken(response.access_token);
      await queryClient.invalidateQueries({ queryKey: authKeys.all() });
      await queryClient.prefetchQuery(meQueryOptions());
    },
  });
}
