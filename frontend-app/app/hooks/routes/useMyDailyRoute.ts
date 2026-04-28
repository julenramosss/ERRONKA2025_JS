'use client';

import { useQuery } from '@tanstack/react-query';
import { myDailyRouteQueryOptions } from '../../query/options/routes.options';

export function useMyDailyRoute(date?: string) {
  return useQuery(myDailyRouteQueryOptions(date));
}
