import { allowMethods, readJson, send } from '../_lib/http.js';
import { getSession } from '../_lib/auth.js';
import { addManual, getAirbnb, getAirbnbUrl, getManual, isAirbnbUrl, isValidDate, removeManual, setAirbnbUrl } from '../_lib/availability.js';

async function snapshot(force = false) {
  const today = new Date().toISOString().slice(0, 10);
  const [airbnb, manual, airbnbUrl] = await Promise.all([getAirbnb({ force }), getManual(), getAirbnbUrl()]);
  return {
    airbnbUrl,
    airbnb: { ...airbnb, ranges: airbnb.ranges.filter(([, end]) => end > today) },
    manual: manual.filter((block) => block.end > today)
  };
}

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['GET', 'POST'])) return;
  try {
    if (!(await getSession(req))) return send(res, 401, { error: 'unauthenticated' });
    if (req.method === 'GET') return send(res, 200, await snapshot());

    const body = await readJson(req);
    switch (body.action) {
      case 'sync':
        return send(res, 200, await snapshot(true));
      case 'setAirbnbUrl': {
        const url = String(body.url || '').trim();
        if (url && !isAirbnbUrl(url)) return send(res, 400, { error: 'invalid_url' });
        await setAirbnbUrl(url);
        return send(res, 200, await snapshot(true));
      }
      case 'addBlock': {
        const { start, end } = body;
        if (!isValidDate(start) || !isValidDate(end) || end <= start) return send(res, 400, { error: 'invalid_range' });
        await addManual({ start, end, note: body.note });
        return send(res, 200, await snapshot());
      }
      case 'removeBlock':
        await removeManual(String(body.id || ''));
        return send(res, 200, await snapshot());
      default:
        return send(res, 400, { error: 'unknown_action' });
    }
  } catch (error) {
    console.error('[admin] availability', error);
    return send(res, 500, { error: 'server_error' });
  }
}
