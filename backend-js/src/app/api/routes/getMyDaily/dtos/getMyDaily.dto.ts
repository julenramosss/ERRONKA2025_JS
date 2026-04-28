import { ValidationError } from '@/app/lib/errors';

export interface GetMyDailyDto {
  date: string;
  allowFutureFallback: boolean;
}

export function validateGetMyDailyDto(
  searchParams: URLSearchParams
): GetMyDailyDto {
  const date = searchParams.get('date');

  if (date !== null) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new ValidationError('date must be in YYYY-MM-DD format');
    }
    return { date, allowFutureFallback: false };
  }

  return {
    date: new Date().toISOString().slice(0, 10),
    allowFutureFallback: true,
  };
}
