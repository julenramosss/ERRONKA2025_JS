import { connect } from "@/app/config/dbConfig";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { StopWithRoute, UpdatedStop } from "../types";

interface StopRow extends RowDataPacket {
  id: number;
  route_id: number;
  package_id: number;
  stop_order: number;
  estimated_arrival: string | null;
  actual_arrival: string | null;
  route_user_id: number;
}

interface UpdatedStopRow extends RowDataPacket {
  id: number;
  route_id: number;
  package_id: number;
  stop_order: number;
  estimated_arrival: string | null;
  actual_arrival: string | null;
}

export async function findStopWithRoute(stopId: number): Promise<StopWithRoute | null> {
  const db = await connect();
  const [rows] = await db.query<StopRow[]>(
    `SELECT rs.id, rs.route_id, rs.package_id, rs.stop_order,
            rs.estimated_arrival, rs.actual_arrival,
            r.user_id AS route_user_id
     FROM route_stops rs
     JOIN routes r ON rs.route_id = r.id
     WHERE rs.id = ?`,
    [stopId]
  );
  return rows[0] ?? null;
}

export async function markActualArrival(stopId: number): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>(
    "UPDATE route_stops SET actual_arrival = TIME(NOW()) WHERE id = ?",
    [stopId]
  );
}

export async function findStopById(stopId: number): Promise<UpdatedStop | null> {
  const db = await connect();
  const [rows] = await db.query<UpdatedStopRow[]>(
    `SELECT id, route_id, package_id, stop_order, estimated_arrival, actual_arrival
     FROM route_stops WHERE id = ?`,
    [stopId]
  );
  return rows[0] ?? null;
}
