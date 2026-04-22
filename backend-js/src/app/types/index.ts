export const USER_ROLES = {
  admin: "admin",
  distributor: "distributor",
} as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const PACKAGE_STATUSES = {
  pending: "pending",
  assigned: "assigned",
  in_transit: "in_transit",
  delivered: "delivered",
  undelivered: "undelivered",
  failed: "failed",
} as const;
export type PackageStatus =
  (typeof PACKAGE_STATUSES)[keyof typeof PACKAGE_STATUSES];

export const TOKEN_TYPES = {
  refresh_token: "refresh_token",
  tracking_token: "tracking_token",
  reset_pwd_token: "reset_pwd_token",
  activate_account_token: "activate_account_token",
} as const;
export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

export interface SendPackageTrackingEmailParams {
  recipientEmail: string;
  recipientName: string;
  trackingUrl: string;
  packageStatus: PackageStatus;
  distributorName?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
}
