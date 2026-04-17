import { ValidationError } from "@/app/lib/errors";
import { UpdateUserDto } from "../types";

export function validateUpdateUserDto(body: unknown): UpdateUserDto {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Cuerpo de solicitud inválido");
  }
  const { id, name, email } = body as Record<string, unknown>;

  if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
    throw new ValidationError("id zenbaki oso positiboa izan behar du");
  }

  const dto: UpdateUserDto = { id };

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new ValidationError("name string ez hutsa izan behar du");
    }
    dto.name = name;
  }

  if (email !== undefined) {
    if (typeof email !== "string" || !email.includes("@")) {
      throw new ValidationError("email ez da baliozkoa");
    }
    dto.email = email;
  }

  if (dto.name === undefined && dto.email === undefined) {
    throw new ValidationError("gutxienez eremu bat eguneratu behar da");
  }

  return dto;
}
