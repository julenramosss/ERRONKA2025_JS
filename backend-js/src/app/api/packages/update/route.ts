import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { updatePackageDto } from "./dto/updatePackage.dto";
import { updatePackageService } from "./service/updatePackage.service";
import { USER_ROLES } from "@/app/types";

export async function PATCH(request: Request) {
  try {
    const auth = requireAuth(request, [USER_ROLES.admin]);
    const url = new URL(request.url);
    const body = await request.json();
    const { id, packageInfo, address_info } = updatePackageDto(
      url.searchParams.get("id"),
      body
    );
    const updated = await updatePackageService(
      id,
      packageInfo,
      address_info,
      auth.sub
    );
    return res.ok(updated);
  } catch (error) {
    return handleError("[PATCH /api/packages/update]", error);
  }
}
