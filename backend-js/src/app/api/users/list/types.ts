import { UserRole } from '@/app/types';
import { RowDataPacket } from 'mysql2';

export interface UserListFilters {
  role?: UserRole;
  is_active?: boolean;
  page: number;
  limit: number;
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

export interface UserListResult {
  users: UserListItem[];
  total: number;
  page: number;
  limit: number;
}
