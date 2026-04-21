import { NotFoundError } from "@/app/lib/errors";
import { GetMyDailyRouteResult } from "../types";
import { findRouteWithStops } from "../repository/getMyDaily.repository";

export async function getMyDailyService(
  userId: number,
  date: string,
  allowFutureFallback: boolean
): Promise<GetMyDailyRouteResult> {
  const data = await findRouteWithStops(userId, date, allowFutureFallback);

  if (!data) throw new NotFoundError(`No route found for date ${date}`);

  const stops = data.stops.map((s) => ({
    id: s.id,
    stop_order: s.stop_order,
    estimated_arrival: s.estimated_arrival,
    actual_arrival: s.actual_arrival,
    package: {
      id: s.pkg_id,
      recipient_name: s.recipient_name,
      status: s.status,
      address: {
        street: s.street,
        city: s.city,
        lat: Number(s.lat),
        lng: Number(s.lng),
      },
    },
  }));

  return {
    route: {
      id: data.route.id,
      route_date: data.route.route_date,
      status: data.route.status,
    },
    stops,
  };
}
