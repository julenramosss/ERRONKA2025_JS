import { isEmail } from '@/app/lib/dto';
import { ValidationError } from '@/app/lib/errors';

export function forgotPasswordDto(body: unknown): { email: string } {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('Invalid request body');
  }

  const { email } = body as Record<string, unknown>;

  if (!isEmail(email)) {
    throw new ValidationError('email is required and must be a valid email');
  }

  return { email: email as string };
}
