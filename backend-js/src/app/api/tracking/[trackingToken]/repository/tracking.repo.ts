import { connect } from '@/app/config/dbConfig';
import { RowDataPacket } from 'mysql2/promise';
import { TrackingResult } from '../types';
import { PackageStatus } from '@/app/types';

export async function findPackageByTrackingToken(
  token: string
): Promise<TrackingResult | null> {
  const db = await connect();

  const [rows] = await db.query<
    (RowDataPacket & {
      tracking_code: string;
      recipient_name: string;
      status: PackageStatus;
      estimated_delivery: string | null;
      street: string;
      city: string;
      postal_code: string;
      changed_at: string | null;
    })[]
  >(
    `SELECT
       p.tracking_code,
       p.recipient_name,
       p.status,
       p.estimated_delivery,
       a.street,
       a.city,
       a.postal_code,
       (
         SELECT MAX(l.changed_at)
         FROM package_status_logs l
         WHERE l.package_id = p.id
       ) AS changed_at
     FROM tokens t
     JOIN packages p ON t.package_id = p.id
     JOIN addresses a ON p.address_id = a.id
     WHERE t.token = ?
       AND t.type = 'tracking_token'
       AND t.revoked = FALSE
       AND t.expires_at > NOW()`,
    [token]
  );

  if (!rows[0]) return null;

  const row = rows[0];
  return {
    tracking_code: row.tracking_code,
    recipient_name: row.recipient_name,
    status: row.status,
    estimated_delivery: row.estimated_delivery ?? null,
    address: {
      street: row.street,
      city: row.city,
      postal_code: row.postal_code,
    },
    last_update: row.changed_at ?? null,
  };
}
