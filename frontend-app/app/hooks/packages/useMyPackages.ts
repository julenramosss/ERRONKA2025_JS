'use client';

import { useQuery } from '@tanstack/react-query';
import { myPackagesQueryOptions } from '../../query/options/packages.options';

export function useMyPackages() {
  return useQuery(myPackagesQueryOptions());
}
