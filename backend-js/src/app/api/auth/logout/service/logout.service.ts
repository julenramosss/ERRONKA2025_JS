import { revokeRefreshToken } from "../repository/logout.repository";
import { LogoutDto } from "../types";

export async function logoutService(
  userId: number,
  dto: LogoutDto
): Promise<void> {
  await revokeRefreshToken(dto.refresh_token, userId);
}