import type { ReactNode } from "react";
import type { PackageLogEntry } from "../../../../types/api/log.types";
import type { PackageWithAddress } from "../../../../types/api/package.types";

export interface PackageDetailHeaderProps {
  pkg: PackageWithAddress;
}

export interface PackageInfoCardProps {
  pkg: PackageWithAddress;
}

export interface PackageStatusHistoryProps {
  logs: PackageLogEntry[];
  isLoading: boolean;
}

export interface DeliveryLocationProps {
  pkg: PackageWithAddress;
}

export interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
  icon: ReactNode;
  span?: boolean;
}
