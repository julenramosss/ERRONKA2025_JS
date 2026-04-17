import { selectUsers } from "../repository/listUsers.repository";
import { UserListFilters, UserListItem } from "../types";

export async function listUsersService(
  filters: UserListFilters
): Promise<UserListItem[]> {
  const rows = await selectUsers(filters);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    is_active: Boolean(r.is_active),
    created_at: new Date(r.created_at).toISOString(),
  }));
}
