import { ValidationError } from "@/app/lib/errors";
import { LogoutDto } from "../types";

export function validateLogoutDto(body: unknown): LogoutDto {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Cuerpo de solicitud inválido");
  }
  const { refresh_token } = body as Record<string, unknown>;
  if (!refresh_token || typeof refresh_token !== "string") {
    throw new ValidationError("refresh_token beharrezkoa da");
  }
  return { refresh_token };
}