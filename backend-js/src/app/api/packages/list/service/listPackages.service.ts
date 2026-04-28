import { listPackages } from '../repository/listPackages.repo';
import { ListPackagesFilters, ListPackagesResult } from '../types';

export async function listPackagesService(
  filters: ListPackagesFilters
): Promise<ListPackagesResult> {
  return listPackages(filters);
}
