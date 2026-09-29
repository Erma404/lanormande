import { allowMethods, send } from '../_lib/http.js';
import { destroySession } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['POST'])) return;
  try {
    const cookie = await destroySession(req);
    return send(res, 200, { ok: true }, { 'Set-Cookie': cookie });
  } catch (error) {
    console.error('[admin] logout', error);
    return send(res, 500, { error: 'server_error' });
  }
}
