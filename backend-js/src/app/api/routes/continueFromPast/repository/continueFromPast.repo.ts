import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { PendingPastRouteRow } from "../types";

export interface TodayRouteRow extends RowDataPacket {
  id: number;
  status: "planned" | "in_progress" | "completed";
}

export async function findTodayRoute(
  userId: number
): Promise<TodayRouteRow | null> {
  const db = await connect();
  const [rows] = await db.query<TodayRouteRow[]>(
    "SELECT id, status FROM routes WHERE user_id = ? AND route_date = CURRENT_DATE LIMIT 1",
    [userId]
  );
  return rows[0] ?? null;
}

export async function findLatestPastPendingRoute(
  userId: number
): Promise<PendingPastRouteRow | null> {
  const db = await connect();
  const [rows] = await db.query<(RowDataPacket & PendingPastRouteRow)[]>(
    `SELECT
       (
         SELECT latest_r.id
         FROM routes latest_r
         JOIN route_stops latest_rs ON latest_rs.route_id = latest_r.id
         JOIN packages latest_p ON latest_p.id = latest_rs.package_id
         WHERE latest_r.user_id = ?
           AND latest_r.route_date < CURRENT_DATE
           AND latest_p.status IN ('assigned', 'in_transit', 'undelivered')
           AND NOT EXISTS (
             SELECT 1
             FROM route_stops scheduled_rs
             JOIN routes scheduled_r ON scheduled_r.id = scheduled_rs.route_id
             WHERE scheduled_rs.package_id = latest_p.id
               AND scheduled_r.user_id = latest_r.user_id
               AND scheduled_r.route_date >= CURRENT_DATE
           )
         ORDER BY latest_r.route_date DESC, latest_r.id DESC
         LIMIT 1
       ) AS id,
       ? AS user_id,
       DATE_FORMAT(MAX(r.route_date), '%Y-%m-%d') AS route_date,
       'planned' AS status,
       COUNT(DISTINCT p.id) AS pending_count,
       COUNT(DISTINCT r.id) AS route_count
     FROM routes r
     JOIN route_stops rs ON rs.route_id = r.id
     JOIN packages p ON p.id = rs.package_id
     WHERE r.user_id = ?
       AND r.route_date < CURRENT_DATE
       AND p.status IN ('assigned', 'in_transit', 'undelivered')
       AND NOT EXISTS (
         SELECT 1
         FROM route_stops scheduled_rs
         JOIN routes scheduled_r ON scheduled_r.id = scheduled_rs.route_id
         WHERE scheduled_rs.package_id = p.id
           AND scheduled_r.user_id = r.user_id
           AND scheduled_r.route_date >= CURRENT_DATE
       )`,
    [userId, userId, userId]
  );
  const row = rows[0];
  if (!row || !row.id || Number(row.pending_count) === 0) return null;
  return row;
}

export async function insertTodayRetryRoute(userId: number): Promise<number> {
  const db = await connect();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO routes (user_id, route_date, status) VALUES (?, CURRENT_DATE, 'in_progress')",
    [userId]
  );
  return result.insertId;
}

export async function setRouteInProgress(routeId: number): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>(
    "UPDATE routes SET status = 'in_progress' WHERE id = ?",
    [routeId]
  );
}

export async function clearStopArrivalsForPendingPackages(
  routeId: number
): Promise<void> {
  const db = await connect();
  await db.query<ResultSetHeader>(
    `UPDATE route_stops rs
     JOIN packages p ON p.id = rs.package_id
     SET rs.actual_arrival = NULL
     WHERE rs.route_id = ?
       AND p.status IN ('assigned', 'in_transit', 'undelivered')`,
    [routeId]
  );
}
