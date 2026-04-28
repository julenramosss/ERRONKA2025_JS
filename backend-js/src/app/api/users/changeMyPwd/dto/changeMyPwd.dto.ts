import { ValidationError } from '@/app/lib/errors';
import { isString } from '@/app/lib/dto';
import { ChangeMyPwdDto } from '../types';

export function validateChangeMyPwdDto(body: unknown): ChangeMyPwdDto {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Invalid request body');
  }

  const { current_password, new_password } = body as Record<string, unknown>;

  if (!isString(current_password)) {
    throw new ValidationError('current_password is required');
  }

  if (!isString(new_password) || new_password.length < 6) {
    throw new ValidationError('new_password must be at least 6 characters');
  }

  if (current_password === new_password) {
    throw new ValidationError(
      'new_password must be different from current_password'
    );
  }

  return {
    currentPassword: current_password,
    newPassword: new_password,
  };
}
