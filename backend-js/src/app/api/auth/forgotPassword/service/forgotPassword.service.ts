import { emailService } from "@/app/lib/email/email.service";
import {
  findUserByEmail,
  insertResetToken,
  revokeExistingResetTokens,
  isResetPasswordTokenExists,
} from "../repository/forgotPassword.repo";
import { reset_base_url, reset_expires_minutes } from "@/app/config/envConfig";

export async function forgotPasswordService(email: string): Promise<void> {
  const user = await findUserByEmail(email);
  // Si el usuario no existe respondemos igual para no filtrar info
  if (!user) return;

  const isTokenExists = await isResetPasswordTokenExists(user.id);

  if (isTokenExists) {
    return;
  }

  await revokeExistingResetTokens(user.id);

  const expiresAt = new Date(Date.now() + reset_expires_minutes * 60 * 1000);
  const token = await insertResetToken(user.id, expiresAt);

  await emailService.sendResetPasswordEmail({
    to: email,
    recipientName: user.name,
    resetUrl: `${reset_base_url}/${token}`,
  });
}
