// Helpers HTTP compatibles avec les fonctions Vercel et le serveur de dev Vite (API Node brute).

const MAX_BODY = 64 * 1024;

export class HttpError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}

export async function readJson(req) {
  const type = String(req.headers['content-type'] || '');
  // Un formulaire HTML d'un autre site ne peut pas envoyer de JSON : première barrière anti-CSRF.
  if (!type.startsWith('application/json')) throw new HttpError(415, 'unsupported_media_type');
  if (req.body && typeof req.body === 'object') {
    if (JSON.stringify(req.body).length > MAX_BODY) throw new HttpError(413, 'payload_too_large');
    return req.body;
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new HttpError(413, 'payload_too_large');
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch { throw new HttpError(400, 'invalid_json'); }
}

export function send(res, status, data, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.end(JSON.stringify(data));
}

// Point d'entrée commun : méthode autorisée, origine vérifiée sur les écritures, erreurs masquées.
export function route(methods, handler, label) {
  return async (req, res) => {
    if (!methods.includes(req.method)) return send(res, 405, { error: 'method_not_allowed' }, { Allow: methods.join(', ') });
    if (req.method !== 'GET' && !isSameOrigin(req)) return send(res, 403, { error: 'forbidden' });
    try {
      return await handler(req, res);
    } catch (error) {
      if (error instanceof HttpError) return send(res, error.status, { error: error.code });
      console.error(`[${label}]`, error);
      return send(res, 500, { error: 'server_error' });
    }
  };
}

// Les navigateurs envoient toujours Origin sur un POST : il doit correspondre au site lui-même.
function isSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return !isDeployed(); // outils en ligne de commande acceptés en local uniquement
  try {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return new URL(origin).host === host;
  } catch { return false; }
}

export function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(header.split(';').map((part) => {
    const index = part.indexOf('=');
    if (index < 0) return [part.trim(), ''];
    try { return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())]; } catch { return ['', '']; }
  }).filter(([key]) => key));
}

// Sur Vercel, x-real-ip est posé par la plateforme et ne peut pas être falsifié par le client.
export function clientIp(req) {
  const ip = req.headers['x-real-ip'] || (isDeployed() ? '' : req.headers['x-forwarded-for']);
  if (ip) return String(ip).split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

export const isProduction = () => process.env.VERCEL_ENV === 'production';
export const isDeployed = () => Boolean(process.env.VERCEL);
