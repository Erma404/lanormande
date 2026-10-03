// Bas de page commun (accueil, guide, pages légales) : liens légaux et crédit de réalisation.
const LABELS = {
  fr: { legal: 'Mentions légales', privacy: 'Confidentialité', madeBy: 'Réalisé par', contact: 'Contact', guide: 'Guide du pays d’Auge', guideHref: '/normandie-pays-d-auge' },
  en: { legal: 'Legal notice', privacy: 'Privacy', madeBy: 'Made by', contact: 'Contact', guide: 'Pays d’Auge guide', guideHref: '/en/normandy-guide' }
};

export function footerBottom(lang, note = '') {
  const l = LABELS[lang] || LABELS.fr;
  return `<div class="shell footer-bottom">
    <span>© 2026 Villa Normande · <a href="/mentions-legales">${l.legal}</a> · <a href="/politique-de-confidentialite">${l.privacy}</a></span>
    <span>${note ? `${note} · ` : ''}${l.madeBy} <a href="https://ernestinematjabo.com" target="_blank" rel="noopener">Ernestine</a></span>
  </div>`;
}

export function siteFooter(lang, { home, faqHref, tagline, homeLabel, faqLabel }) {
  const l = LABELS[lang] || LABELS.fr;
  return `<footer><div class="shell footer-row"><a class="brand footer-brand" href="${home}"><span class="brand-mark"><i></i><i></i></span><span>Villa<br><em>Normande</em></span></a><p>${tagline}</p><div><a href="${home}">${homeLabel}</a><a href="${faqHref}">${faqLabel}</a><a href="${l.guideHref}">${l.guide}</a><a href="mailto:contact@villanormande.com">${l.contact}</a></div></div>${footerBottom(lang, lang === 'fr' ? 'Danestal, Calvados, Normandie' : 'Danestal, Calvados, Normandy')}</footer>`;
}
