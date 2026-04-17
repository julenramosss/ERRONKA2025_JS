import { ValidationError } from "@/app/lib/errors";
import { GetUserByIdDto } from "../types";

export function validateGetUserByIdDto(
  params: URLSearchParams
): GetUserByIdDto {
  const raw = params.get("id");
  if (!raw) throw new ValidationError("id beharrezkoa da");
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError("id zenbaki oso positiboa izan behar du");
  }
  return { id };
}
