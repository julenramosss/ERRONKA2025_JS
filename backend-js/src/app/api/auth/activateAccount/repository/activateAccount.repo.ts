import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import crypto from "crypto";

export async function findInactiveUserByEmail(
  email: string
): Promise<{ id: number; name: string } | null> {
  const db = await connect();
  const [rows] = await db.query<
    (RowDataPacket & { id: number; name: string })[]
  >("SELECT id, name FROM users WHERE email = ? AND is_active = FALSE", [
    email,
  ]);
  return rows[0] ?? null;
}

export async function revokeExistingActivationTokens(
  userId: number
): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>(
    "UPDATE tokens SET revoked = TRUE WHERE user_id = ? AND type = 'activate_account_token' AND revoked = FALSE",
    [userId]
  );
}

export async function insertActivationToken(
  userId: number,
  expiresAt: Date
): Promise<string> {
  const db = await connect();
  const token = crypto.randomBytes(32).toString("hex");
  await db.query<ResultSetHeader>(
    "INSERT INTO tokens (type, token, user_id, expires_at) VALUES ('activate_account_token', ?, ?, ?)",
    [token, userId, expiresAt]
  );
  return token;
}
