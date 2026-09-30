import { readJson, route, send } from '../_lib/http.js';
import { getSession } from '../_lib/auth.js';
import { getOverrides, saveOverrides } from '../_lib/content.js';

export default route(['GET', 'POST'], async (req, res) => {
  if (!(await getSession(req))) return send(res, 401, { error: 'unauthenticated' });
  if (req.method === 'GET') return send(res, 200, await getOverrides());

  const { lang, values } = await readJson(req);
  const saved = await saveOverrides(lang, values);
  if (!saved) return send(res, 400, { error: 'invalid_content' });
  return send(res, 200, saved);
}, 'admin content');
