import { connect } from "../config/dbConfig";
import {
  PACKAGE_STATUSES,
  PackageStatus,
  USER_ROLES,
  UserRole,
} from "../types";

export const isString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

export const isEmail = (value: unknown): value is string => {
  return (
    isString(value) &&
    value.includes("@") &&
    value.indexOf("@") > 0 &&
    value.indexOf("@") < value.length - 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
    value.trim().length > 5
  );
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

export const isPositiveInteger = (value: unknown): value is number => {
  return isNumber(value) && Number.isInteger(value) && value > 0;
};

export const isUserRole = (value: unknown): value is UserRole => {
  return (
    isString(value) && Object.values(USER_ROLES).includes(value as UserRole)
  );
};

export const isPackageValidStatus = (
  value: unknown
): value is PackageStatus => {
  return (
    value !== null &&
    isString(value) &&
    Object.values(PACKAGE_STATUSES).includes(value as PackageStatus)
  );
};

export async function isValidUser(user_id: number): Promise<boolean> {
  const db = await connect();
  const [rows] = await db.execute("SELECT id FROM users WHERE id = ?", [
    user_id,
  ]);

  return Array.isArray(rows) && rows.length > 0;
}

export async function isValidPackage(package_id: number): Promise<boolean> {
  const db = await connect();
  const [rows] = await db.execute("SELECT id FROM packages WHERE id = ?", [
    package_id,
  ]);

  return Array.isArray(rows) && rows.length > 0;
}
