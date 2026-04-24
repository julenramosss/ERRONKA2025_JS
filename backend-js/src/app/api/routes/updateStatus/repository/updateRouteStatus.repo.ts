import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  PendingStopRow,
  RoutePackageStatusChangeRow,
  RouteRow,
  RouteStatus,
} from "../types";

export async function findRouteById(routeId: number): Promise<RouteRow | null> {
  const db = await connect();
  const [rows] = await db.query<(RowDataPacket & RouteRow)[]>(
    "SELECT id, user_id, status, DATE_FORMAT(route_date, '%Y-%m-%d') AS route_date FROM routes WHERE id = ?",
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

export async function migratePastPendingStopsIntoRoute(
  userId: number,
  targetRouteId: number
): Promise<number> {
  const db = await connect();

  const [pendingStops] = await db.query<PendingStopRow[]>(
    `SELECT rs.id AS stop_id, rs.package_id
     FROM route_stops rs
     JOIN routes r ON r.id = rs.route_id
     JOIN packages p ON p.id = rs.package_id
     WHERE r.user_id = ?
       AND r.id <> ?
       AND r.route_date < CURRENT_DATE
       AND p.status IN ('assigned', 'in_transit', 'undelivered')
       AND NOT EXISTS (
         SELECT 1
         FROM route_stops target_rs
         WHERE target_rs.route_id = ?
           AND target_rs.package_id = rs.package_id
       )
       AND NOT EXISTS (
         SELECT 1
         FROM route_stops scheduled_rs
         JOIN routes scheduled_r ON scheduled_r.id = scheduled_rs.route_id
         WHERE scheduled_rs.package_id = rs.package_id
           AND scheduled_r.user_id = r.user_id
           AND scheduled_r.route_date >= CURRENT_DATE
           AND scheduled_rs.route_id <> ?
       )
       AND rs.id = (
         SELECT latest_rs.id
         FROM route_stops latest_rs
         JOIN routes latest_r ON latest_r.id = latest_rs.route_id
         WHERE latest_rs.package_id = rs.package_id
           AND latest_r.user_id = r.user_id
           AND latest_r.route_date < CURRENT_DATE
         ORDER BY latest_r.route_date DESC, latest_rs.stop_order ASC
         LIMIT 1
       )
     ORDER BY r.route_date ASC, rs.stop_order ASC`,
    [userId, targetRouteId, targetRouteId, targetRouteId]
  );

  if (pendingStops.length === 0) return 0;

  const [[{ max_order }]] = await db.query<
    (RowDataPacket & { max_order: number })[]
  >(
    "SELECT COALESCE(MAX(stop_order), 0) AS max_order FROM route_stops WHERE route_id = ?",
    [targetRouteId]
  );

  let nextOrder = Number(max_order);
  for (const stop of pendingStops) {
    nextOrder += 1;
    await db.query<ResultSetHeader>(
      `UPDATE route_stops
       SET route_id = ?, stop_order = ?, actual_arrival = NULL
       WHERE id = ?`,
      [targetRouteId, nextOrder, stop.stop_id]
    );
  }

  return pendingStops.length;
}

export async function setRoutePendingPackagesInTransit(
  routeId: number
): Promise<RoutePackageStatusChangeRow[]> {
  const db = await connect();

  const [packages] = await db.query<RoutePackageStatusChangeRow[]>(
    `SELECT p.id, p.status AS old_status
     FROM packages p
     JOIN route_stops rs ON rs.package_id = p.id
     WHERE rs.route_id = ?
       AND p.status IN ('assigned', 'undelivered')`,
    [routeId]
  );

  if (packages.length === 0) return [];

  await db.query<ResultSetHeader>(
    `UPDATE packages p
     JOIN route_stops rs ON rs.package_id = p.id
     SET p.status = 'in_transit'
     WHERE rs.route_id = ?
       AND p.status IN ('assigned', 'undelivered')`,
    [routeId]
  );

  return packages;
}

export async function setRouteRemainingPackagesUndelivered(
  routeId: number
): Promise<RoutePackageStatusChangeRow[]> {
  const db = await connect();

  const [packages] = await db.query<RoutePackageStatusChangeRow[]>(
    `SELECT p.id, p.status AS old_status
     FROM route_stops rs
     JOIN packages p ON p.id = rs.package_id
     WHERE rs.route_id = ?
       AND p.status NOT IN ('delivered', 'failed', 'undelivered')`,
    [routeId]
  );

  if (packages.length === 0) return [];

  const packageIds = packages.map((pkg) => pkg.id);
  const placeholders = packageIds.map(() => "?").join(", ");

  await db.query<ResultSetHeader>(
    `UPDATE packages
     SET status = 'undelivered'
     WHERE id IN (${placeholders})`,
    packageIds
  );

  return packages;
}
