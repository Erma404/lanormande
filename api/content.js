// Textes du site modifiés depuis l'admin et grille tarifaire (public, lu au chargement de la page).
import { route, send } from './_lib/http.js';
import { getOverrides } from './_lib/content.js';
import { getGrid } from './_lib/pricing.js';

export default route(['GET'], async (req, res) => {
  const [{ fr = {}, en = {} }, pricing] = await Promise.all([getOverrides(), getGrid()]);
  return send(res, 200, { fr, en, pricing }, { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300' });
}, 'content');
