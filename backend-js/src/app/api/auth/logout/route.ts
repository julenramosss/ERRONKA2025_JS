import { handleError, res } from '@/app/lib/response';
import { requireAuth } from '@/app/lib/jwt';
import { revokeRefreshToken } from './repository/logout.repository';

export async function POST(request: Request) {
  try {
    const auth = requireAuth(request);
    const cookieHeader = request.headers.get('cookie') ?? '';
    const refresh_token = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('refresh_token='))
      ?.split('=')[1]
      ?.trim();

    await revokeRefreshToken(refresh_token!, auth.sub);
    return res.ok({ message: 'Saioa itxi da' }, undefined, ['refresh_token']);
  } catch (error) {
    return handleError('[POST /api/auth/logout]', error);
  }
}
