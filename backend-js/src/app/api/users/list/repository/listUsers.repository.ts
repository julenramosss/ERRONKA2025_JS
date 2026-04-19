import { connect } from "@/app/config/dbConfig";
import { RowDataPacket } from "mysql2";
import { UserListRow } from "../types";

export async function selectUsers(
  clauses: string[] = [],
  params: unknown[] = [],
  page: number = 1,
  limit: number = 20
): Promise<{ rows: UserListRow[]; total: number }> {
  const db = await connect();
  const offset = (page - 1) * limit;
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const [countRows] = await db.query<(RowDataPacket & { total: number })[]>(
    `SELECT COUNT(*) as total FROM users ${where}`,
    params
  );
  const total = countRows[0].total;

  const [rows] = await db.query<UserListRow[]>(
    `SELECT id, name, email, role, is_active, created_at FROM users ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total };
}
