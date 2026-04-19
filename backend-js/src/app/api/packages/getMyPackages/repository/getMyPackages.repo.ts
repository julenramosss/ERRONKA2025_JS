import { connect } from "@/app/config/dbConfig";
import { RowDataPacket } from "mysql2/promise";
import { PackageWithAddress } from "../types";

export async function findMyPackagesToday(
  userId: number
): Promise<PackageWithAddress[]> {
  const db = await connect();
  const [rows] = await db.query<(RowDataPacket & PackageWithAddress)[]>(
    `SELECT p.*, a.street, a.city, a.postal_code, a.latitude, a.longitude, a.country
     FROM packages p
     JOIN addresses a ON p.address_id = a.id
     WHERE p.assigned_to = ?
       AND (
         (p.estimated_delivery IS NOT NULL AND DATE(p.estimated_delivery) = CURDATE())
         OR (p.estimated_delivery IS NULL AND DATE(p.created_at) = CURDATE())
       )
     ORDER BY p.id ASC`,
    [userId]
  );
  return rows;
}
