import { clientIp, readJson, route, send } from '../_lib/http.js';
import { checkCode, createSession, emailKey, isAdminEmail, normalizeEmail } from '../_lib/auth.js';
import { sendLoginAlert } from '../_lib/mail.js';
import { del, get, hit } from '../_lib/store.js';

const DAY = 24 * 60 * 60;
const MAX_FAILURES_PER_DAY = 20; // au-delà, l'adresse est bloquée 24 h (anti force brute)

// Contexte de la connexion pour l'alerte : lieu approximatif (en-têtes Vercel) et appareil.
function loginContext(req) {
  const decode = (value) => { try { return decodeURIComponent(String(value || '')); } catch { return ''; } };
  const place = [decode(req.headers['x-vercel-ip-city']), decode(req.headers['x-vercel-ip-country'])].filter(Boolean).join(', ') || 'inconnu';
  const ua = String(req.headers['user-agent'] || '');
  const os = /iPhone|iPad/.test(ua) ? 'iPhone / iPad' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'appareil inconnu';
  const browser = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'navigateur inconnu';
  const when = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'full', timeStyle: 'short' }).format(new Date());
  return { when, place: place.slice(0, 80), device: `${browser} sur ${os}` };
}

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
    await sendLoginAlert(email, loginContext(req)).catch((error) => console.error('[admin verify] alerte', error));
    return send(res, 200, { ok: true, email }, { 'Set-Cookie': cookie });
  }

  await hit(failuresKey, DAY);
  if (result.status === 'invalid') return send(res, 400, { error: 'invalid_code', remaining: result.remaining });
  return send(res, 400, { error: 'expired_code' });
}, 'admin verify');
