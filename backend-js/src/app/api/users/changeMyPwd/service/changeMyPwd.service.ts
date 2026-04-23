import { NotFoundError, UnauthorizedError } from "@/app/lib/errors";
import { encryptPwd, verifyPassword } from "@/app/lib/hashPasword";
import { ChangeMyPwdDto } from "../types";
import {
  findUserPasswordById,
  revokeResetTokensForUser,
  updateUserPassword,
} from "../repository/changeMyPwd.repository";

export async function changeMyPwdService(
  userId: number,
  dto: ChangeMyPwdDto
): Promise<void> {
  const user = await findUserPasswordById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isCurrentPasswordValid = await verifyPassword(
    dto.currentPassword,
    user.password_hash
  );

  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError("Current password is incorrect");
  }

  const newPasswordHash = await encryptPwd(dto.newPassword);
  await updateUserPassword(userId, newPasswordHash);
  await revokeResetTokensForUser(userId);
}
