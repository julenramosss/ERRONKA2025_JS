import { connect } from "@/app/config/dbConfig";
import { RowDataPacket } from "mysql2/promise";
import { ListPackagesFilters, ListPackagesResult, PackageWithAddress } from "../types";

export async function listPackages(
  filters: ListPackagesFilters
): Promise<ListPackagesResult> {
  const db = await connect();
  const { status, assigned_to, city, page, limit } = filters;
  const offset = (page - 1) * limit;

  const clauses: string[] = [];
  const params: unknown[] = [];

  if (status !== undefined) {
    clauses.push("p.status = ?");
    params.push(status);
  }
  if (assigned_to !== undefined) {
    clauses.push("p.assigned_to = ?");
    params.push(assigned_to);
  }
  if (city !== undefined) {
    clauses.push("a.city LIKE ?");
    params.push(`%${city}%`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const [countRows] = await db.query<(RowDataPacket & { total: number })[]>(
    `SELECT COUNT(*) as total FROM packages p JOIN addresses a ON p.address_id = a.id ${where}`,
    params
  );
  const total = countRows[0].total;

  const [rows] = await db.query<(RowDataPacket & PackageWithAddress)[]>(
    `SELECT p.*, a.street, a.city, a.postal_code, a.latitude, a.longitude, a.country
     FROM packages p
     JOIN addresses a ON p.address_id = a.id
     ${where}
     ORDER BY p.id DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { packages: rows, total, page, limit };
}
