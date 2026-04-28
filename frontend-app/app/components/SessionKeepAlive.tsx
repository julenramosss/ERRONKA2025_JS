'use client';

import { useQuery } from '@tanstack/react-query';
import { refreshTokenQueryOptions } from '../query/options/auth.options';

/**
 * Keeps the access token fresh by running the refresh query in the background.
 * Mount this once in the authenticated layout so it stays alive for the entire session.
 */
export function SessionKeepAlive() {
  useQuery(refreshTokenQueryOptions());
  return null;
}
