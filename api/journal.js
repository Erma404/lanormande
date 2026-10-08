// Mesure d'audience et tableau de bord, regroupés en une seule fonction Vercel (l'offre Hobby en autorise 12).
// POST sans « action » : événement envoyé par le site (visite, clic, étape de réservation), public.
// GET et POST avec « action » : tableau de bord de l'admin, session obligatoire.
import { clientIp, HttpError, readJson, route, send } from './_lib/http.js';
import { getSession } from './_lib/auth.js';
import { getAirbnbStays, getManual, isValidDate } from './_lib/availability.js';
import { list } from './_lib/requests.js';
import { hit } from './_lib/store.js';
import { daysBetween, fieldsFor, getAirbnbRevenue, readRange, record, setAirbnbRevenue } from './_lib/journal.js';
import { estimateRequest } from '../src/pricing.js';

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

async function track(req, res, body) {
  // Limite par IP (compteur effacé au bout d'une minute) : protège les chiffres d'un envoi en boucle.
  if ((await hit(`rl:journal:${clientIp(req)}`, 60)) > 120) return send(res, 200, { ok: true });
  await record(fieldsFor(body, req.headers['user-agent']));
  return send(res, 200, { ok: true });
}

// Données brutes du tableau de bord ; les indicateurs sont calculés dans l'admin.
async function dashboard(req) {
  const url = new URL(req.url, 'http://localhost');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  if (!isValidDate(from) || !isValidDate(to) || to < from || daysBetween(from, to) > 400) throw new HttpError(400, 'invalid_range');

  const [traffic, requests, airbnb, manual, airbnbRevenue] = await Promise.all([readRange(from, to), list(), getAirbnbStays(), getManual(), getAirbnbRevenue()]);
  return {
    traffic,
    // Sans nom, email, téléphone ni message : le tableau de bord n'en a pas besoin.
    requests: requests.map((request) => ({
      id: request.id,
      status: request.status,
      arrival: request.arrival,
      departure: request.departure,
      guests: request.guests,
      lang: request.lang,
      cta: request.cta || '',
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      amount: Number.isFinite(request.amount) ? request.amount : null,
      estimate: estimateRequest(request)?.total ?? null,
      blockId: request.blockId || null
    })),
    airbnb: { ranges: airbnb.ranges, syncedAt: airbnb.syncedAt, configured: airbnb.configured },
    manual: manual.map((block) => ({ id: block.id, start: block.start, end: block.end })),
    airbnbRevenue
  };
}

export default route(['GET', 'POST'], async (req, res) => {
  if (req.method === 'GET') {
    if (!(await getSession(req))) return send(res, 401, { error: 'unauthenticated' });
    return send(res, 200, await dashboard(req));
  }

  const body = await readJson(req);
  if (!body.action) return track(req, res, body);

  if (!(await getSession(req))) return send(res, 401, { error: 'unauthenticated' });
  if (body.action === 'setAirbnbRevenue') {
    const month = String(body.month || '');
    const amount = body.amount === null || body.amount === '' ? null : Math.round(Number(body.amount));
    if (!MONTH.test(month)) return send(res, 400, { error: 'invalid_month' });
    if (amount !== null && (!Number.isFinite(amount) || amount < 0 || amount > 1000000)) return send(res, 400, { error: 'invalid_amount' });
    await setAirbnbRevenue(month, amount);
    return send(res, 200, { airbnbRevenue: await getAirbnbRevenue() });
  }
  return send(res, 400, { error: 'unknown_action' });
}, 'journal');
