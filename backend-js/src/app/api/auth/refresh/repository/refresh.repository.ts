import { connect } from '@/app/config/dbConfig';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { UserRole } from '@/app/types';

export interface RefreshRow extends RowDataPacket {
  id: number;
  user_id: number;
  expires_at: Date;
  revoked: number;
  email: string;
  role: UserRole;
  is_active: number;
}

export async function findRefreshToken(
  token: string
): Promise<RefreshRow | null> {
  const db = await connect();
  const [rows] = await db.query<RefreshRow[]>(
    `SELECT t.id, t.user_id, t.expires_at, t.revoked, u.email, u.role, u.is_active
     FROM tokens t
     INNER JOIN users u ON u.id = t.user_id
     WHERE t.token = ? AND t.type = 'refresh_token' AND t.revoked = FALSE AND t.expires_at > NOW()`,
    [token]
  );
  return rows[0] ?? null;
}

export async function revokeTokenById(id: number): Promise<void> {
  const db = await connect();
  await db.execute<ResultSetHeader>(
    'UPDATE tokens SET revoked = TRUE WHERE id = ?',
    [id]
  );
}

export async function insertRefreshToken(
  token: string,
  userId: number,
  expiresAt: Date
): Promise<void> {
  const db = await connect();
  await db.execute<ResultSetHeader>(
    `INSERT INTO tokens (token, type, user_id, expires_at, revoked)
     VALUES (?, 'refresh_token', ?, ?, FALSE)`,
    [token, userId, expiresAt]
  );
}
