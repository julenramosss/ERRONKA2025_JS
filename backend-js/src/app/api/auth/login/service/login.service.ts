import { randomUUID } from "crypto";
import { ForbiddenError, UnauthorizedError } from "@/app/lib/errors";
import { signAccessToken } from "@/app/lib/jwt";
import { verifyPassword } from "@/app/lib/hashPasword";
import { jwt_refresh_expires_days } from "@/app/config/envConfig";
import { LoginDto, LoginResponse } from "../types";
import {
  findUserByEmailForAuth,
  insertRefreshToken,
} from "../repository/login.repository";

export async function loginService(dto: LoginDto): Promise<LoginResponse> {
  const user = await findUserByEmailForAuth(dto.email);
  if (!user) throw new UnauthorizedError("Kredentzialak ez dira zuzenak");

  const ok = await verifyPassword(dto.password, user.password_hash);
  if (!ok) throw new UnauthorizedError("Kredentzialak ez dira zuzenak");

  if (!user.is_active) {
    throw new ForbiddenError("Erabiltzailea desaktibatuta dago");
  }

  const access_token = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const refresh_token = randomUUID();
  const expiresAt = new Date(
    Date.now() + jwt_refresh_expires_days * 24 * 60 * 60 * 1000 // --> 24 horas
  );
  await insertRefreshToken(refresh_token, user.id, expiresAt);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: Boolean(user.is_active),
    },
    access_token,
    refresh_token,
  };
}
