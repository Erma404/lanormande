import { readJson, route, send } from '../_lib/http.js';
import { getSession } from '../_lib/auth.js';
import { getOverrides, saveOverrides } from '../_lib/content.js';
import { getGrid, saveGrid } from '../_lib/pricing.js';

// Textes (onglet Contenus) et grille tarifaire (onglet Tarifs) : une seule fonction pour rester
// sous la limite de 12 fonctions du compte Vercel Hobby.
export default route(['GET', 'POST'], async (req, res) => {
  if (!(await getSession(req))) return send(res, 401, { error: 'unauthenticated' });
  if (req.method === 'GET') {
    const [overrides, pricing] = await Promise.all([getOverrides(), getGrid()]);
    return send(res, 200, { ...overrides, pricing });
  }

  const body = await readJson(req);
  if (body.pricing) {
    const pricing = await saveGrid(body.pricing);
    if (!pricing) return send(res, 400, { error: 'invalid_pricing' });
    return send(res, 200, { pricing });
  }
  const saved = await saveOverrides(body.lang, body.values);
  if (!saved) return send(res, 400, { error: 'invalid_content' });
  return send(res, 200, saved);
}, 'admin content');
