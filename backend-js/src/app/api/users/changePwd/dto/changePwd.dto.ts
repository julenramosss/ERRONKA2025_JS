import { ValidationError } from "@/app/lib/errors";
import { ChangePwdDto } from "../types";

export function validateChangePwdDto(body: unknown): ChangePwdDto {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Cuerpo de solicitud inválido");
  }

  const { oldPassword, newPassword } = body as Record<string, unknown>;

  if (!oldPassword || typeof oldPassword !== "string") {
    throw new ValidationError("oldPassword beharrezkoa da");
  }

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
    throw new ValidationError("newPassword beharrezkoa da (gutxienez 6 karaktere)");
  }

  return { oldPassword, newPassword };
}