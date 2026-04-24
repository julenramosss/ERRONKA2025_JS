import { connect } from "@/app/config/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { PackageStatus } from "@/app/types";
import { PackageWithAddress, StatusLogEntry } from "../types";

export async function findPackageById(
  id: number
): Promise<PackageWithAddress | null> {
  const db = await connect();
  const [rows] = await db.query<(RowDataPacket & PackageWithAddress)[]>(
    `SELECT p.*, a.street, a.city, a.postal_code, a.latitude, a.longitude, a.country
     FROM packages p
     JOIN addresses a ON p.address_id = a.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

export async function updatePackageStatus(
  id: number,
  status: PackageStatus
): Promise<void> {
  await updatePackagesStatus([id], status);
}

export async function updatePackagesStatus(
  ids: number[],
  status: PackageStatus
): Promise<void> {
  const db = await connect();
  const placeholders = ids.map(() => "?").join(", ");
  await db.query<ResultSetHeader>(
    `UPDATE packages SET status = ? WHERE id IN (${placeholders})`,
    [status, ...ids]
  );
}

export async function findPackagesByIds(
  ids: number[]
): Promise<PackageWithAddress[]> {
  const db = await connect();
  const placeholders = ids.map(() => "?").join(", ");
  const [rows] = await db.query<(RowDataPacket & PackageWithAddress)[]>(
    `SELECT p.*, a.street, a.city, a.postal_code, a.latitude, a.longitude, a.country
     FROM packages p
     JOIN addresses a ON p.address_id = a.id
     WHERE p.id IN (${placeholders})`,
    ids
  );
  return rows;
}

export async function insertStatusLog(
  packageId: number,
  oldStatus: PackageStatus,
  newStatus: PackageStatus,
  changedBy: number
): Promise<void> {
  await insertStatusLogs([{ packageId, oldStatus, newStatus, changedBy }]);
}

export async function insertStatusLogs(
  entries: StatusLogEntry[]
): Promise<void> {
  if (entries.length === 0) return;

  const db = await connect();
  const placeholders = entries.map(() => "(?, ?, ?, ?)").join(", ");
  const values = entries.flatMap((entry) => [
    entry.packageId,
    entry.oldStatus,
    entry.newStatus,
    entry.changedBy,
  ]);

  await db.query<ResultSetHeader>(
    `INSERT INTO package_status_logs (package_id, old_status, new_status, changed_by) VALUES ${placeholders}`,
    values
  );
}

export async function findRouteStatusByPackageId(
  packageId: number,
  userId: number
): Promise<string | null> {
  const db = await connect();
  const [rows] = await db.query<(RowDataPacket & { status: string })[]>(
    `SELECT r.status
     FROM route_stops rs
     JOIN routes r ON r.id = rs.route_id
     WHERE rs.package_id = ?
       AND r.user_id = ?
     ORDER BY r.route_date DESC
     LIMIT 1`,
    [packageId, userId]
  );
  return rows[0]?.status ?? null;
}

export async function countBlockingPreviousStops(
  packageId: number,
  userId: number
): Promise<number> {
  const db = await connect();
  const [rows] = await db.query<(RowDataPacket & { total: number })[]>(
    `SELECT COUNT(*) AS total
     FROM route_stops current_stop
     JOIN routes r ON r.id = current_stop.route_id
     JOIN route_stops previous_stop
       ON previous_stop.route_id = current_stop.route_id
      AND previous_stop.stop_order < current_stop.stop_order
     JOIN packages previous_pkg ON previous_pkg.id = previous_stop.package_id
     WHERE current_stop.package_id = ?
       AND r.user_id = ?
       AND previous_pkg.status NOT IN ('delivered', 'failed')`,
    [packageId, userId]
  );

  return Number(rows[0]?.total ?? 0);
}
