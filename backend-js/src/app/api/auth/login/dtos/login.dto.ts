import { ValidationError } from '@/app/lib/errors';
import { isEmail, isString } from '@/app/lib/dto';
import { LoginDto } from '../types';

export function validateLoginDto(body: unknown): LoginDto {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Invalid request body');
  }

  const { email, password } = body as Record<string, unknown>;
  if (!isEmail(email)) {
    throw new ValidationError(
      'email is required and must be a valid email address'
    );
  }

  if (!isString(password)) {
    throw new ValidationError('password is required');
  }
  return { email: email as string, password: password as string };
}
