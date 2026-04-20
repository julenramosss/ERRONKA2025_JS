import { queryOptions } from "@tanstack/react-query";
import { getMyPackages, getPackageById } from "../../lib/api/packages-api";
import { packagesKeys } from "../keys/packages.keys";

const PACKAGES_STALE_TIME = 5 * 60 * 1000;

export function myPackagesQueryOptions() {
  return queryOptions({
    queryKey: packagesKeys.myPackages(),
    queryFn: getMyPackages,
    staleTime: PACKAGES_STALE_TIME,
  });
}

export function packageByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: packagesKeys.detail(id),
    queryFn: () => getPackageById(id),
    staleTime: PACKAGES_STALE_TIME,
  });
}
