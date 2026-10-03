// Connexion admin regroupée en une seule fonction Vercel (l'offre Hobby en autorise 12) :
// /api/auth/<action> est réécrit vers /api/auth?action=<action> (vercel.json).
import { send } from './_lib/http.js';
import logout from './_auth/logout.js';
import me from './_auth/me.js';
import requestCode from './_auth/request-code.js';
import verify from './_auth/verify.js';

const handlers = { logout, me, 'request-code': requestCode, verify };

export default async function auth(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const action = url.searchParams.get('action') || url.pathname.split('/').pop();
  const handler = Object.hasOwn(handlers, action) ? handlers[action] : null;
  if (!handler) return send(res, 404, { error: 'not_found' });
  return handler(req, res);
}
