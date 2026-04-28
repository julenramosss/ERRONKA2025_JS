import { ValidationError } from '@/app/lib/errors';

export interface GetByUserAndDateParams {
  user_id: number;
  date: string;
}

export function validateGetByUserAndDateDto(
  searchParams: URLSearchParams
): GetByUserAndDateParams {
  const userIdStr = searchParams.get('user_id');
  const date = searchParams.get('date');

  if (!userIdStr) throw new ValidationError('user_id is required');
  if (!date) throw new ValidationError('date is required');

  const user_id = parseInt(userIdStr, 10);
  if (isNaN(user_id) || user_id <= 0) {
    throw new ValidationError('user_id must be a positive integer');
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ValidationError('date must be in YYYY-MM-DD format');
  }

  return { user_id, date };
}
