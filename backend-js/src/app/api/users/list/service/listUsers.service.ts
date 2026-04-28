import { selectUsers } from '../repository/listUsers.repository';
import { UserListFilters, UserListResult } from '../types';

export async function listUsersService(
  filters: UserListFilters
): Promise<UserListResult> {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.role) {
    clauses.push('role = ?');
    params.push(filters.role);
  }

  if (filters.is_active !== undefined) {
    clauses.push('is_active = ?');
    params.push(filters.is_active);
  }

  const { rows, total } = await selectUsers(
    clauses,
    params,
    filters.page,
    filters.limit
  );
  const users = rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    is_active: Boolean(row.is_active),
    created_at: row.created_at.toISOString(),
  }));

  return { users, total, page: filters.page, limit: filters.limit };
}
