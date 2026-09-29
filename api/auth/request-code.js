import { allowMethods, clientIp, readJson, send } from '../_lib/http.js';
import { CODE_TTL, isAdminEmail, issueCode, normalizeEmail } from '../_lib/auth.js';
import { isLocalMailMode, sendLoginCode } from '../_lib/mail.js';
import { hit } from '../_lib/store.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (!allowMethods(req, res, ['POST'])) return;
  const { email: rawEmail } = await readJson(req);
  const email = normalizeEmail(rawEmail);
  if (!EMAIL_PATTERN.test(email)) return send(res, 400, { error: 'invalid_email' });

  try {
    const [byIp, byEmail] = await Promise.all([
      hit(`rl:code:ip:${clientIp(req)}`, CODE_TTL),
      hit(`rl:code:email:${email}`, CODE_TTL)
    ]);
    if (byIp > 10 || byEmail > 3) return send(res, 429, { error: 'too_many_requests' });

    // Même réponse que l'adresse soit autorisée ou non : on ne révèle pas qui est admin.
    const payload = { ok: true, expiresAt: Date.now() + CODE_TTL * 1000 };
    if (isLocalMailMode()) payload.localMode = true;
    if (isAdminEmail(email)) {
      const issued = await issueCode(email);
      payload.expiresAt = issued.expiresAt;
      await sendLoginCode(email, issued.code);
      if (isLocalMailMode()) payload.localCode = issued.code;
    }
    return send(res, 200, payload);
  } catch (error) {
    console.error('[admin] request-code', error);
    return send(res, 500, { error: 'server_error' });
  }
}
