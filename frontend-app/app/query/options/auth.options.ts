import { queryOptions } from "@tanstack/react-query";
import { getMe } from "../../lib/api/auth-api";
import { authKeys } from "../keys/auth.keys";

const ME_STALE_TIME = 2 * 60 * 1000;

export function meQueryOptions() {
  return queryOptions({
    queryKey: authKeys.me(),
    queryFn: getMe,
    staleTime: ME_STALE_TIME,
  });
}
