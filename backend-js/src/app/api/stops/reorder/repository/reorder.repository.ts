import { connect } from '@/app/config/dbConfig';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { ReorderedStop, StopOrderItem } from '../types';

interface RouteRow extends RowDataPacket {
  id: number;
}

interface StopRow extends RowDataPacket {
  id: number;
  route_id: number;
}

interface ReorderedStopRow extends RowDataPacket {
  id: number;
  route_id: number;
  package_id: number;
  stop_order: number;
  estimated_arrival: string | null;
  actual_arrival: string | null;
}

export async function findRouteById(
  routeId: number
): Promise<{ id: number } | null> {
  const db = await connect();
  const [rows] = await db.query<RouteRow[]>(
    'SELECT id FROM routes WHERE id = ?',
    [routeId]
  );
  return rows[0] ?? null;
}

export async function findStopsByRouteId(
  routeId: number
): Promise<Array<{ id: number; route_id: number }>> {
  const db = await connect();
  const [rows] = await db.query<StopRow[]>(
    'SELECT id, route_id FROM route_stops WHERE route_id = ?',
    [routeId]
  );
  return rows;
}

export async function updateStopOrders(
  routeId: number,
  stops: StopOrderItem[]
): Promise<void> {
  const db = await connect();
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // First shift to large temp values to avoid unique constraint conflicts mid-update
    for (const stop of stops) {
      await conn.query<ResultSetHeader>(
        'UPDATE route_stops SET stop_order = ? WHERE id = ? AND route_id = ?',
        [stop.order_index + 10000, stop.stop_id, routeId]
      );
    }
    // Then set final values
    for (const stop of stops) {
      await conn.query<ResultSetHeader>(
        'UPDATE route_stops SET stop_order = ? WHERE id = ? AND route_id = ?',
        [stop.order_index, stop.stop_id, routeId]
      );
    }
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function findStopsAfterReorder(
  routeId: number
): Promise<ReorderedStop[]> {
  const db = await connect();
  const [rows] = await db.query<ReorderedStopRow[]>(
    `SELECT id, route_id, package_id, stop_order, estimated_arrival, actual_arrival
     FROM route_stops WHERE route_id = ?
     ORDER BY stop_order ASC`,
    [routeId]
  );
  return rows;
}
