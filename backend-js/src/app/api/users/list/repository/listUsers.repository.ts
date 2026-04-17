import { connect } from "@/app/config/dbConfig";
import { RowDataPacket } from "mysql2";
import { UserRole } from "@/app/lib/jwt";
import { UserListFilters } from "../types";

export interface UserListRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: number;
  created_at: Date;
}

export async function selectUsers(
  filters: UserListFilters
): Promise<UserListRow[]> {
  const db = await connect();
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.role) {
    clauses.push("role = ?");
    params.push(filters.role);
  }
  if (filters.is_active !== undefined) {
    clauses.push("is_active = ?");
    params.push(filters.is_active);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const [rows] = await db.query<UserListRow[]>(
    `SELECT id, name, email, role, is_active, created_at FROM users ${where} ORDER BY id DESC`,
    params
  );
  return rows;
}
