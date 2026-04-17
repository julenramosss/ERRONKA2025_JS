import { randomUUID } from "crypto";
import { ForbiddenError, UnauthorizedError } from "@/app/lib/errors";
import { signAccessToken } from "@/app/lib/jwt";
import { jwt_refresh_expires_days } from "@/app/config/envConfig";
import { RefreshDto, RefreshResponse } from "../types";
import {
  findRefreshToken,
  insertRefreshToken,
  revokeTokenById,
} from "../repository/refresh.repository";

export async function refreshService(dto: RefreshDto): Promise<RefreshResponse> {
  const row = await findRefreshToken(dto.refresh_token);
  if (!row) throw new UnauthorizedError("Refresh token baliogabea");
  if (row.revoked) throw new UnauthorizedError("Refresh token baliogabea");
  if (new Date(row.expires_at).getTime() < Date.now()) {
    throw new UnauthorizedError("Refresh token iraungita");
  }
  if (!row.is_active) {
    throw new ForbiddenError("Erabiltzailea desaktibatuta dago");
  }

  await revokeTokenById(row.id);

  const access_token = signAccessToken({
    sub: row.user_id,
    email: row.email,
    role: row.role,
  });

  const refresh_token = randomUUID();
  const expiresAt = new Date(
    Date.now() + jwt_refresh_expires_days * 24 * 60 * 60 * 1000
  );
  await insertRefreshToken(refresh_token, row.user_id, expiresAt);

  return { access_token, refresh_token };
}