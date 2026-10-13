// Grille tarifaire et estimation du prix d'un séjour.
// La grille se règle dans l'onglet Tarifs de l'admin (stockée côté serveur, servie avec /api/content) ;
// DEFAULT_GRID = la grille d'origine (Tarif-site.xlsx), utilisée tant que rien n'a été enregistré.
// Le prix par nuit dépend de la durée totale et de la saison de chaque nuit : un séjour à cheval
// sur deux saisons est compté nuit par nuit ; sur une seule saison on retrouve les forfaits.
// weekend2, weekend3 et week sont des prix de séjour ; short (4 à 6 nuits) et long (plus de 7) des prix par nuit.
export const DEFAULT_GRID = {
  lowMonths: [1, 2, 3, 10, 11],
  rates: {
    basse: { weekend2: 500, weekend3: 700, short: 220, week: 1400, long: 185 },
    haute: { weekend2: 600, weekend3: 800, short: 250, week: 1680, long: 225 }
  }
};
export const SEASONS = ['basse', 'haute'];
export const RATE_KEYS = ['weekend2', 'weekend3', 'short', 'week', 'long'];
// Nombre de nuits couvert par un prix de séjour (null = prix par nuit).
export const RATE_NIGHTS = { weekend2: 2, weekend3: 3, short: null, week: 7, long: null };
export const MAX_RATE = 20000;

// Grille valide ou null : 12 mois répartis entre les deux saisons (au moins un mois chacune),
// des prix entiers positifs. Sert au serveur (enregistrement) comme au navigateur (lecture).
export function cleanGrid(input) {
  const months = Array.isArray(input?.lowMonths) ? [...new Set(input.lowMonths.map(Number))].filter((m) => Number.isInteger(m) && m >= 1 && m <= 12).sort((a, b) => a - b) : null;
  if (!months || months.length !== input.lowMonths.length || !months.length || months.length === 12) return null;
  const rates = {};
  for (const season of SEASONS) {
    rates[season] = {};
    for (const key of RATE_KEYS) {
      const value = Math.round(Number(input?.rates?.[season]?.[key]));
      if (!Number.isFinite(value) || value < 1 || value > MAX_RATE) return null;
      rates[season][key] = value;
    }
  }
  return { lowMonths: months, rates };
}

// Grille utilisée par défaut dans le navigateur, remplacée par celle de l'admin dès qu'elle arrive.
let current = DEFAULT_GRID;
export function setGrid(grid) {
  const clean = grid && cleanGrid(grid);
  if (clean) current = clean;
  return current;
}
export const getGrid = () => current;

const bracket = (nights) => (nights === 2 ? 'weekend2' : nights === 3 ? 'weekend3' : nights <= 6 ? 'short' : nights === 7 ? 'week' : 'long');
const nightly = (grid, key, season) => grid.rates[season][key] / (RATE_NIGHTS[key] || 1);
export const seasonOfMonth = (month, grid = current) => (grid.lowMonths.includes(month) ? 'basse' : 'haute');
const seasonOf = (date, grid) => seasonOfMonth(date.getUTCMonth() + 1, grid);
const parse = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? new Date(`${iso}T00:00:00Z`) : null);

// { nights, total, perNight, seasons } ; total = null si moins de 2 nuits (hors grille).
export function estimateStay(arrivalIso, departureIso, grid = current) {
  const start = parse(arrivalIso);
  const end = parse(departureIso);
  if (!start || !end || end <= start) return null;
  const nights = Math.round((end - start) / 86400000);
  if (nights < 2) return { nights, total: null, perNight: null, seasons: [seasonOf(start, grid)] };
  const key = bracket(nights);
  const seasons = new Set();
  let sum = 0;
  for (let i = 0; i < nights; i += 1) {
    const season = seasonOf(new Date(start.getTime() + i * 86400000), grid);
    seasons.add(season);
    sum += nightly(grid, key, season);
  }
  const total = Math.round(sum);
  return { nights, total, perNight: Math.round(total / nights), seasons: [...seasons] };
}

// Prix promo (onglet Promotion de l'admin) : remplace le total quand les dates correspondent exactement.
// regular = prix de la grille, affiché barré.
export function applyOffer(estimate, arrivalIso, departureIso, offers = []) {
  const offer = estimate?.total != null && offers.find((item) => item.arrival === arrivalIso && item.departure === departureIso);
  if (!offer || !(offer.total > 0) || offer.total === estimate.total) return estimate;
  return { ...estimate, regular: estimate.total, total: offer.total, perNight: Math.round(offer.total / estimate.nights), offer: true };
}

// Estimation d'une demande enregistrée : le prix de la grille figé au moment de la demande
// (gridTotal, pour que changer les tarifs ne modifie pas les demandes déjà reçues ; à défaut
// la grille actuelle), puis le prix promo figé lui aussi.
export function estimateRequest(request, grid = current) {
  let base = estimateStay(request.arrival, request.departure, grid);
  if (base?.total != null && request.gridTotal > 0) base = { ...base, total: request.gridTotal, perNight: Math.round(request.gridTotal / base.nights) };
  return applyOffer(base, request.arrival, request.departure,
    request.promo?.total ? [{ arrival: request.arrival, departure: request.departure, total: request.promo.total }] : []);
}

// Reporte la grille dans les textes de la section Tarifs (montants, mois de chaque saison)
// et dans le prix « à partir de » du bouton Réserver (le texte de l'admin est gardé, seul le montant change).
export function applyPricing(content, grid = current) {
  for (const lang of Object.keys(content)) {
    const t = content[lang];
    const money = (n) => new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
    for (const season of t.pricing.seasons) {
      const rates = grid.rates[season.id];
      season.monthNumbers = Array.from({ length: 12 }, (_, i) => i + 1).filter((m) => seasonOfMonth(m, grid) === season.id);
      season.rows = season.rows.map(([label], j) => {
        const key = RATE_KEYS[j];
        const nights = RATE_NIGHTS[key];
        const perNight = rates[key] / (nights || 1);
        // [libellé, prix du séjour ou '', prix par nuit, vrai si le prix par nuit est arrondi (« ≈ »)]
        return [label, nights ? money(rates[key]) : '', money(Math.round(perNight)), !Number.isInteger(perNight)];
      });
    }
    const from = Math.min(...SEASONS.flatMap((season) => RATE_KEYS.map((key) => Math.round(grid.rates[season][key] / (RATE_NIGHTS[key] || 1)))));
    t.booking.fromPrice = t.booking.fromPrice.replace(lang === 'en' ? /€\s?\d[\d,.]*/ : /\d[\d\s\u00a0\u202f.]*\s?€/, () => money(from));
  }
}
