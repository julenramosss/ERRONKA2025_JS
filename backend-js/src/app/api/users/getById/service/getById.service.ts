import { NotFoundError } from "@/app/lib/errors";
import { selectUserById } from "../repository/getById.repository";
import { UserDetail } from "../types";

export async function getUserByIdService(id: number): Promise<UserDetail> {
  const row = await selectUserById(id);
  if (!row) throw new NotFoundError("User not found");
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    is_active: Boolean(row.is_active),
    created_at: new Date(row.created_at).toISOString(),
    updated_at: new Date(row.updated_at).toISOString(),
  };
}
