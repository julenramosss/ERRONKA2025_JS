import type {
  ContinueFromPastResponse,
  GetMyDailyRouteResponse,
  GetPendingPastRouteResponse,
  UpdateArrivalRequest,
  UpdateArrivalResponse,
  UpdateRouteStatusRequest,
  UpdateRouteStatusResponse,
} from '../../utils/types/api/route.types';
import { apiClient } from './helpers/client';
import { omitUndefinedParams } from './helpers/response-helpers';

export async function getMyDailyRoute(
  date?: string
): Promise<GetMyDailyRouteResponse> {
  const response = await apiClient.get<GetMyDailyRouteResponse>(
    '/routes/getMyDaily',
    {
      params: omitUndefinedParams({ date }),
    }
  );

  return response.data;
}

export async function updateRouteStatus(
  routeId: number,
  payload: UpdateRouteStatusRequest
): Promise<UpdateRouteStatusResponse> {
  const response = await apiClient.patch<UpdateRouteStatusResponse>(
    `/routes/updateStatus/${routeId}`,
    payload
  );

  return response.data;
}

export async function updateArrival(
  payload: UpdateArrivalRequest
): Promise<UpdateArrivalResponse> {
  const response = await apiClient.patch<UpdateArrivalResponse>(
    '/stops/updateArrival',
    payload
  );

  return response.data;
}

export async function getPendingPastRoute(): Promise<GetPendingPastRouteResponse> {
  const response = await apiClient.get<GetPendingPastRouteResponse>(
    '/routes/continueFromPast'
  );
  return response.data;
}

export async function continueFromPast(): Promise<ContinueFromPastResponse> {
  const response = await apiClient.post<ContinueFromPastResponse>(
    '/routes/continueFromPast'
  );
  return response.data;
}
