import { connect } from '@/app/config/dbConfig';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { UserIdRow } from '../types';

export async function findUserById(id: number): Promise<UserIdRow | null> {
  const db = await connect();
  const [rows] = await db.query<UserIdRow[]>(
    'SELECT id FROM users WHERE id = ?',
    [id]
  );
  return rows[0] ?? null;
}

export async function hasBlockingUserReferences(id: number): Promise<boolean> {
  const db = await connect();
  const [rows] = await db.query<(RowDataPacket & { total: number })[]>(
    `SELECT
       (SELECT COUNT(*) FROM packages WHERE created_by = ?) +
       (SELECT COUNT(*) FROM package_status_logs WHERE changed_by = ?) +
       (SELECT COUNT(*) FROM routes WHERE user_id = ?) AS total`,
    [id, id, id]
  );

  return rows[0].total > 0;
}

export async function deleteUserById(id: number): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
}
