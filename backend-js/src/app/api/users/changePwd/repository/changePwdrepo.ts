import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface PasswordHashRow extends RowDataPacket {
  password_hash: string;
}

export async function getUserPasswordHash(
  userId: number
): Promise<string | null> {
  const db = await connect();
  const [rows] = await db.query<PasswordHashRow[]>(
    "SELECT password_hash FROM users WHERE id = ?",
    [userId]
  );
  return rows[0]?.password_hash ?? null;
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