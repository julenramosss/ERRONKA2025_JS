import { connect } from "@/app/config/dbConfig";
import { RowDataPacket } from "mysql2";
import { UserRole } from "@/app/types";

export interface MeRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: number;
  created_at: Date;
}

export async function findUserById(userId: number): Promise<MeRow | null> {
  const db = await connect();
  const [rows] = await db.query<MeRow[]>(
    "SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?",
    [userId]
  );
  return rows[0] ?? null;
}
