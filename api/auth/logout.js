import { route, send } from '../_lib/http.js';
import { destroySession } from '../_lib/auth.js';

export default route(['POST'], async (req, res) => {
  const cookie = await destroySession(req);
  return send(res, 200, { ok: true }, { 'Set-Cookie': cookie });
}, 'admin logout');
