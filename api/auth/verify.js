import { allowMethods, clientIp, readJson, send } from '../_lib/http.js';
import { checkCode, createSession, isAdminEmail, normalizeEmail } from '../_lib/auth.js';
import { hit } from '../_lib/store.js';

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['POST'])) return;
  const body = await readJson(req);
  const email = normalizeEmail(body.email);
  const code = String(body.code || '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(code)) return send(res, 400, { error: 'invalid_code' });

  try {
    if (await hit(`rl:verify:ip:${clientIp(req)}`, 15 * 60) > 30) return send(res, 429, { error: 'too_many_requests' });
    if (!isAdminEmail(email)) return send(res, 400, { error: 'invalid_code', remaining: 0 });

    const result = await checkCode(email, code);
    if (result.status === 'expired') return send(res, 400, { error: 'expired_code' });
    if (result.status === 'invalid') return send(res, 400, { error: 'invalid_code', remaining: result.remaining });

    const cookie = await createSession(email);
    return send(res, 200, { ok: true, email }, { 'Set-Cookie': cookie });
  } catch (error) {
    console.error('[admin] verify', error);
    return send(res, 500, { error: 'server_error' });
  }
}
