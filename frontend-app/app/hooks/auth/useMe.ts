'use client';

import { useQuery } from '@tanstack/react-query';
import { meQueryOptions } from '../../query/options/auth.options';

export function useMe() {
  return useQuery(meQueryOptions());
}
