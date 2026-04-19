import { ValidationError } from "@/app/lib/errors";
import { UpdateArrivalDto } from "../types";

export function validateUpdateArrivalDto(body: unknown): UpdateArrivalDto {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Invalid request body");
  }

  const { stop_id } = body as Record<string, unknown>;

  if (typeof stop_id !== "number" || !Number.isInteger(stop_id) || stop_id <= 0) {
    throw new ValidationError("stop_id is required and must be a positive integer");
  }

  return { stop_id };
}
