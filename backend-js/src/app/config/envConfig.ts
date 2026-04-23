export const mysql_user = process.env.MYSQL_USER;
export const mysql_password = process.env.MYSQL_PASSWORD;
export const mysql_host = process.env.MYSQL_HOST;
export const mysql_database = process.env.MYSQL_DATABASE;

export const resend_api_key = process.env.RESEND_API_KEY;

export const directions_api_key = process.env.GOOGLE_DIRECTIONS_API_KEY!;

export const isDev = process.env.NODE_ENV !== "production";

export const jwt_secret =
  process.env.JWT_SECRET ??
  "kjhaf7ya(/SFYAOUhf98ya9fya(SYf9a8fY)8sfyf08=A)uf98UF98U)OAIfu98af98u";
export const jwt_access_expires_in = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";
export const jwt_refresh_expires_days = Number(
  process.env.JWT_REFRESH_EXPIRES_DAYS ?? 7
);
export const tracking_expires_days = Number(
  process.env.TRACKING_EXPIRES_DAYS ?? 30
);
export const tracking_base_url =
  process.env.TRACKING_BASE_URL ??
  (isDev
    ? "http://localhost:80/tracking/"
    : "https://tolosaerronka.com/tracking/");

export const reset_expires_minutes = 15;
export const reset_base_url =
  process.env.RESET_BASE_URL ??
  (isDev
    ? "http://localhost:3000/resetPassword"
    : "https://tolosaerronka.com/resetPassword");

export const default_user_password =
  process.env.DEFAULT_USER_PASSWORD ??
  "lkasjdhAKJHSdIH23497gkG876876ad87a6daafaa";

export const secure = isDev ? ", Secure; " : "";
