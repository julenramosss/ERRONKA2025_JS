import type { TrackingResponse } from "../../types/api/tracking.types";
import { apiClient } from "./client";

export async function getTracking(
  trackingToken: string,
): Promise<TrackingResponse> {
  const response = await apiClient.get<TrackingResponse>(
    `/tracking/${trackingToken}`,
  );

  return response.data;
}
