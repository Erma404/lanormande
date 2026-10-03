// Disponibilités : calendrier Airbnb (iCal) + blocages manuels saisis dans l'admin.
// Une plage [start, end) couvre les nuits de start à end exclu : end est le jour de départ,
// donc un nouveau séjour peut commencer ce jour-là.
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { isDeployed } from './http.js';
import * as store from './store.js';

const AIRBNB_CACHE = 'availability:airbnb';
const AIRBNB_URL = 'settings:airbnb-ical-url';
const MANUAL = 'availability:manual';
const REFRESH_AFTER = 10 * 60 * 1000;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export const isValidDate = (value) => DATE.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());

// Seuls les domaines officiels d'Airbnb sont acceptés (anti-SSRF).
const AIRBNB_HOSTS = /^(www\.)?airbnb\.(com|fr|be|ch|ca|de|es|it|nl|pt|ie|at|dk|se|no|fi|pl|co\.uk|com\.au|com\.br|mx|co\.nz)$/;
const MAX_ICAL_SIZE = 2 * 1024 * 1024;

const isAirbnbHost = (hostname) => AIRBNB_HOSTS.test(hostname);

export function isAirbnbUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.port
      && isAirbnbHost(url.hostname) && url.pathname.startsWith('/calendar/ical/') && url.pathname.endsWith('.ics');
  } catch { return false; }
}

const toIso = (value) => `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;

function addDays(iso, days) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// Ne garde que les dates : les descriptions Airbnb contiennent des données voyageurs.
export function parseIcal(text) {
  const lines = text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r?\n/);
  const ranges = [];
  let event = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') event = {};
    else if (line === 'END:VEVENT') {
      if (event?.start) ranges.push([event.start, event.end && event.end > event.start ? event.end : addDays(event.start, 1)]);
      event = null;
    } else if (event) {
      const match = line.match(/^(DTSTART|DTEND)[^:]*:(\d{8})/);
      if (match) event[match[1] === 'DTSTART' ? 'start' : 'end'] = toIso(match[2]);
    }
  }
  return ranges.sort((a, b) => a[0].localeCompare(b[0]));
}

export async function getAirbnbUrl() {
  return (await store.get(AIRBNB_URL)) || process.env.AIRBNB_ICAL_URL || '';
}

export async function setAirbnbUrl(url) {
  if (url) await store.set(AIRBNB_URL, url); else await store.del(AIRBNB_URL);
  await store.del(AIRBNB_CACHE);
}

async function fetchIcal(source) {
  // En local uniquement, on accepte un fichier .ics téléchargé pour tester.
  if (!isDeployed() && source.startsWith('/')) return readFile(source, 'utf8');
  if (!isAirbnbUrl(source)) throw new Error('URL iCal Airbnb invalide');
  const response = await fetch(source, { headers: { 'User-Agent': 'VillaNormande-Sync/1.0' }, signal: AbortSignal.timeout(8000) });
  // Une redirection ne doit pas sortir des domaines Airbnb.
  if (response.url && !isAirbnbHost(new URL(response.url).hostname)) throw new Error('Redirection hors d’Airbnb refusée');
  if (!response.ok) throw new Error(`Airbnb a répondu ${response.status}`);
  if (Number(response.headers.get('content-length') || 0) > MAX_ICAL_SIZE) throw new Error('Calendrier trop volumineux');
  const text = await response.text();
  if (text.length > MAX_ICAL_SIZE) throw new Error('Calendrier trop volumineux');
  if (!text.includes('BEGIN:VCALENDAR')) throw new Error('Réponse Airbnb inattendue (pas un calendrier)');
  return text;
}

// Renvoie le dernier état connu ; en cas d'échec on garde les anciennes dates plutôt que de tout libérer.
export async function getAirbnb({ force = false } = {}) {
  const cached = await store.get(AIRBNB_CACHE);
  const source = await getAirbnbUrl();
  if (!source) return { ranges: [], syncedAt: null, error: null, configured: false };
  if (!force && cached && Date.now() - cached.checkedAt < REFRESH_AFTER) return { ...cached, configured: true };

  try {
    const ranges = parseIcal(await fetchIcal(source));
    const next = { ranges, syncedAt: Date.now(), checkedAt: Date.now(), error: null };
    await store.set(AIRBNB_CACHE, next);
    return { ...next, configured: true };
  } catch (error) {
    const next = { ranges: cached?.ranges || [], syncedAt: cached?.syncedAt || null, checkedAt: Date.now(), error: error.message };
    await store.set(AIRBNB_CACHE, next);
    return { ...next, configured: true };
  }
}

export async function getManual() {
  return (await store.get(MANUAL)) || [];
}

export async function addManual({ start, end, note }) {
  const blocks = await getManual();
  if (blocks.length >= 500) throw new Error('Trop de blocages enregistrés');
  const block = { id: randomBytes(6).toString('hex'), start, end, note: String(note || '').slice(0, 120), createdAt: Date.now() };
  blocks.push(block);
  blocks.sort((a, b) => a.start.localeCompare(b.start));
  await store.set(MANUAL, blocks);
  return block;
}

export async function removeManual(id) {
  await store.set(MANUAL, (await getManual()).filter((block) => block.id !== id));
}

// Plages fusionnées, sans le passé, pour le calendrier public.
export async function getBlockedRanges() {
  const today = new Date().toISOString().slice(0, 10);
  const [airbnb, manual] = await Promise.all([getAirbnb(), getManual()]);
  const ranges = [...airbnb.ranges, ...manual.map((block) => [block.start, block.end])]
    .filter(([, end]) => end > today)
    .sort((a, b) => a[0].localeCompare(b[0]));
  const merged = [];
  for (const [start, end] of ranges) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) last[1] = end > last[1] ? end : last[1];
    else merged.push([start, end]);
  }
  return merged;
}
