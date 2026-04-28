import { ValidationError } from '@/app/lib/errors';
import {
  isBoolean,
  isEmail,
  isPositiveInteger,
  isString,
  isUserRole,
} from '@/app/lib/dto';
import { UpdateUserDto } from '../types';

export function validateUpdateUserDto(body: unknown): UpdateUserDto {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Invalid request body');
  }
  const { id, name, email, role, is_active } = body as Record<string, unknown>;

  if (!isPositiveInteger(id)) {
    throw new ValidationError('id must be a positive integer');
  }

  const dto: UpdateUserDto = { id, user: {} };

  if (name !== undefined) {
    if (!isString(name)) {
      throw new ValidationError('name must be a non-empty string');
    }
    dto.user = { ...dto.user, name: name as string };
  }

  if (email !== undefined) {
    if (!isEmail(email)) {
      throw new ValidationError('email must be a valid email address');
    }
    dto.user = { ...dto.user, email: email as string };
  }

  if (is_active !== undefined) {
    if (!isBoolean(is_active)) {
      throw new ValidationError('is_active must be a boolean');
    }
    dto.user = { ...dto.user, is_active };
  }

  if (role !== undefined) {
    if (!isUserRole(role)) {
      throw new ValidationError('role must be one of: admin, distributor');
    }
    dto.user = { ...dto.user, role };
  }

  if (
    dto.user.name === undefined &&
    dto.user.email === undefined &&
    dto.user.is_active === undefined &&
    dto.user.role === undefined
  ) {
    throw new ValidationError('at least one field must be provided to update');
  }

  return {
    id: dto.id,
    user: dto.user,
  };
}
