import { Pool, createPool } from "mysql2/promise";
import {
  mysql_database,
  mysql_host,
  mysql_password,
  mysql_port,
  mysql_user,
  mysql_ca_cert,
} from "./envConfig";

let pool: Pool | null = null;

export async function connect(): Promise<Pool> {
  if (pool) return pool;
  pool = createPool({
    host: mysql_host,
    port: mysql_port,
    user: mysql_user,
    password: mysql_password,
    database: mysql_database,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    ssl: mysql_ca_cert
      ? { ca: mysql_ca_cert, rejectUnauthorized: true }
      : { rejectUnauthorized: false },
  });
  return pool;
}
