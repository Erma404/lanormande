// Pages légales (en français, version de référence) : mentions légales et politique de confidentialité.
// Pré-générées au build comme le guide ; même en-tête et même pied de page.
import { SITE_URL } from './site.js';
import { siteFooter } from './footer.js';

export const LEGAL_PATHS = { mentions: '/mentions-legales', privacy: '/politique-de-confidentialite' };

const EDITOR = {
  name: 'Christophe Orange',
  place: 'Danestal (14430), Calvados, France',
  phone: '+33 6 03 83 05 85',
  email: 'contact@villanormande.com'
};

const pages = {
  mentions: {
    title: 'Mentions légales · Villa Normande',
    description: 'Mentions légales du site villanormande.com : éditeur, hébergeur, propriété intellectuelle et crédits.',
    h1: 'Mentions légales',
    updated: 'Dernière mise à jour : 3 octobre 2026',
    sections: [
      ['Éditeur du site', `<p>Le site <strong>villanormande.com</strong> est édité par <strong>${EDITOR.name}</strong>, propriétaire de la Villa Normande, maison de vacances située à ${EDITOR.place}.</p>
        <ul><li>Téléphone : <a href="tel:${EDITOR.phone.replace(/\s/g, '')}">${EDITOR.phone}</a></li><li>Email : <a href="mailto:${EDITOR.email}">${EDITOR.email}</a></li></ul>
        <p>Directeur de la publication : ${EDITOR.name}.</p>`],
      ['Hébergement', `<p>Le site est hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — <a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a>.</p>`],
      ['Conception et réalisation', `<p>Site conçu et réalisé par <a href="https://ernestinematjabo.com" target="_blank" rel="noopener">Ernestine Matjabo</a>.</p>`],
      ['Propriété intellectuelle', `<p>Les textes, photographies de la maison, éléments graphiques et la mise en page de ce site sont protégés par le droit d’auteur. Toute reproduction ou réutilisation, totale ou partielle, sans autorisation écrite préalable de l’éditeur est interdite.</p>`],
      ['Crédits', `<p>Les photographies des lieux présentés dans le <a href="/normandie-pays-d-auge">guide du pays d’Auge</a> proviennent, sauf mention contraire, de Wikimedia Commons et sont publiées sous licence libre ; l’auteur et la licence sont indiqués sur chaque photo. Fond de carte : © contributeurs <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>.</p>`],
      ['Responsabilité', `<p>Les informations du site (équipements, tarifs, disponibilités, temps de trajet) sont données à titre indicatif et peuvent évoluer. Une demande de réservation envoyée depuis le site n’engage aucune des parties tant qu’elle n’a pas été confirmée par le propriétaire.</p>`],
      ['Données personnelles', `<p>Le traitement des données personnelles est détaillé dans la <a href="${LEGAL_PATHS.privacy}">politique de confidentialité</a>.</p>`]
    ]
  },
  privacy: {
    title: 'Politique de confidentialité · Villa Normande',
    description: 'Données collectées par villanormande.com, finalités, durées de conservation, prestataires et droits RGPD.',
    h1: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : 3 octobre 2026',
    sections: [
      ['Responsable du traitement', `<p><strong>${EDITOR.name}</strong>, propriétaire de la Villa Normande, ${EDITOR.place}. Contact : <a href="mailto:${EDITOR.email}">${EDITOR.email}</a>.</p>`],
      ['Données collectées et pourquoi', `<p><strong>Demande de réservation.</strong> Quand vous envoyez une demande, nous recevons votre nom, votre email, votre téléphone (facultatif), vos dates, le nombre de voyageurs, votre message éventuel et la langue de la page. Ces données servent uniquement à répondre à votre demande et à organiser votre séjour (base légale : mesures précontractuelles prises à votre demande). Un email de confirmation vous est envoyé.</p>
        <p><strong>WhatsApp.</strong> Si vous choisissez d’écrire à Christophe sur WhatsApp, l’échange se fait dans cette application, selon ses propres conditions.</p>
        <p><strong>Sécurité.</strong> Pour limiter les envois automatisés, l’adresse IP est utilisée temporairement pour compter les demandes (effacée au bout de 24 heures au plus).</p>
        <p>Aucune donnée n’est vendue, ni utilisée à des fins publicitaires.</p>`],
      ['Durée de conservation', `<ul><li>Demandes de réservation : le temps de traiter la demande et du séjour, puis au plus 3 ans après le dernier contact.</li><li>Données de sécurité (compteurs anti-abus) : 24 heures au plus.</li><li>Codes de connexion à l’espace propriétaire : 15 minutes ; session : 12 heures.</li></ul>`],
      ['Prestataires', `<p>Le site s’appuie sur quelques prestataires techniques, qui ne traitent les données que pour notre compte :</p>
        <ul><li><strong>Vercel</strong> (hébergement du site) ;</li><li><strong>Upstash</strong> (stockage des demandes de réservation) ;</li><li><strong>Resend</strong> (envoi des emails) ;</li><li><strong>OpenStreetMap</strong> (fonds de carte du guide).</li></ul>
        <p>Certains sont établis aux États-Unis ; ces transferts sont encadrés par des garanties appropriées (Data Privacy Framework ou clauses contractuelles types de la Commission européenne).</p>`],
      ['Cookies et stockage local', `<p>Le site n’utilise <strong>aucun cookie publicitaire ni de mesure d’audience</strong>. Seuls des éléments strictement nécessaires sont utilisés, ce qui ne demande pas de consentement :</p>
        <ul><li>un cookie de session, uniquement pour l’espace propriétaire (12 heures) ;</li><li>un enregistrement dans votre navigateur (stockage local) pour ne plus afficher une bannière que vous avez fermée (promotion, information cookies).</li></ul>`],
      ['Vos droits', `<p>Vous pouvez accéder à vos données, les faire rectifier ou effacer, vous opposer à leur traitement ou en demander la limitation et la portabilité, en écrivant à <a href="mailto:${EDITOR.email}">${EDITOR.email}</a>. Vous pouvez aussi adresser une réclamation à la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener">CNIL</a>.</p>`]
    ]
  }
};

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const arrow = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

export function legalHead(kind) {
  const page = pages[kind];
  const url = SITE_URL + LEGAL_PATHS[kind];
  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    '<meta name="robots" content="index, follow" />',
    '<meta property="og:site_name" content="Villa Normande" />',
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:url" content="${url}" />`
  ].join('\n    ');
}

export function renderLegal(kind) {
  const page = pages[kind];
  return `
  <header class="site-header guide-header">
    <a class="brand" href="/" aria-label="Villa Normande"><span class="brand-mark"><i></i><i></i></span><span>Villa<br><em>Normande</em></span></a>
    <nav class="guide-nav" aria-label="Navigation">
      <a href="/">La maison</a>
      <a class="header-cta" href="/#booking">Je réserve ${arrow}</a>
    </nav>
  </header>
  <main class="legal shell">
    <p class="legal-updated">${esc(page.updated)}</p>
    <h1>${esc(page.h1)}</h1>
    ${page.sections.map(([title, body]) => `<section${title.startsWith('Cookies') ? ' id="cookies"' : ''}><h2>${esc(title)}</h2>${body}</section>`).join('\n    ')}
  </main>
  ${siteFooter('fr', { home: '/', faqHref: '/#faq', tagline: 'Une maison de famille, à Danestal.', homeLabel: 'La maison', faqLabel: 'Questions fréquentes' })}`;
}
