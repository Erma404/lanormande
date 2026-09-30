import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { isDeployed, parseCookies } from './http.js';
import * as store from './store.js';

export const CODE_TTL = 15 * 60;          // code valable 15 minutes
export const MAX_ATTEMPTS = 5;            // essais par code
export const SESSION_TTL = 12 * 60 * 60;  // session admin de 12 heures
// Préfixe __Host- en ligne : cookie lié à ce domaine exact, en HTTPS uniquement.
const cookieName = () => (isDeployed() ? '__Host-lmn_admin' : 'lmn_admin');

function secret() {
  const value = process.env.OTP_SECRET;
  if (!value && isDeployed()) throw new Error('OTP_SECRET non configuré');
  return value || 'dev-only-secret';
}

const digest = (value) => createHmac('sha256', secret()).update(value).digest('hex');

export const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export function isAdminEmail(email) {
  const allowed = (process.env.ADMIN_EMAILS || '').split(',').map(normalizeEmail).filter(Boolean);
  return allowed.includes(normalizeEmail(email));
}

// Clé de stockage dérivée de l'adresse : aucune adresse email en clair dans Redis.
export const emailKey = (email) => digest(`email:${email}`).slice(0, 32);

// Un code est émis pour toute adresse (leurre si elle n'est pas admin) : le serveur se comporte
// de façon identique dans les deux cas, ce qui empêche de deviner quelles adresses sont admin.
export async function issueCode(email) {
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const expiresAt = Date.now() + CODE_TTL * 1000;
  await store.set(`otp:${emailKey(email)}`, { hash: digest(`${email}:${code}`), expiresAt, attempts: 0 }, CODE_TTL);
  return { code, expiresAt };
}

// Renvoie 'ok', 'invalid' (avec essais restants) ou 'expired'.
export async function checkCode(email, code) {
  const key = `otp:${emailKey(email)}`;
  const entry = await store.get(key);
  if (!entry || entry.expiresAt < Date.now()) return { status: 'expired' };

  const expected = Buffer.from(entry.hash, 'hex');
  const actual = Buffer.from(digest(`${email}:${String(code).trim()}`), 'hex');
  if (timingSafeEqual(expected, actual)) {
    await store.del(key);
    return { status: 'ok' };
  }

  const attempts = entry.attempts + 1;
  if (attempts >= MAX_ATTEMPTS) {
    await store.del(key);
    return { status: 'expired' };
  }
  const ttl = Math.max(1, Math.ceil((entry.expiresAt - Date.now()) / 1000));
  await store.set(key, { ...entry, attempts }, ttl);
  return { status: 'invalid', remaining: MAX_ATTEMPTS - attempts };
}

function cookie(value, maxAge) {
  const parts = [`${cookieName()}=${value}`, 'Path=/', 'HttpOnly', 'SameSite=Strict', `Max-Age=${maxAge}`];
  if (isDeployed()) parts.push('Secure');
  return parts.join('; ');
}

export async function createSession(email) {
  const token = randomBytes(32).toString('hex');
  await store.set(`session:${digest(token)}`, { email, createdAt: Date.now() }, SESSION_TTL);
  return cookie(token, SESSION_TTL);
}

export async function getSession(req) {
  const token = parseCookies(req)[cookieName()];
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await store.get(`session:${digest(token)}`);
  // Un admin retiré de ADMIN_EMAILS perd l'accès immédiatement.
  if (!session || !isAdminEmail(session.email)) return null;
  return session;
}

export async function destroySession(req) {
  const token = parseCookies(req)[cookieName()];
  if (token && /^[a-f0-9]{64}$/.test(token)) await store.del(`session:${digest(token)}`);
  return cookie('', 0);
}
