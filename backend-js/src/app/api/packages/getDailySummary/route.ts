import { requireAuth } from '@/app/lib/jwt';
import { handleError, res } from '@/app/lib/response';
import { getDailySummaryService } from './service/getDailySummary.service';
import { USER_ROLES } from '@/app/types';

export async function GET(request: Request) {
  try {
    requireAuth(request, [USER_ROLES.admin]);
    const summary = await getDailySummaryService();
    return res.ok(summary);
  } catch (error) {
    return handleError('[GET /api/packages/getDailySummary]', error);
  }
}
