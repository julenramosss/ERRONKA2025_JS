import { randomUUID } from "crypto";
import { jwt_refresh_expires_days } from "@/app/config/envConfig";
import { ForbiddenError, UnauthorizedError } from "@/app/lib/errors";
import { emailService } from "@/app/lib/email/email.service";
import { verifyPassword } from "@/app/lib/hashPasword";
import { signAccessToken } from "@/app/lib/jwt";
import {
  findUserByEmailForAuth,
  insertRefreshToken,
} from "../repository/login.repo";
import { LoginDto, LoginRequestMetadata, LoginResponse } from "../types";

function formatLoginTime(date: Date): string {
  return new Intl.DateTimeFormat("eu-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function sendLoginNotificationEmail(
  user: LoginResponse["user"],
  metadata: LoginRequestMetadata
): Promise<void> {
  try {
    await emailService.sendLoginNotificationEmail({
      to: user.email,
      recipientName: user.name,
      loginAt: formatLoginTime(new Date()),
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });
  } catch (error) {
    console.error("[loginService] Failed to send login notification email", error);
  }
}

export async function loginService(
  dto: LoginDto,
  metadata: LoginRequestMetadata
): Promise<LoginResponse> {
  const DUMMY_HASH =
    "$2b$10$j/waxomoVjsEiVu47WVHdu3CJIeGRfRsKOHasolKli6n2JNFjWnVq";

  const user = await findUserByEmailForAuth(dto.email);
  if (!user) {
    await verifyPassword(dto.password, DUMMY_HASH);
    throw new UnauthorizedError("Invalid credentials");
  }

  const ok = await verifyPassword(dto.password, user.password_hash);
  if (!ok) throw new UnauthorizedError("Invalid credentials");

  if (!user.is_active) {
    throw new ForbiddenError("User account is disabled");
  }

  const access_token = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const refresh_token = randomUUID();
  const expiresAt = new Date(
    Date.now() + jwt_refresh_expires_days * 24 * 60 * 60 * 1000
  );
  await insertRefreshToken(refresh_token, user.id, expiresAt);

  const response: LoginResponse = {
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

  await sendLoginNotificationEmail(response.user, metadata);

  return response;
}
