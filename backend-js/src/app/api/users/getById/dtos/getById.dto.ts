import { ValidationError } from "@/app/lib/errors";
import { isPositiveInteger } from "@/app/lib/dto";
import { GetUserByIdDto } from "../types";

export function validateGetUserByIdDto(
  params: URLSearchParams
): GetUserByIdDto {
  const raw = params.get("id");
  if (!raw) throw new ValidationError("id is required");
  const id = Number(raw);
  if (!isPositiveInteger(id)) {
    throw new ValidationError("id must be a positive integer");
  }
  return { id };
}
