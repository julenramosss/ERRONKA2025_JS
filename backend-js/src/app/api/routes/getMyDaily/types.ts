export interface GetMyDailyRouteResult {
  route: { id: number; route_date: string };
  stops: Array<{
    id: number;
    stop_order: number;
    estimated_arrival: string | null;
    actual_arrival: string | null;
    package: {
      id: number;
      recipient_name: string;
      status: string;
      address: { street: string; city: string; lat: number; lng: number };
    };
  }>;
}
