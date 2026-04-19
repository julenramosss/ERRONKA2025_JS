import { connect } from "@/app/config/dbConfig";
import { RowDataPacket } from "mysql2";
import { UserRole } from "@/app/types";

export interface UserDetailRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: number;
  created_at: Date;
  updated_at: Date;
}

export async function selectUserById(
  id: number
): Promise<UserDetailRow | null> {
  const db = await connect();
  const [rows] = await db.query<UserDetailRow[]>(
    `SELECT id, name, email, role, is_active, created_at, updated_at
     FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] ?? null;
}
