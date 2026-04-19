import { UserRole } from "../types";

export interface AccessTokenPayload {
  sub: number;
  email: string;
  role: UserRole;
}
