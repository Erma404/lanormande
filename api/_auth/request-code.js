import { clientIp, readJson, route, send } from '../_lib/http.js';
import { CODE_TTL, emailKey, isAdminEmail, issueCode, normalizeEmail } from '../_lib/auth.js';
import { isLocalMailMode, sendLoginCode } from '../_lib/mail.js';
import { hit } from '../_lib/store.js';

const EMAIL_PATTERN = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const DAY = 24 * 60 * 60;
const MIN_DURATION = 1200; // ms : même durée de réponse, qu'un email soit envoyé ou non

export default route(['POST'], async (req, res) => {
  const startedAt = Date.now();
  const { email: rawEmail } = await readJson(req);
  const email = normalizeEmail(rawEmail);
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return send(res, 400, { error: 'invalid_email' });

  const key = emailKey(email);
  const [byIp, byIpDay, byEmail, byEmailDay] = await Promise.all([
    hit(`rl:code:ip:${clientIp(req)}`, CODE_TTL),
    hit(`rl:code:ipday:${clientIp(req)}`, DAY),
    hit(`rl:code:email:${key}`, CODE_TTL),
    hit(`rl:code:emailday:${key}`, DAY)
  ]);
  if (byIp > 10 || byIpDay > 40 || byEmail > 3 || byEmailDay > 10) return send(res, 429, { error: 'too_many_requests' });

  const issued = await issueCode(email);
  const payload = { ok: true, expiresAt: issued.expiresAt };
  if (isAdminEmail(email)) {
    await sendLoginCode(email, issued.code);
    if (isLocalMailMode()) payload.localCode = issued.code;
  }
  if (isLocalMailMode()) payload.localMode = true;

  const wait = MIN_DURATION - (Date.now() - startedAt);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  return send(res, 200, payload);
}, 'admin request-code');
