import { clientIp, readJson, route, send } from './_lib/http.js';
import { create, isAvailable, validate } from './_lib/requests.js';
import { sendRequestConfirmation, sendRequestNotification } from './_lib/mail.js';
import { hit } from './_lib/store.js';

const HOUR = 60 * 60;

export default route(['POST'], async (req, res) => {
  const body = await readJson(req);
  // Champ invisible pour les humains : un robot qui le remplit reçoit une fausse confirmation.
  if (body.website) return send(res, 200, { ok: true });

  const { request, error } = validate(body);
  if (error) return send(res, 400, { error });
  if (!(await isAvailable(request.arrival, request.departure))) return send(res, 409, { error: 'unavailable' });

  // Seules les demandes valides comptent : une faute de saisie ne bloque pas le voyageur.
  const ip = clientIp(req);
  const [byHour, byDay] = await Promise.all([hit(`rl:request:ip:${ip}`, HOUR), hit(`rl:request:ipday:${ip}`, 24 * HOUR)]);
  if (byHour > 5 || byDay > 15) return send(res, 429, { error: 'too_many_requests' });

  const entry = await create(request);
  // Les emails sont un bonus : la demande est enregistrée même si l'un d'eux échoue.
  const [notified, confirmed] = await Promise.allSettled([sendRequestNotification(entry), sendRequestConfirmation(entry)]);
  if (notified.status === 'rejected') console.error('[requests] notification', notified.reason);
  if (confirmed.status === 'rejected') console.error('[requests] confirmation', confirmed.reason);
  return send(res, 201, { ok: true });
}, 'requests');
