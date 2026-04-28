'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../../lib/api/auth-api';
import { setAccessToken } from '../../lib/api/helpers/auth-token';
import { AppError } from '../../utils/types/api/common.types';
import { LoginRequest, LoginResponse } from '../../utils/types/api/auth.types';
import { meQueryOptions } from '../../query/options/auth.options';
import { authKeys } from '../../query/keys/auth.keys';

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
