import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket, ExecuteValues } from "mysql2";

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

export async function updateUser(
  id: number,
  fields: { name?: string; email?: string }
): Promise<number> {
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
  params.push(id);
  const [result] = await db.execute<ResultSetHeader>(
    `UPDATE users SET ${sets.join(", ")} WHERE id = ?`,
    params
  );
  return result.affectedRows;
}

export interface UpdatedUserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
}

export async function selectUpdatedUser(
  id: number
): Promise<UpdatedUserRow | null> {
  const db = await connect();
  const [rows] = await db.query<UpdatedUserRow[]>(
    "SELECT id, name, email FROM users WHERE id = ?",
    [id]
  );
  return rows[0] ?? null;
}
