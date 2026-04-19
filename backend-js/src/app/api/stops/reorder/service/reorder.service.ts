import { NotFoundError, ValidationError } from "@/app/lib/errors";
import { ReorderDto, ReorderedStop } from "../types";
import {
  findRouteById,
  findStopsByRouteId,
  updateStopOrders,
  findStopsAfterReorder,
} from "../repository/reorder.repository";

export async function reorderStopsService(dto: ReorderDto): Promise<ReorderedStop[]> {
  const route = await findRouteById(dto.route_id);
  if (!route) throw new NotFoundError(`Route ${dto.route_id} not found`);

  const routeStops = await findStopsByRouteId(dto.route_id);
  const routeStopIds = new Set(routeStops.map((s) => s.id));

  for (const item of dto.stops) {
    if (!routeStopIds.has(item.stop_id)) {
      throw new ValidationError(
        `Stop ${item.stop_id} does not belong to route ${dto.route_id}`
      );
    }
  }

  await updateStopOrders(dto.route_id, dto.stops);

  return findStopsAfterReorder(dto.route_id);
}
