// Bannière de promotion en cours (public) : null hors période ou si désactivée.
import { route, send } from './_lib/http.js';
import { getPromo, publicPromo } from './_lib/promo.js';

export default route(['GET'], async (req, res) => {
  const promo = publicPromo(await getPromo());
  return send(res, 200, { promo }, { 'Cache-Control': 'public, max-age=0, must-revalidate', 'Vercel-CDN-Cache-Control': 'max-age=30' });
}, 'promo');
