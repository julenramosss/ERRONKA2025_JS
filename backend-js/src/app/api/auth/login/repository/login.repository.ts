import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { UserRole } from "@/app/lib/jwt";

export interface UserAuthRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: number;
}

export async function findUserByEmailForAuth(
  email: string
): Promise<UserAuthRow | null> {
  const db = await connect();
  const [rows] = await db.query<UserAuthRow[]>(
    "SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ?",
    [email]
  );
  return rows[0] ?? null;
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