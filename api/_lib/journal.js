// Mesure d'audience maison, sans cookie et sans donnée personnelle : chaque événement
// incrémente des compteurs agrégés par jour (heure de Paris). Rien ne permet de suivre un visiteur.
import { pipeline } from './store.js';

const DAY_KEY = (date) => `journal:d:${date}`;
const AIRBNB_REVENUE = 'journal:airbnb-revenue';
const KEEP_DAYS = 800; // un peu plus de 2 ans : comparaison d'une année sur l'autre
const MAX_RANGE = 400;

// Pages suivies ; toute autre adresse est rangée dans « other ».
export const PAGES = ['/', '/en', '/normandie-pays-d-auge', '/en/normandy-guide', '/bonnes-adresses', '/en/local-favourites'];
// Boutons suivis (attribut data-cta côté site).
export const CTAS = ['header', 'hero-card', 'host', 'pricing', 'final', 'promo', 'home-guide', 'guide-header', 'guide-bottom', 'addresses-header', 'whatsapp-bubble', 'modal-whatsapp'];
export const STEPS = ['open', 'dates', 'sent'];

const SOURCES = [
  ['google', /(^|\.)google\./],
  ['bing', /(^|\.)bing\.com$|(^|\.)duckduckgo\.com$|(^|\.)qwant\.com$|(^|\.)ecosia\.org$|(^|\.)yahoo\./],
  ['ai', /chatgpt\.com$|openai\.com$|perplexity\.ai$|gemini\.google\.com$|claude\.ai$|copilot\.microsoft\.com$/],
  ['airbnb', /(^|\.)airbnb\./],
  ['social', /facebook\.com$|instagram\.com$|linkedin\.com$|pinterest\.|(^|\.)t\.co$|twitter\.com$|x\.com$|tiktok\.com$/],
  ['whatsapp', /whatsapp\.(com|net)$/],
  ['email', /mail\.|outlook\.|orange\.fr$|free\.fr$|sfr\.fr$|laposte\.net$/]
];
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|facebookexternalhit|embedly|monitor/i;

export const parisDate = (time = Date.now()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(time);

function source(ref, tag) {
  const marker = String(tag || '').toLowerCase();
  if (marker === 'qr') return 'qr';
  if (marker) return SOURCES.find(([id]) => marker.includes(id))?.[0] || 'other';
  const host = String(ref || '').toLowerCase();
  if (!host) return 'direct';
  if (host.endsWith('villanormande.com') || host.endsWith('vercel.app')) return 'direct';
  return SOURCES.find(([, pattern]) => pattern.test(host))?.[0] || 'other';
}

const page = (path) => {
  const clean = String(path || '/').replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1') || '/';
  return PAGES.includes(clean) ? clean : 'other';
};

// Transforme un événement reçu du site en champs à incrémenter ; null si l'événement est ignoré.
export function fieldsFor(event, userAgent = '') {
  if (BOT.test(userAgent)) return null;
  switch (event.type) {
    case 'view': {
      const fields = ['pv', `page:${page(event.path)}`];
      if (event.entry) {
        fields.push('visits', `src:${source(event.ref, event.src)}`, `dev:${event.mobile ? 'mobile' : 'desktop'}`, `lang:${event.lang === 'en' ? 'en' : 'fr'}`);
      }
      return fields;
    }
    case 'click':
      return CTAS.includes(event.cta) ? [`cta:${event.cta}`] : null;
    case 'step':
      return STEPS.includes(event.step) && event.step !== 'sent' ? [`step:${event.step}`] : null;
    default:
      return null;
  }
}

export async function record(fields, date = parisDate()) {
  if (!fields?.length) return;
  const key = DAY_KEY(date);
  await pipeline([...fields.map((field) => ['HINCRBY', key, field, '1']), ['EXPIRE', key, String(KEEP_DAYS * 86400)]]);
}

const toObject = (flat) => {
  const object = {};
  for (let i = 0; i < (flat?.length || 0); i += 2) object[flat[i]] = Number(flat[i + 1]) || 0;
  return object;
};

const addDays = (iso, days) => {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};
export const daysBetween = (from, to) => Math.round((new Date(`${to}T12:00:00Z`) - new Date(`${from}T12:00:00Z`)) / 86400000) + 1;

// Compteurs jour par jour sur la période, et totaux de la période précédente de même durée.
export async function readRange(from, to) {
  const length = Math.min(daysBetween(from, to), MAX_RANGE);
  const dates = Array.from({ length }, (_, i) => addDays(from, i));
  const previous = Array.from({ length }, (_, i) => addDays(from, i - length));
  const results = await pipeline([...dates, ...previous].map((date) => ['HGETALL', DAY_KEY(date)]));
  const days = dates.map((date, i) => ({ date, counts: toObject(results[i]) }));
  const previousTotals = {};
  results.slice(length).forEach((flat) => {
    for (const [field, value] of Object.entries(toObject(flat))) previousTotals[field] = (previousTotals[field] || 0) + value;
  });
  return { days, previousTotals, previousFrom: previous[0], previousTo: previous[length - 1] };
}

// CA Airbnb saisi à la main, par mois (« 2026-07 » → montant en euros).
export async function getAirbnbRevenue() {
  const [flat] = await pipeline([['HGETALL', AIRBNB_REVENUE]]);
  return toObject(flat);
}

export async function setAirbnbRevenue(month, amount) {
  if (amount === null) await pipeline([['HDEL', AIRBNB_REVENUE, month]]);
  else await pipeline([['HSET', AIRBNB_REVENUE, month, String(amount)]]);
}
