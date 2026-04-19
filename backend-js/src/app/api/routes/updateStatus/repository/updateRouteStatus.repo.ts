import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { RouteRow, RouteStatus } from "../types";

export async function findRouteById(routeId: number): Promise<RouteRow | null> {
  const db = await connect();
  const [rows] = await db.query<(RowDataPacket & RouteRow)[]>(
    "SELECT id, user_id, status FROM routes WHERE id = ?",
    [routeId]
  );
  return rows[0] ?? null;
}

export async function setRouteStatus(
  routeId: number,
  status: RouteStatus
): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>("UPDATE routes SET status = ? WHERE id = ?", [
    status,
    routeId,
  ]);
}
