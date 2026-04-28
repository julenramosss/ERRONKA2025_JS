import { PackageStatus } from '@/app/types';
import { listAllLogsRepo } from '../repository/listAllLogs.repo';
import { ListAllLogsDto, ListAllLogsResult } from '../types';

export async function listAllLogsService(
  filters: ListAllLogsDto
): Promise<ListAllLogsResult> {
  const { packageId, changedBy, fromDate, toDate, page, limit } = filters;
  const offset = (page - 1) * limit;
  const params: string[] = [];
  const values: unknown[] = [];

  if (packageId) {
    params.push(`package_id = ?`);
    values.push(packageId);
  }
  if (changedBy) {
    params.push(`changed_by = ?`);
    values.push(changedBy);
  }
  if (fromDate) {
    params.push(`changed_at >= ?`);
    values.push(fromDate);
  }
  if (toDate) {
    params.push(`changed_at <= ?`);
    values.push(toDate);
  }

  const { rows, total } = await listAllLogsRepo(params, values, offset, limit);

  const logs = rows.map((row) => ({
    id: row.id,
    packageId: row.package_id,
    changedBy: row.changed_by,
    oldStatus: row.old_status as PackageStatus,
    newStatus: row.new_status as PackageStatus,
    notes: row.notes ?? null,
    changedAt: row.changed_at,
  }));

  return { logs, total, page, limit };
}
