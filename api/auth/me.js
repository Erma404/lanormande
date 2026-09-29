import { allowMethods, send } from '../_lib/http.js';
import { getSession } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET'])) return;
  try {
    const session = await getSession(req);
    if (!session) return send(res, 401, { error: 'unauthenticated' });
    return send(res, 200, { email: session.email });
  } catch (error) {
    console.error('[admin] me', error);
    return send(res, 500, { error: 'server_error' });
  }
}
