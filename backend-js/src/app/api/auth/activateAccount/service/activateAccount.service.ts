import { emailService } from "@/app/lib/email/email.service";
import {
  findInactiveUserByEmail,
  insertActivationToken,
  revokeExistingActivationTokens,
} from "../repository/activateAccount.repo";
import { reset_base_url } from "@/app/config/envConfig";

const ACTIVATION_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

export async function sendActivationEmailService(email: string): Promise<void> {
  const user = await findInactiveUserByEmail(email);
  if (!user) return;

  await revokeExistingActivationTokens(user.id);

  const expiresAt = new Date(Date.now() + ACTIVATION_EXPIRES_MS);
  const token = await insertActivationToken(user.id, expiresAt);

  await emailService.sendActivationEmail({
    to: email,
    recipientName: user.name,
    activationUrl: `${reset_base_url}${token}`,
  });
}
