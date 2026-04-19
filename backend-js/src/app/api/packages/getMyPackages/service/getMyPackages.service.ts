import { findMyPackagesToday } from "../repository/getMyPackages.repo";
import { PackageWithAddress } from "../types";

export async function getMyPackagesService(
  userId: number
): Promise<PackageWithAddress[]> {
  return findMyPackagesToday(userId);
}
