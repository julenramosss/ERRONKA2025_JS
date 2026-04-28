'use client';

import { useQuery } from '@tanstack/react-query';
import { packageLogsQueryOptions } from '../../query/options/logs.options';
import type { PackageLogsRequest } from '../../utils/types/api/log.types';

export function usePackageLogs(params: PackageLogsRequest) {
  return useQuery(packageLogsQueryOptions(params));
}
