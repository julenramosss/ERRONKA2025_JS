import { UserRole } from "@/app/types";
import { RowDataPacket } from "mysql2/promise";

export interface UpdateUserDto {
  id: number;
  user: UserInfo;
}

export interface UserInfo {
  name?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface UpdateUserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

export interface UpdateUserRow {
  name?: string;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface UpdatedUserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}
