import { ValidationError } from "@/app/lib/errors";
import { isEmail, isString } from "@/app/lib/dto";
import { ChangePwdDto } from "../types";

export function validateChangePwdDto(body: unknown): ChangePwdDto {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Invalid request body");
  }

  const { user_email, newPassword, reset_pwd_token } = body as Record<
    string,
    unknown
  >;

  if (!isEmail(user_email)) {
    throw new ValidationError(
      "user_email is required and must be a valid email"
    );
  }

  if (!isString(newPassword) || (newPassword as string).length < 6) {
    throw new ValidationError(
      "newPassword is required and must be at least 6 characters"
    );
  }

  if (!isString(reset_pwd_token)) {
    throw new ValidationError("reset_pwd_token is required");
  }

  return {
    user_email: user_email as string,
    newPassword: newPassword as string,
    reset_pwd_token: reset_pwd_token as string,
  };
}
