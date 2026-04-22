import { requireAuth } from "@/app/lib/jwt";
import { handleError, res } from "@/app/lib/response";
import { USER_ROLES } from "@/app/types";
import {
  continueFromPastService,
  findPendingPastRouteForUser,
} from "./service/continueFromPast.service";

export async function GET(request: Request) {
  try {
    const caller = requireAuth(request, [USER_ROLES.distributor]);
    const past = await findPendingPastRouteForUser(caller.sub);
    if (!past) return res.ok({ pending: null });
    return res.ok({
      pending: {
        route_id: past.id,
        route_date: past.route_date,
        status: past.status,
        pending_count: Number(past.pending_count),
        route_count: Number(past.route_count),
      },
    });
  } catch (error) {
    return handleError("[GET /api/routes/continueFromPast]", error);
  }
}

export async function POST(request: Request) {
  try {
    const caller = requireAuth(request, [USER_ROLES.distributor]);
    const result = await continueFromPastService(caller.sub);
    return res.ok(result);
  } catch (error) {
    return handleError("[POST /api/routes/continueFromPast]", error);
  }
}
