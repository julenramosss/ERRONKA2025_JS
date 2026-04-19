import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { listPackagesDto } from "./dto/listPackages.dto";
import { listPackagesService } from "./service/listPackages.service";
import { USER_ROLES } from "@/app/types";

export async function GET(request: Request) {
  try {
    requireAuth(request, [USER_ROLES.admin]);
    const url = new URL(request.url);
    const filters = listPackagesDto(url);
    const result = await listPackagesService(filters);
    return res.ok(result);
  } catch (error) {
    return handleError("[GET /api/packages/list]", error);
  }
}
