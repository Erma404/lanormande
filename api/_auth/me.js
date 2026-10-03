import { route, send } from '../_lib/http.js';
import { getSession } from '../_lib/auth.js';

export default route(['GET'], async (req, res) => {
  const session = await getSession(req);
  if (!session) return send(res, 401, { error: 'unauthenticated' });
  return send(res, 200, { email: session.email });
}, 'admin me');
