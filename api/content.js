// Textes du site modifiés depuis l'admin (public, lu au chargement de la page).
import { route, send } from './_lib/http.js';
import { getOverrides } from './_lib/content.js';

export default route(['GET'], async (req, res) => {
  const { fr = {}, en = {} } = await getOverrides();
  return send(res, 200, { fr, en }, { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300' });
}, 'content');
