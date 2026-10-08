// Mesure d'audience maison : sans cookie, sans stockage dans le navigateur, sans identifiant.
// Chaque page vue, clic sur un bouton suivi (attribut data-cta) ou étape de réservation
// incrémente un compteur du jour côté serveur (api/journal.js). Les chiffres sont dans l'admin.

const ENDPOINT = '/api/journal';
let lastCta = '';

export function track(event) {
  if (navigator.webdriver) return;
  // keepalive : l'envoi aboutit même si le clic mène à une autre page.
  fetch(ENDPOINT, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event) }).catch(() => {});
}

// Dernier bouton cliqué, transmis avec la demande de réservation pour savoir quel bouton convertit.
export const lastCtaId = () => lastCta;

// Une « visite » = une arrivée depuis l'extérieur du site (moteur, lien, QR code, adresse tapée).
const referrer = (() => { try { return document.referrer ? new URL(document.referrer).host : ''; } catch { return ''; } })();
const params = new URLSearchParams(location.search);
const entry = referrer !== location.host;
track({
  type: 'view',
  path: location.pathname,
  entry,
  ref: entry ? referrer : '',
  src: params.get('src') || params.get('utm_source') || '',
  lang: document.documentElement.lang,
  mobile: matchMedia('(max-width: 760px)').matches
});

// Phase de capture : le clic est compté avant que le bouton n'ouvre une fenêtre ou ne change de page.
document.addEventListener('click', (event) => {
  const button = event.target.closest?.('[data-cta]');
  if (!button || !event.isTrusted) return;
  lastCta = button.dataset.cta;
  track({ type: 'click', cta: lastCta });
}, true);
