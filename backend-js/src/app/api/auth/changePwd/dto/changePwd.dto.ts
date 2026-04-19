import { ValidationError } from "@/app/lib/errors";
import { isString } from "@/app/lib/dto";
import { ChangePwdDto } from "../types";

export function validateChangePwdDto(body: unknown): ChangePwdDto {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Invalid request body");
  }

  const { new_password, reset_pwd_token } = body as Record<string, unknown>;

  if (!isString(new_password) || (new_password as string).length < 6) {
    throw new ValidationError(
      "new_password is required and must be at least 6 characters"
    );
  }

  if (!isString(reset_pwd_token)) {
    throw new ValidationError("reset_pwd_token is required");
  }

  return {
    newPassword: new_password as string,
    reset_pwd_token: reset_pwd_token as string,
  };
}
