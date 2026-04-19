import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function verifyToken(
  token: string
): Promise<number | null> {
  const db = await connect();
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT user_id FROM tokens WHERE token = ? AND type IN ('reset_pwd_token', 'activate_account_token') AND revoked = FALSE AND expires_at > NOW()`,
    [token]
  );

  return rows.length > 0 ? (rows[0].user_id as number) : null;
}

export async function updateUserPasswordAndActivate(
  userId: number,
  passwordHash: string
): Promise<number> {
  const db = await connect();
  const [result] = await db.execute<ResultSetHeader>(
    "UPDATE users SET password_hash = ?, is_active = TRUE WHERE id = ?",
    [passwordHash, userId]
  );
  return result.affectedRows;
}
