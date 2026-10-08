// Promotion en cours (/api/promo), chargée une seule fois et partagée : bannière et prix promo
// de la fenêtre de réservation. null hors période.
export const promoReady = fetch('/api/promo')
  .then((response) => (response.ok ? response.json() : null))
  .then((data) => data?.promo || null)
  .catch(() => null);
