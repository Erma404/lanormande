// Nuits indisponibles (Airbnb + blocages admin), plages [arrivée, départ) au format ISO.
// Chargées une seule fois par page, partagées par le calendrier de l'accueil et la fenêtre de réservation.
export const availability = { blocked: [], loaded: false };
const listeners = new Set();

// Appelée quand les disponibilités arrivent ; renvoie de quoi se désabonner.
export function onAvailability(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const isoOf = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const isNightBlocked = (iso) => availability.blocked.some(([start, end]) => iso >= start && iso < end);
export function rangeCrossesBookedDate(startIso, endIso) {
  const cursor = new Date(startIso + 'T00:00:00');
  const end = new Date(endIso + 'T00:00:00');
  while (cursor < end) {
    if (isNightBlocked(isoOf(cursor))) return true;
    cursor.setDate(cursor.getDate() + 1);
  }
  return false;
}

// Tant que les disponibilités ne sont pas chargées, les calendriers affichent un squelette et
// n'acceptent pas de clic (on ne laisse pas choisir une date peut-être déjà prise).
// Réponse arrivée après le délai de 5 s : les calendriers sont prévenus une seconde fois.
const notify = () => { availability.loaded = true; listeners.forEach((listener) => listener()); };
setTimeout(() => { if (!availability.loaded) notify(); }, 5000);
fetch('/api/availability')
  .then((response) => (response.ok ? response.json() : null))
  .then((data) => { if (data?.blocked) availability.blocked = data.blocked; notify(); })
  .catch(() => { if (!availability.loaded) notify(); });
