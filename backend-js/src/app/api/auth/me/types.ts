import { UserRole } from "@/app/lib/jwt";

export interface MeResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}