export const mysql_username = process.env.MYSQL_USERNAME;
export const mysql_password = process.env.MYSQL_PASSWORD;
export const mysql_host = process.env.MYSQL_HOST;
export const mysql_database = process.env.MYSQL_DATABASE;

export const jwt_secret = process.env.JWT_SECRET ?? "dev-secret-change-me";
export const jwt_access_expires_in = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";
export const jwt_refresh_expires_days = Number(
  process.env.JWT_REFRESH_EXPIRES_DAYS ?? 7
);
export const tracking_expires_days = Number(
  process.env.TRACKING_EXPIRES_DAYS ?? 30
);
export const tracking_base_url =
  process.env.TRACKING_BASE_URL ?? "https://pakag.eus/tracking";

export const default_user_password =
  process.env.DEFAULT_USER_PASSWORD ?? "defaultPassword";