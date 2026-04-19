import { selectUsers } from "../repository/listUsers.repository";
import { UserListFilters, UserListItem } from "../types";

export async function listUsersService(
  filters: UserListFilters
): Promise<UserListItem[]> {
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

  const rows = await selectUsers(clauses, params);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    is_active: Boolean(row.is_active),
    created_at: row.created_at.toISOString(),
  }));
}
