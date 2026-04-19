import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { getMyPackagesService } from "./service/getMyPackages.service";
import { USER_ROLES } from "@/app/types";

export async function GET(request: Request) {
  try {
    const auth = requireAuth(request, [USER_ROLES.distributor]);
    const packages = await getMyPackagesService(auth.sub);
    return res.ok(packages);
  } catch (error) {
    return handleError("[GET /api/packages/getMyPackages]", error);
  }
}
