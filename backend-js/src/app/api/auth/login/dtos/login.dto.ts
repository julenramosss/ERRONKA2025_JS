import { ValidationError } from "@/app/lib/errors";
import { LoginDto } from "../types";

export function validateLoginDto(body: unknown): LoginDto {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Ezin da eskaera gorputza analizatu");
  }

  const { email, password } = body as Record<string, unknown>;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new ValidationError("email ez da baliozkoa");
  }

  if (!password || typeof password !== "string") {
    throw new ValidationError("password beharrezkoa da");
  }
  return { email, password };
}
