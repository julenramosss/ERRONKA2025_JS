'use client';

import { useMutation } from '@tanstack/react-query';
import { changeMyPwd } from '../../lib/api/auth-api';
import type {
  ChangeMyPwdRequest,
  ChangeMyPwdResponse,
} from '../../utils/types/api/auth.types';
import type { AppError } from '../../utils/types/api/common.types';

export function useChangeMyPwd() {
  return useMutation<ChangeMyPwdResponse, AppError, ChangeMyPwdRequest>({
    mutationFn: changeMyPwd,
  });
}
