import { ValidationError } from '@/app/lib/errors';
import { isString } from '@/app/lib/dto';
import { RefreshDto } from '../types';

export function validateRefreshDto(body: unknown): RefreshDto {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Invalid request body');
  }
  const { refresh_token } = body as Record<string, unknown>;
  if (!isString(refresh_token)) {
    throw new ValidationError('refresh_token is required');
  }
  return { refresh_token: refresh_token as string };
}
