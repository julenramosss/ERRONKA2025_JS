import { UserRole } from "@/app/types";

export interface GetUserByIdDto {
  id: number;
}

export interface UserDetail {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
