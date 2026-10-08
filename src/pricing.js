// Grille tarifaire (Tarif-site.xlsx) et estimation du prix d'un séjour.
// Le prix par nuit dépend de la durée totale et de la saison de chaque nuit : un séjour à cheval
// sur deux saisons est compté nuit par nuit ; sur une seule saison on retrouve les forfaits.
// À garder cohérent avec content.pricing (affichage de la section Tarifs).
export const SEASON_MONTHS = { basse: [1, 2, 3, 10, 11], haute: [4, 5, 6, 7, 8, 9, 12] };

const NIGHTLY = {
  2: { basse: 250, haute: 300 },             // week-end 2 nuits : 500 € / 600 €
  3: { basse: 700 / 3, haute: 800 / 3 },     // week-end 3 nuits : 700 € / 800 €
  short: { basse: 220, haute: 250 },         // 4 à 6 nuits
  7: { basse: 200, haute: 240 },             // semaine : 1 400 € / 1 680 €
  long: { basse: 185, haute: 225 }           // plus de 7 nuits
};
const bracket = (nights) => (nights === 2 ? 2 : nights === 3 ? 3 : nights <= 6 ? 'short' : nights === 7 ? 7 : 'long');
const seasonOf = (date) => (SEASON_MONTHS.basse.includes(date.getUTCMonth() + 1) ? 'basse' : 'haute');
const parse = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? new Date(`${iso}T00:00:00Z`) : null);

// { nights, total, perNight, seasons } ; total = null si moins de 2 nuits (hors grille).
export function estimateStay(arrivalIso, departureIso) {
  const start = parse(arrivalIso);
  const end = parse(departureIso);
  if (!start || !end || end <= start) return null;
  const nights = Math.round((end - start) / 86400000);
  if (nights < 2) return { nights, total: null, perNight: null, seasons: [seasonOf(start)] };
  const rates = NIGHTLY[bracket(nights)];
  const seasons = new Set();
  let sum = 0;
  for (let i = 0; i < nights; i += 1) {
    const night = new Date(start.getTime() + i * 86400000);
    const season = seasonOf(night);
    seasons.add(season);
    sum += rates[season];
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

// Estimation d'une demande enregistrée : grille, ou prix promo figé au moment de la demande.
export const estimateRequest = (request) => applyOffer(
  estimateStay(request.arrival, request.departure), request.arrival, request.departure,
  request.promo?.total ? [{ arrival: request.arrival, departure: request.departure, total: request.promo.total }] : []
);
