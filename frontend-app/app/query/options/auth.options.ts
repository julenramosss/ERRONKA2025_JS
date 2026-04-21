import { queryOptions } from "@tanstack/react-query";
import { getMe, refresh } from "../../lib/api/auth-api";
import { authKeys } from "../keys/auth.keys";
import { setAccessToken } from "../../lib/api/helpers/auth-token";

const ME_STALE_TIME = 10 * 60 * 1000;

export function meQueryOptions() {
  return queryOptions({
    queryKey: authKeys.me(),
    queryFn: getMe,
    staleTime: ME_STALE_TIME,
  });
}

export const refreshTokenQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.refresh(),
    queryFn: async () => {
      const response = await refresh();
      setAccessToken(response.access_token);
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchInterval: 12 * 60 * 1000, // Refetch cada 12 minutos (antes de que expire a los 15)
    refetchIntervalInBackground: true, // Seguir refrescando en background
  });
