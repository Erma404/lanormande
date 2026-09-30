// Textes du site modifiés depuis l'admin (public, lu au chargement de la page).
import { allowMethods, send } from './_lib/http.js';
import { getOverrides } from './_lib/content.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET'])) return;
  try {
    return send(res, 200, await getOverrides(), { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300' });
  } catch (error) {
    console.error('[content]', error);
    return send(res, 500, { error: 'server_error' });
  }
}
