import { ValidationError } from "@/app/lib/errors";
import { CreateUserDto } from "../types";

export function validateCreateUserDto(body: unknown): CreateUserDto {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Cuerpo de solicitud inválido");
  }

  const { name, email, role } = body as Record<string, unknown>;

  if (!name || typeof name !== "string")
    throw new ValidationError("name ez dago edo ez da string");

  if (!email || typeof email !== "string" || !email.includes("@"))
    throw new ValidationError("email ez da baliozko helbide elektronikoa");

  if (role !== "admin" && role !== "distributor")
    throw new ValidationError(
      "role ez da baliozko balioa (admin edo distributor izan behar du)"
    );

  return { name, email, role };
}