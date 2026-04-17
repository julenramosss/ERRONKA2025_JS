import { meService } from "./service/me.service";
import { handleError, res } from "@/app/lib/response";
import { requireAuth } from "@/app/lib/jwt";

export async function GET(request: Request) {
  try {
    const auth = requireAuth(request);
    const me = await meService(auth.sub);
    return res.ok(me);
  } catch (error) {
    return handleError("[GET /api/auth/me]", error);
  }
}