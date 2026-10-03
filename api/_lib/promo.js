// Bannière de promotion : réglée depuis l'admin, affichée en haut du site entre deux dates.
import { get, set } from './store.js';

const KEY = 'promo';
const LIMITS = { text: 140, cta: 30 };
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const EMPTY_PROMO = {
  enabled: false,
  start: '',
  end: '',
  showButton: true,
  fr: { text: '', cta: 'J’en profite' },
  en: { text: '', cta: 'Book now' },
  updatedAt: 0
};

const clean = (value, max) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);

export async function getPromo() {
  return { ...EMPTY_PROMO, ...(await get(KEY)) };
}

export async function savePromo(body) {
  const promo = {
    enabled: body.enabled === true,
    start: ISO_DATE.test(body.start) ? body.start : '',
    end: ISO_DATE.test(body.end) ? body.end : '',
    showButton: body.showButton !== false,
    fr: { text: clean(body.fr?.text, LIMITS.text), cta: clean(body.fr?.cta, LIMITS.cta) },
    en: { text: clean(body.en?.text, LIMITS.text), cta: clean(body.en?.cta, LIMITS.cta) },
    updatedAt: Date.now()
  };
  if (promo.start && promo.end && promo.end < promo.start) return { error: 'invalid_range' };
  if (promo.enabled && !promo.fr.text) return { error: 'missing_text' };
  await set(KEY, promo);
  return { promo };
}

// Date du jour en France : une promo « jusqu'au 30 novembre » reste visible toute la journée du 30.
const todayInFrance = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());

export function isLive(promo, today = todayInFrance()) {
  if (!promo.enabled || !promo.fr.text) return false;
  if (promo.start && today < promo.start) return false;
  if (promo.end && today > promo.end) return false;
  return true;
}

// Ce que voit le public : rien hors période, sinon les textes (l'anglais reprend le français s'il est vide).
export function publicPromo(promo) {
  if (!isLive(promo)) return null;
  const en = promo.en.text ? promo.en : { text: promo.fr.text, cta: promo.en.cta };
  return {
    id: String(promo.updatedAt),
    showButton: promo.showButton,
    fr: { text: promo.fr.text, cta: promo.fr.cta || EMPTY_PROMO.fr.cta },
    en: { text: en.text, cta: en.cta || EMPTY_PROMO.en.cta }
  };
}
