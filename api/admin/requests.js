import { readJson, route, send } from '../_lib/http.js';
import { getSession } from '../_lib/auth.js';
import { getBlockedRanges } from '../_lib/availability.js';
import { list, remove, setStatus, STATUSES } from '../_lib/requests.js';

// Chaque demande en attente indique si ses dates ont été prises entre-temps.
async function snapshot() {
  const [requests, blocked] = await Promise.all([list(), getBlockedRanges()]);
  return {
    requests: requests.map((request) => ({
      ...request,
      conflict: request.status === 'new' && blocked.some(([from, to]) => request.arrival < to && request.departure > from)
    }))
  };
}

export default route(['GET', 'POST'], async (req, res) => {
  if (!(await getSession(req))) return send(res, 401, { error: 'unauthenticated' });
  if (req.method === 'GET') return send(res, 200, await snapshot());

  const body = await readJson(req);
  const id = String(body.id || '');
  switch (body.action) {
    case 'setStatus': {
      if (!STATUSES.includes(body.status)) return send(res, 400, { error: 'invalid_status' });
      const { error } = await setStatus(id, body.status);
      if (error) return send(res, error === 'not_found' ? 404 : 409, { error });
      return send(res, 200, await snapshot());
    }
    case 'delete':
      await remove(id);
      return send(res, 200, await snapshot());
    default:
      return send(res, 400, { error: 'unknown_action' });
  }
}, 'admin requests');
