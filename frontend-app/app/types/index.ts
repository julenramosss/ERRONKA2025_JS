import { PackageStatus } from "./api/package.types";

export const USER_ROLES = {
  admin: "admin",
  distributor: "distributor",
} as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const STATUS_LABEL: Record<PackageStatus, string> = {
  pending: "Zain",
  assigned: "Esleituta",
  in_transit: "Garraioan",
  delivered: "Entregatuta",
  failed: "Huts",
};
