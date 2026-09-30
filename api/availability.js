// Calendrier public : uniquement des plages de dates, aucune donnée de réservation.
import { route, send } from './_lib/http.js';
import { getBlockedRanges } from './_lib/availability.js';

export default route(['GET'], async (req, res) => {
  const blocked = await getBlockedRanges();
  return send(res, 200, { blocked }, { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' });
}, 'availability');
