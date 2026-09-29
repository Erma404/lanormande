// Calendrier public : uniquement des plages de dates, aucune donnée de réservation.
import { allowMethods, send } from './_lib/http.js';
import { getBlockedRanges } from './_lib/availability.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET'])) return;
  try {
    const blocked = await getBlockedRanges();
    return send(res, 200, { blocked }, { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' });
  } catch (error) {
    console.error('[availability]', error);
    return send(res, 500, { error: 'server_error' });
  }
}
