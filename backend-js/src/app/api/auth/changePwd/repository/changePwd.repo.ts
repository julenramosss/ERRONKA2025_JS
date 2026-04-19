import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function verifyEmailToken(
  email: string,
  token: string
): Promise<number | null> {
  const db = await connect();
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT users.id FROM users INNER JOIN tokens ON users.id = tokens.user_id WHERE users.email = ? AND tokens.token = ? AND tokens.type IN ('reset_pwd_token', 'activate_account_token') AND tokens.revoked = FALSE AND tokens.expires_at > NOW()`,
    [email, token]
  );

  return rows.length > 0 ? (rows[0].id as number) : null;
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
