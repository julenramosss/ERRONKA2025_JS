import { connect } from "@/app/config/dbConfig";
import { UserListRow } from "../types";

export async function selectUsers(
  clauses: string[] = [],
  params: unknown[] = []
): Promise<UserListRow[]> {
  const db = await connect();

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const [rows] = await db.query<UserListRow[]>(
    `SELECT id, name, email, role, is_active, created_at FROM users ${where} ORDER BY id DESC`,
    params
  );
  return rows;
}
