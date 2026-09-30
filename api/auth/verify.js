import { clientIp, readJson, route, send } from '../_lib/http.js';
import { checkCode, createSession, emailKey, isAdminEmail, normalizeEmail } from '../_lib/auth.js';
import { del, get, hit } from '../_lib/store.js';

const DAY = 24 * 60 * 60;
const MAX_FAILURES_PER_DAY = 20; // au-delà, l'adresse est bloquée 24 h (anti force brute)

export default route(['POST'], async (req, res) => {
  const body = await readJson(req);
  const email = normalizeEmail(body.email).slice(0, 254);
  const code = String(body.code || '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(code)) return send(res, 400, { error: 'invalid_code' });

  const key = emailKey(email);
  const failuresKey = `rl:verify:fail:${key}`;
  const [byIp, failures] = await Promise.all([hit(`rl:verify:ip:${clientIp(req)}`, 15 * 60), get(failuresKey)]);
  if (byIp > 30 || (failures || 0) >= MAX_FAILURES_PER_DAY) return send(res, 429, { error: 'too_many_requests' });

  // Même traitement pour toutes les adresses ; seule une adresse admin peut ouvrir une session.
  const result = await checkCode(email, code);
  if (result.status === 'ok' && isAdminEmail(email)) {
    await del(failuresKey);
    const cookie = await createSession(email);
    return send(res, 200, { ok: true, email }, { 'Set-Cookie': cookie });
  }

  await hit(failuresKey, DAY);
  if (result.status === 'invalid') return send(res, 400, { error: 'invalid_code', remaining: result.remaining });
  return send(res, 400, { error: 'expired_code' });
}, 'admin verify');
