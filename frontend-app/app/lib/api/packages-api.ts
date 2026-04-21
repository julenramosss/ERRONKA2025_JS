import type {
  GetMyPackagesResponse,
  GetPackageByIdResponse,
  UpdatePackageStatusRequest,
  UpdatePackageStatusResponse,
} from "../../utils/types/api/package.types";
import { apiClient } from "./helpers/client";

export async function getMyPackages(): Promise<GetMyPackagesResponse> {
  const response = await apiClient.get<GetMyPackagesResponse>(
    "/packages/getMyPackages"
  );

  return response.data;
}

export async function getPackageById(
  id: number
): Promise<GetPackageByIdResponse> {
  const response = await apiClient.get<GetPackageByIdResponse>(
    "/packages/getById",
    {
      params: { id },
    }
  );

  return response.data;
}

export async function updatePackageStatus(
  payload: UpdatePackageStatusRequest
): Promise<UpdatePackageStatusResponse> {
  const response = await apiClient.patch<UpdatePackageStatusResponse>(
    "/packages/updateStatus",
    payload
  );

  return response.data;
}
