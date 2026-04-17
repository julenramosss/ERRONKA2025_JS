import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader } from "mysql2";

export async function revokeRefreshToken(
  token: string,
  userId: number
): Promise<number> {
  const db = await connect();
  const [result] = await db.execute<ResultSetHeader>(
    `UPDATE tokens SET revoked = TRUE
     WHERE token = ? AND type = 'refresh_token' AND user_id = ?`,
    [token, userId]
  );
  return result.affectedRows;
}