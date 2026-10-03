import { readJson, route, send } from '../_lib/http.js';
import { getSession } from '../_lib/auth.js';
import { getPromo, isLive, savePromo } from '../_lib/promo.js';

export default route(['GET', 'POST'], async (req, res) => {
  if (!(await getSession(req))) return send(res, 401, { error: 'unauthenticated' });
  if (req.method === 'GET') {
    const promo = await getPromo();
    return send(res, 200, { promo, live: isLive(promo) });
  }

  const { promo, error } = await savePromo(await readJson(req));
  if (error) return send(res, 400, { error });
  return send(res, 200, { promo, live: isLive(promo) });
}, 'admin promo');
