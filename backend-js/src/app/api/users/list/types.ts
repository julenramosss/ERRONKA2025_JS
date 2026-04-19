import { UserRole } from "@/app/types";
import { RowDataPacket } from "mysql2";

export interface UserListFilters {
  role?: UserRole;
  is_active?: boolean;
}

export interface UserListRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: number;
  created_at: Date;
}

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}
