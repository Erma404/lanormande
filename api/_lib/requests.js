// Demandes de réservation envoyées depuis le site. Accepter une demande bloque ses dates
// (blocage manuel, donc aussi exporté vers Airbnb) ; la refuser ou la rouvrir les libère.
import { randomBytes } from 'node:crypto';
import { addManual, getBlockedRanges, isValidDate, removeManual } from './availability.js';
import * as store from './store.js';

const KEY = 'requests:list';
const MAX_STORED = 500;
const MAX_NIGHTS = 60;
// Politique de confidentialité : au plus 3 ans après le dernier contact (fin du séjour ou dernière action).
const RETENTION_MS = 3 * 365.25 * 86400000;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
export const STATUSES = ['new', 'accepted', 'declined'];

const clean = (value, max) => String(value ?? '').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim().slice(0, max);
const nights = (start, end) => Math.round((new Date(`${end}T00:00:00Z`) - new Date(`${start}T00:00:00Z`)) / 86400000);
const overlaps = (start, end, ranges) => ranges.some(([from, to]) => start < to && end > from);

// Renvoie la demande nettoyée, ou un code d'erreur.
export function validate(body) {
  const request = {
    name: clean(body.name, 80),
    email: clean(body.email, 254).toLowerCase(),
    phone: clean(body.phone, 30),
    arrival: String(body.arrival || ''),
    departure: String(body.departure || ''),
    guests: Number(body.guests),
    message: clean(body.message, 1000),
    lang: body.lang === 'en' ? 'en' : 'fr'
  };
  if (request.name.length < 2) return { error: 'invalid_name' };
  if (!EMAIL.test(request.email)) return { error: 'invalid_email' };
  if (request.phone && !/^[+\d][\d\s.()-]{5,}$/.test(request.phone)) return { error: 'invalid_phone' };
  const today = new Date().toISOString().slice(0, 10);
  if (!isValidDate(request.arrival) || !isValidDate(request.departure) || request.departure <= request.arrival || request.arrival < today) return { error: 'invalid_range' };
  if (nights(request.arrival, request.departure) > MAX_NIGHTS) return { error: 'too_long' };
  if (!Number.isInteger(request.guests) || request.guests < 1 || request.guests > 8) return { error: 'invalid_guests' };
  return { request };
}

const lastContact = (request) => Math.max(request.updatedAt || 0, request.createdAt || 0, new Date(`${request.departure}T00:00:00Z`).getTime() || 0);

// Chaque lecture supprime les demandes arrivées au bout de leur durée de conservation,
// avec le blocage d'une demande acceptée (son séjour est passé depuis 3 ans, et il porte le nom du voyageur).
export async function list() {
  const requests = (await store.get(KEY)) || [];
  const limit = Date.now() - RETENTION_MS;
  const expired = requests.filter((request) => lastContact(request) < limit);
  if (!expired.length) return requests;
  // Une à la fois : removeManual relit puis réécrit la liste des blocages.
  for (const request of expired) if (request.blockId) await removeManual(request.blockId);
  const kept = requests.filter((request) => !expired.includes(request));
  await save(kept);
  return kept;
}

async function save(requests) {
  await store.set(KEY, requests);
}

export async function isAvailable(start, end) {
  return !overlaps(start, end, await getBlockedRanges());
}

export async function create(request) {
  const requests = await list();
  if (requests.length >= MAX_STORED) throw new Error('Trop de demandes enregistrées');
  const entry = { id: randomBytes(8).toString('hex'), ...request, status: 'new', createdAt: Date.now(), updatedAt: Date.now() };
  requests.unshift(entry);
  await save(requests);
  return entry;
}

// Change le statut ; renvoie un code d'erreur si l'action est impossible.
export async function setStatus(id, status) {
  const requests = await list();
  const request = requests.find((item) => item.id === id);
  if (!request) return { error: 'not_found' };
  if (request.status === status) return { request };

  if (status === 'accepted') {
    if (!(await isAvailable(request.arrival, request.departure))) return { error: 'unavailable' };
    const block = await addManual({ start: request.arrival, end: request.departure, note: `Demande site — ${request.name}` });
    request.blockId = block.id;
  } else if (request.blockId) {
    await removeManual(request.blockId);
    delete request.blockId;
  }
  request.status = status;
  request.updatedAt = Date.now();
  await save(requests);
  return { request };
}

// Supprime la demande (données personnelles) ; les dates d'une demande acceptée restent bloquées.
export async function remove(id) {
  await save((await list()).filter((item) => item.id !== id));
}
