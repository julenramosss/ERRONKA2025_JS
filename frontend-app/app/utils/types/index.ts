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

export const PACKAGE_STATUSES = {
  pending: "pending",
  assigned: "assigned",
  in_transit: "in_transit",
  delivered: "delivered",
  failed: "failed",
} as const;
export type PackageStatus =
  (typeof PACKAGE_STATUSES)[keyof typeof PACKAGE_STATUSES];
