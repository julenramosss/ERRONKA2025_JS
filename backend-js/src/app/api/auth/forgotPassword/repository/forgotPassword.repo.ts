import { connect } from '@/app/config/dbConfig';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import crypto from 'crypto';

export async function findUserByEmail(
  email: string
): Promise<{ id: number; name: string } | null> {
  const db = await connect();
  const [rows] = await db.query<
    (RowDataPacket & { id: number; name: string })[]
  >('SELECT id, name FROM users WHERE email = ? AND is_active = TRUE', [email]);
  return rows[0] ?? null;
}

export async function revokeExistingResetTokens(userId: number): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>(
    "UPDATE tokens SET revoked = TRUE WHERE user_id = ? AND type = 'reset_pwd_token' AND revoked = FALSE",
    [userId]
  );
}

export async function insertResetToken(
  userId: number,
  expiresAt: Date
): Promise<string> {
  const db = await connect();
  const token = crypto.randomBytes(32).toString('hex');
  await db.query<ResultSetHeader>(
    "INSERT INTO tokens (type, token, user_id, expires_at) VALUES ('reset_pwd_token', ?, ?, ?)",
    [token, userId, expiresAt]
  );
  return token;
}

export async function isResetPasswordTokenExists(
  userId: number
): Promise<string | null> {
  const db = await connect();
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT token FROM tokens WHERE user_id = ? AND type = 'reset_pwd_token' AND revoked = FALSE AND expires_at > NOW()",
    [userId]
  );
  return rows[0]?.token ?? null;
}
