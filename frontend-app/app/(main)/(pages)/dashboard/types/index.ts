import { PackageWithAddress } from "../../../../utils/types/api/package.types";

export interface NextDeliveriesProps {
  packages: PackageWithAddress[];
}

export interface RecentActivityProps {
  packages: PackageWithAddress[];
}

export interface AssignedPackageLatLng {
  lat: number;
  lng: number;
  label: string;
}
