import { Pool, createPool } from "mysql2/promise";
import {
  mysql_database,
  mysql_host,
  mysql_password,
  mysql_user,
} from "./envConfig";

let pool: Pool | null = null;

export async function connect(): Promise<Pool> {
  if (pool) return pool;
  pool = createPool({
    host: mysql_host,
    user: mysql_user,
    password: mysql_password,
    database: mysql_database,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
  });
  return pool;
}
