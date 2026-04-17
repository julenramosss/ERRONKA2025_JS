import { Pool, createPool } from "mysql2/promise";

export async function connect(): Promise<Pool> {
  const connection = createPool({
    host: "localhost",
    user: "username",
    password: "password",
    database: "mysql-table",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
  });

  return connection;
}
