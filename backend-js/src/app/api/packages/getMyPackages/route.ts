import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { getMyPackagesService } from "./service/getMyPackages.service";
import { USER_ROLES } from "@/app/types";

export async function GET(request: Request) {
  try {
    const auth = requireAuth(request, [USER_ROLES.distributor]);
    const packages = await getMyPackagesService(auth.sub);
    return res.ok(packages.sort((a, b) => {
      const dateA = a.estimated_delivery ? new Date(a.estimated_delivery).getTime() : 0;
      const dateB = b.estimated_delivery ? new Date(b.estimated_delivery).getTime() : 0;
      return dateA - dateB;
    }));
  } catch (error) {
    return handleError("[GET /api/packages/getMyPackages]", error);
  }
}
