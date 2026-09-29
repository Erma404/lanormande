// Stockage clé/valeur avec expiration : Upstash Redis (REST) en ligne, mémoire en local.
import { isDeployed } from './http.js';

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

async function redis(command) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command)
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(`Redis: ${data.error || response.status}`);
  return data.result;
}

const memory = globalThis.__lmnMemoryStore ||= new Map();

function memoryGet(key) {
  const entry = memory.get(key);
  if (!entry) return null;
  if (entry.expiresAt && entry.expiresAt < Date.now()) { memory.delete(key); return null; }
  return entry.value;
}

function assertConfigured() {
  if (!url || !token) {
    if (isDeployed()) throw new Error('Upstash Redis non configuré (UPSTASH_REDIS_REST_URL / _TOKEN)');
    return false;
  }
  return true;
}

export async function get(key) {
  if (!assertConfigured()) return memoryGet(key);
  const raw = await redis(['GET', key]);
  return raw == null ? null : JSON.parse(raw);
}

export async function set(key, value, ttlSeconds) {
  if (!assertConfigured()) {
    memory.set(key, { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null });
    return;
  }
  const command = ['SET', key, JSON.stringify(value)];
  if (ttlSeconds) command.push('EX', String(ttlSeconds));
  await redis(command);
}

export async function del(key) {
  if (!assertConfigured()) { memory.delete(key); return; }
  await redis(['DEL', key]);
}

// Incrémente un compteur ; la fenêtre d'expiration démarre au premier appel.
export async function hit(key, windowSeconds) {
  if (!assertConfigured()) {
    const current = memoryGet(key);
    const entry = memory.get(key);
    const count = (current || 0) + 1;
    memory.set(key, { value: count, expiresAt: entry?.expiresAt && current ? entry.expiresAt : Date.now() + windowSeconds * 1000 });
    return count;
  }
  const count = await redis(['INCR', key]);
  if (count === 1) await redis(['EXPIRE', key, String(windowSeconds)]);
  return count;
}
