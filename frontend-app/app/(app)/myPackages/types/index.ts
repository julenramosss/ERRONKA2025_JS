import type {
  PackageStatus,
  PackageWithAddress,
} from "../../../types/api/package.types";

export type ViewMode = "list" | "grid";

export interface ConfirmState {
  pkg: PackageWithAddress;
  to: PackageStatus;
}

export interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

export interface PackagesHeaderProps {
  total: number;
  counts: Record<string, number>;
  filter: PackageStatus | "all";
  setFilter: (f: PackageStatus | "all") => void;
  query: string;
  setQuery: (q: string) => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
}

export interface PackagesTableProps {
  packages: PackageWithAddress[];
}

export interface PackageMobileCardProps {
  pkg: PackageWithAddress;
}

export interface PackagesGridProps {
  packages: PackageWithAddress[];
}

export interface ConfirmModalProps {
  pkg: PackageWithAddress;
  to: PackageStatus;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}
