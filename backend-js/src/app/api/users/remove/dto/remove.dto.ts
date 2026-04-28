import { ValidationError } from '@/app/lib/errors';
import { isPositiveInteger, isValidUser } from '@/app/lib/dto';
import { RemoveUserDto } from '../types';
import { AccessTokenPayload } from '../../../../lib/types';

export async function removeUserDto(
  url: URL,
  user: AccessTokenPayload
): Promise<RemoveUserDto> {
  const idRaw = url.searchParams.get('id');
  if (idRaw === null) throw new ValidationError('id is required');

  const id = Number(idRaw);
  if (id === user.sub) {
    throw new ValidationError('users cannot remove themselves');
  }

  if (!isPositiveInteger(id) || !(await isValidUser(id))) {
    throw new ValidationError('id must be a positive integer and a valid user');
  }

  return { id };
}
