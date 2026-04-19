import { ValidationError } from "@/app/lib/errors";
import { isEmail, isString, isUserRole } from "@/app/lib/dto";
import { UserRole } from "@/app/types";
import { CreateUserDto } from "../types";

export function validateCreateUserDto(body: unknown): CreateUserDto {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Invalid request body");
  }

  const { name, email, role } = body as Record<string, unknown>;

  if (!isString(name))
    throw new ValidationError(
      "name is required and must be a non-empty string"
    );

  if (!isEmail(email))
    throw new ValidationError(
      "email is required and must be a valid email address"
    );

  if (!isUserRole(role))
    throw new ValidationError(
      "role is required and must be one of: admin, distributor"
    );

  return {
    name: name as string,
    email: email as string,
    role: role as UserRole,
  };
}
