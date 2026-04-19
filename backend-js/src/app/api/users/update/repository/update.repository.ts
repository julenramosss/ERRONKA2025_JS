import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket, ExecuteValues } from "mysql2";
import { UpdatedUserRow, UserInfo } from "../types";

interface IdRow extends RowDataPacket {
  id: number;
}

export async function existsUser(id: number): Promise<boolean> {
  const db = await connect();
  const [rows] = await db.query<IdRow[]>("SELECT id FROM users WHERE id = ?", [
    id,
  ]);
  return rows.length > 0;
}

export async function emailTakenByOther(
  email: string,
  id: number
): Promise<boolean> {
  const db = await connect();
  const [rows] = await db.query<IdRow[]>(
    "SELECT id FROM users WHERE email = ? AND id <> ?",
    [email, id]
  );
  return rows.length > 0;
}

export async function updateUser(id: number, fields: UserInfo) {
  const db = await connect();
  const sets: string[] = [];
  const params: ExecuteValues[] = [];

  if (fields.name !== undefined) {
    sets.push("name = ?");
    params.push(fields.name);
  }

  if (fields.email !== undefined) {
    sets.push("email = ?");
    params.push(fields.email);
  }

  if (fields.role !== undefined) {
    sets.push("role = ?");
    params.push(fields.role);
  }

  if (fields.is_active !== undefined) {
    sets.push("is_active = ?");
    params.push(fields.is_active);
  }

  params.push(id);

  if (sets.length === 0) return;

  await db.execute<ResultSetHeader>(
    `UPDATE users SET ${sets.join(", ")} WHERE id = ?`,
    params
  );
}

export async function selectUpdatedUser(
  id: number
): Promise<UpdatedUserRow | null> {
  const db = await connect();
  const [rows] = await db.query<UpdatedUserRow[]>(
    "SELECT id, name, email, role, is_active FROM users WHERE id = ?",
    [id]
  );
  return rows[0] ?? null;
}
