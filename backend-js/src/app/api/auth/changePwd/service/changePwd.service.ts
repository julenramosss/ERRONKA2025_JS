import { encryptPwd } from "@/app/lib/hashPasword";
import { UnauthorizedError } from "@/app/lib/errors";
import {
  revokeAllResetTokensForUser,
  updateUserPasswordAndActivate,
  verifyToken,
} from "../repository/changePwd.repo";
import { ChangePwdDto } from "../types";

export async function checkTokenService(token: string): Promise<boolean> {
  const userId = await verifyToken(token);
  return userId !== null;
}

export async function changePwdService(
  dto: ChangePwdDto & { newPassword: string }
): Promise<void> {
  const userId = await verifyToken(dto.reset_pwd_token);

  if (!userId) throw new UnauthorizedError("Invalid or expired email token");

  const newHash = await encryptPwd(dto.newPassword);
  await updateUserPasswordAndActivate(userId, newHash);

  await revokeAllResetTokensForUser(userId);
}
