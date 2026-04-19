import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { deletePackageDto } from "./dto/deletePackage.dto";
import { deletePackageService } from "./service/deletePackage.service";
import { USER_ROLES } from "@/app/types";

export async function DELETE(request: Request) {
  try {
    requireAuth(request, [USER_ROLES.admin]);
    const url = new URL(request.url);
    const { id } = deletePackageDto(url);
    await deletePackageService(id);
    return res.noContent();
  } catch (error) {
    return handleError("[DELETE /api/packages/delete]", error);
  }
}
