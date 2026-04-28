import { connect } from '@/app/config/dbConfig';
import { RowDataPacket } from 'mysql2/promise';
import { LogEntry, ListByPackageResult } from '../types';
import { PackageStatus } from '@/app/types';

export async function listByPackageRepo(
  packageId: number,
  page: number,
  limit: number,
  assignedTo?: number
): Promise<ListByPackageResult> {
  const db = await connect();
  const offset = (page - 1) * limit;

  const clauses = ['l.package_id = ?'];
  const params: unknown[] = [packageId];

  if (assignedTo !== undefined) {
    clauses.push('p.assigned_to = ?');
    params.push(assignedTo);
  }

  const where = `WHERE ${clauses.join(' AND ')}`;

  const [countRows] = await db.query<(RowDataPacket & { total: number })[]>(
    `SELECT COUNT(*) as total
     FROM package_status_logs l
     JOIN packages p ON l.package_id = p.id
     ${where}`,
    params
  );
  const total = countRows[0].total;

  const [rows] = await db.query<(RowDataPacket & LogEntry)[]>(
    `SELECT l.id, l.package_id, l.old_status, l.new_status, l.changed_by, l.notes, l.changed_at
     FROM package_status_logs l
     JOIN packages p ON l.package_id = p.id
     ${where}
     ORDER BY l.changed_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const logs: LogEntry[] = rows.map((row) => ({
    id: row.id,
    packageId: row.package_id,
    oldStatus: (row.old_status as PackageStatus) ?? null,
    newStatus: row.new_status as PackageStatus,
    changedBy: row.changed_by,
    notes: row.notes ?? null,
    changedAt: row.changed_at,
  }));

  return { logs, total, page, limit };
}
