import { validateRefreshDto } from './dtos/refresh.dto';
import { refreshService } from './service/refresh.service';
import { handleError, res } from '@/app/lib/response';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') ?? '';
    const refresh_token =
      cookieHeader
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith('refresh_token='))
        ?.slice('refresh_token='.length) ?? null;

    const dto = validateRefreshDto({ refresh_token });
    const result = await refreshService(dto);
    return res.ok({ access_token: result.access_token }, [
      { name: 'refresh_token', value: result.refresh_token, httpOnly: true },
    ]);
  } catch (error) {
    return handleError('[POST /api/auth/refresh]', error);
  }
}
