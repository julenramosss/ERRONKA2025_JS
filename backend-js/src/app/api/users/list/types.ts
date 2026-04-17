import { UserRole } from "@/app/lib/jwt";

export interface UserListFilters {
  role?: UserRole;
  is_active?: boolean;
}

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}