import { connect } from "@/app/config/dbConfig";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { PackageAddressRow, RouteResult } from "../types";

interface UserRow extends RowDataPacket {
  id: number;
  role: string;
}

interface RouteRow extends RowDataPacket {
  id: number;
  user_id: number;
  route_date: string;
  status: string;
  created_at: Date;
}

interface StopDetailRow extends RowDataPacket {
  id: number;
  package_id: number;
  stop_order: number;
  estimated_arrival: string | null;
  recipient_name: string;
  street: string;
  city: string;
  lat: number;
  lng: number;
}

export async function findUserById(userId: number): Promise<UserRow | null> {
  const db = await connect();
  const [rows] = await db.query<UserRow[]>(
    "SELECT id, role FROM users WHERE id = ? AND is_active = 1",
    [userId]
  );
  return rows[0] ?? null;
}

export async function findRouteByUserAndDate(
  userId: number,
  date: string
): Promise<{ id: number } | null> {
  const db = await connect();
  const [rows] = await db.query<(RowDataPacket & { id: number })[]>(
    "SELECT id FROM routes WHERE user_id = ? AND route_date = ?",
    [userId, date]
  );
  return rows[0] ?? null;
}

export async function findPackagesWithAddresses(
  packageIds: number[]
): Promise<(RowDataPacket & PackageAddressRow)[]> {
  const db = await connect();
  const placeholders = packageIds.map(() => "?").join(", ");
  const [rows] = await db.query<(RowDataPacket & PackageAddressRow)[]>(
    `SELECT p.id, p.recipient_name, p.status, p.assigned_to,
            a.street, a.city,
            a.latitude AS lat, a.longitude AS lng
     FROM packages p
     JOIN addresses a ON p.address_id = a.id
     WHERE p.id IN (${placeholders})`,
    packageIds
  );
  return rows;
}

export async function insertRoute(
  userId: number,
  date: string
): Promise<number> {
  const db = await connect();
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO routes (user_id, route_date) VALUES (?, ?)",
    [userId, date]
  );
  return result.insertId;
}

export async function insertRouteStops(
  routeId: number,
  stops: Array<{
    packageId: number;
    stopOrder: number;
    estimatedArrival: string;
  }>
): Promise<void> {
  const db = await connect();
  for (const stop of stops) {
    await db.query<ResultSetHeader>(
      "INSERT INTO route_stops (route_id, package_id, stop_order, estimated_arrival) VALUES (?, ?, ?, ?)",
      [routeId, stop.packageId, stop.stopOrder, stop.estimatedArrival]
    );
  }
}

export async function findRouteById(
  routeId: number
): Promise<RouteResult | null> {
  const db = await connect();
  const [rows] = await db.query<RouteRow[]>(
    "SELECT id, user_id, route_date, status, created_at FROM routes WHERE id = ?",
    [routeId]
  );
  return rows[0] ?? null;
}

export async function findStopsByRouteId(
  routeId: number
): Promise<StopDetailRow[]> {
  const db = await connect();
  const [rows] = await db.query<StopDetailRow[]>(
    `SELECT rs.id, rs.package_id, rs.stop_order, rs.estimated_arrival,
            p.recipient_name, a.street, a.city,
            a.latitude AS lat, a.longitude AS lng
     FROM route_stops rs
     JOIN packages p ON rs.package_id = p.id
     JOIN addresses a ON p.address_id = a.id
     WHERE rs.route_id = ?
     ORDER BY rs.stop_order ASC`,
    [routeId]
  );
  return rows;
}

export async function updatePackagesEstimatedDelivery(
  stops: Array<{ packageId: number; estimatedDelivery: string }>
): Promise<void> {
  const db = await connect();
  for (const stop of stops) {
    await db.query<ResultSetHeader>(
      "UPDATE packages SET estimated_delivery = ? WHERE id = ?",
      [stop.estimatedDelivery, stop.packageId]
    );
  }
}
