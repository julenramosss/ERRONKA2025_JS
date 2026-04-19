import { ValidationError } from "@/app/lib/errors";
import { ReorderDto, StopOrderItem } from "../types";

export function validateReorderDto(body: unknown): ReorderDto {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Invalid request body");
  }

  const { route_id, stops } = body as Record<string, unknown>;

  if (typeof route_id !== "number" || !Number.isInteger(route_id) || route_id <= 0) {
    throw new ValidationError("route_id is required and must be a positive integer");
  }

  if (!Array.isArray(stops) || stops.length === 0) {
    throw new ValidationError("stops is required and must be a non-empty array");
  }

  for (const item of stops) {
    const s = item as Record<string, unknown>;
    if (
      typeof s.stop_id !== "number" ||
      !Number.isInteger(s.stop_id) ||
      s.stop_id <= 0 ||
      typeof s.order_index !== "number" ||
      !Number.isInteger(s.order_index) ||
      s.order_index <= 0
    ) {
      throw new ValidationError(
        "Each stop must have a positive integer stop_id and order_index"
      );
    }
  }

  const typedStops = stops as StopOrderItem[];
  const orderIndices = typedStops.map((s) => s.order_index);
  if (new Set(orderIndices).size !== orderIndices.length) {
    throw new ValidationError("order_index values must not contain duplicates");
  }

  return { route_id, stops: typedStops };
}
