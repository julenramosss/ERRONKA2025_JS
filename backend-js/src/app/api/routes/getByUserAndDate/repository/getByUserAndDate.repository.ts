import { connect } from '@/app/config/dbConfig';
import { RowDataPacket } from 'mysql2/promise';

interface RouteHeaderRow extends RowDataPacket {
  id: number;
  route_date: string;
}

interface StopDetailRow extends RowDataPacket {
  id: number;
  stop_order: number;
  estimated_arrival: string | null;
  actual_arrival: string | null;
  pkg_id: number;
  recipient_name: string;
  status: string;
  street: string;
  city: string;
  lat: number;
  lng: number;
}

export async function findRouteWithStops(
  userId: number,
  date: string
): Promise<{ route: RouteHeaderRow; stops: StopDetailRow[] } | null> {
  const db = await connect();
  const [routeRows] = await db.query<RouteHeaderRow[]>(
    "SELECT id, DATE_FORMAT(route_date, '%Y-%m-%d') AS route_date FROM routes WHERE user_id = ? AND route_date = ?",
    [userId, date]
  );

  if (!routeRows[0]) return null;

  const route = routeRows[0];

  const [stopRows] = await db.query<StopDetailRow[]>(
    `SELECT rs.id, rs.stop_order, rs.estimated_arrival, rs.actual_arrival,
            p.id AS pkg_id, p.recipient_name, p.status,
            a.street, a.city,
            a.latitude AS lat, a.longitude AS lng
     FROM route_stops rs
     JOIN packages p ON rs.package_id = p.id
     JOIN addresses a ON p.address_id = a.id
     WHERE rs.route_id = ?
     ORDER BY rs.stop_order ASC`,
    [route.id]
  );

  return { route, stops: stopRows };
}
