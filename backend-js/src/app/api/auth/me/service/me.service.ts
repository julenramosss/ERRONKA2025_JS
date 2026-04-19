import { NotFoundError } from "@/app/lib/errors";
import { findUserById } from "../repository/me.repository";
import { MeResponse } from "../types";

export async function meService(userId: number): Promise<MeResponse> {
  const row = await findUserById(userId);
  if (!row) throw new NotFoundError("User not found");
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    is_active: Boolean(row.is_active),
    created_at: new Date(row.created_at).toISOString(),
  };
}
