import { connect } from '@/app/config/dbConfig';
import { ResultSetHeader } from 'mysql2';
import { UserPasswordRow } from '../types';

export async function findUserPasswordById(
  userId: number
): Promise<UserPasswordRow | null> {
  const db = await connect();
  const [rows] = await db.query<UserPasswordRow[]>(
    'SELECT id, password_hash FROM users WHERE id = ?',
    [userId]
  );

  return rows[0] ?? null;
}

export async function updateUserPassword(
  userId: number,
  passwordHash: string
): Promise<void> {
  const db = await connect();
  await db.execute<ResultSetHeader>(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [passwordHash, userId]
  );
}

export async function revokeResetTokensForUser(userId: number): Promise<void> {
  const db = await connect();
  await db.execute<ResultSetHeader>(
    "UPDATE tokens SET revoked = TRUE WHERE user_id = ? AND type IN ('reset_pwd_token', 'activate_account_token') AND revoked = FALSE",
    [userId]
  );
}
