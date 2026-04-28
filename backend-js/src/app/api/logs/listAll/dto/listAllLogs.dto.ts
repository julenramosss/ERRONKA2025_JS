import { isNumber, isValidPackage, isValidUser } from '@/app/lib/dto';
import { ValidationError } from '@/app/lib/errors';
import { ListAllLogsDto } from '../types';

export async function listAllLogsDto(url: URL): Promise<ListAllLogsDto> {
  const params = url.searchParams;

  const packageIdRaw = params.get('packageId');
  const changedByRaw = params.get('changedBy');
  const fromDateRaw = params.get('fromDate');
  const toDateRaw = params.get('toDate');
  const pageRaw = params.get('page');
  const limitRaw = params.get('limit');

  const packageIdParsed =
    packageIdRaw !== null ? parseInt(packageIdRaw, 10) : undefined;
  if (
    packageIdParsed !== undefined &&
    (!isNumber(packageIdParsed) || !(await isValidPackage(packageIdParsed)))
  ) {
    throw new ValidationError('packageId must be a valid package ID');
  }

  const changedByParsed =
    changedByRaw !== null ? parseInt(changedByRaw, 10) : undefined;
  if (
    changedByParsed !== undefined &&
    (!isNumber(changedByParsed) || !(await isValidUser(changedByParsed)))
  ) {
    throw new ValidationError('changedBy must be a valid user ID');
  }

  if (fromDateRaw !== null && isNaN(Date.parse(fromDateRaw))) {
    throw new ValidationError('fromDate must be a valid date string');
  }

  if (toDateRaw !== null && isNaN(Date.parse(toDateRaw))) {
    throw new ValidationError('toDate must be a valid date string');
  }

  const page = pageRaw ? Math.max(1, parseInt(pageRaw, 10) || 1) : 1;
  const limit = limitRaw
    ? Math.min(100, Math.max(1, parseInt(limitRaw, 10) || 20))
    : 20;

  return {
    packageId: packageIdParsed,
    changedBy: changedByParsed,
    fromDate: fromDateRaw !== null ? String(fromDateRaw) : undefined,
    toDate: toDateRaw !== null ? String(toDateRaw) : undefined,
    page,
    limit,
  };
}
