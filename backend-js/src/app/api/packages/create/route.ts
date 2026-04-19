import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { createPackageDto } from "./dto/createPackage.dto";
import { createPackageService } from "./service/createPackage.service";
import { USER_ROLES } from "@/app/types";

export async function POST(request: Request) {
  try {
    requireAuth(request, [USER_ROLES.admin]);
    const body = await request.json();
    const { packageInfo, address_info } = await createPackageDto(body);
    const createdPackage = await createPackageService(
      packageInfo,
      address_info
    );
    return res.created(createdPackage);
  } catch (error) {
    return handleError("[POST /api/packages/create]", error);
  }
}
