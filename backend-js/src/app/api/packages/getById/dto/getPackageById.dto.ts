import { ValidationError } from '@/app/lib/errors';
import { GetPackageByIdDto } from '../types';

export function getPackageByIdDto(url: URL): GetPackageByIdDto {
  const idRaw = url.searchParams.get('id');
  if (idRaw === null) throw new ValidationError('id is required');
  const id = parseInt(idRaw, 10);
  if (isNaN(id) || id < 1)
    throw new ValidationError('id must be a positive integer');
  return { id };
}
