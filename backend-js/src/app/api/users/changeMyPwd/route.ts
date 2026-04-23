import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { validateChangeMyPwdDto } from "./dto/changeMyPwd.dto";
import { changeMyPwdService } from "./service/changeMyPwd.service";
import { ChangeMyPwdResponse } from "./types";

export async function PATCH(request: Request) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const dto = validateChangeMyPwdDto(body);

    await changeMyPwdService(auth.sub, dto);

    const response: ChangeMyPwdResponse = {
      message: "Password changed successfully",
    };

    return res.ok(response);
  } catch (error) {
    return handleError("[PATCH /api/users/changeMyPwd]", error);
  }
}
