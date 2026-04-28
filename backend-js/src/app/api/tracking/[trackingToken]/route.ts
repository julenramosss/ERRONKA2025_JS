import { handleError, res } from '@/app/lib/response';
import { trackingService } from './service/tracking.service';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ trackingToken: string }> }
) {
  try {
    const { trackingToken } = await params;
    const result = await trackingService(trackingToken);
    return res.ok(result);
  } catch (error) {
    return handleError('[GET /api/tracking/[trackingToken]]', error);
  }
}
