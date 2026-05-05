import { connect } from '@/app/config/dbConfig';
import { ResultSetHeader } from 'mysql2/promise';
import { UserIdRow } from '../types';

export async function findUserById(id: number): Promise<UserIdRow | null> {
  const db = await connect();
  const [rows] = await db.query<UserIdRow[]>(
    'SELECT id FROM users WHERE id = ?',
    [id]
  );
  return rows[0] ?? null;
}

export async function deleteUserById(id: number): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>(
    'DELETE FROM users WHERE id = ? DELETE ON CASCADE',
    [id]
  );
}
