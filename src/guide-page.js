import './cookie-notice.js';
import './whatsapp-widget.js';

// ---- « Réserver » : la fenêtre de réservation s'ouvre sur le guide, sans quitter la page.
// Son code (textes, calendrier, tarifs) n'est chargé qu'à l'approche du bouton, pour garder
// le guide léger. S'il ne charge pas, le lien mène à l'accueil, qui ouvre la même fenêtre.
const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
let modal = null;
const loadModal = () => modal ||= Promise.all([
  import('./reserve-modal.js'),
  import('./reserve-modal-html.js'),
  import('./content.js'),
  import('./content-overrides.js'),
  // Textes modifiés depuis l'admin, comme sur l'accueil.
  fetch('/api/content').then((response) => (response.ok ? response.json() : null)).catch(() => null)
]).then(([{ setupReserveModal }, { reserveModalHtml }, { content }, { applyOverrides }, overrides]) => {
  if (overrides) applyOverrides(content, overrides);
  const t = content[lang];
  document.body.insertAdjacentHTML('beforeend', reserveModalHtml(t));
  return setupReserveModal({ t, lang });
}).catch((error) => { modal = null; throw error; });

document.querySelectorAll('[data-reserve]').forEach((link) => {
  const warm = () => { loadModal().catch(() => {}); };
  link.addEventListener('pointerenter', warm, { once: true });
  link.addEventListener('touchstart', warm, { once: true, passive: true });
  link.addEventListener('focus', warm, { once: true });
  link.addEventListener('click', async (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return; // nouvel onglet : on laisse faire
    event.preventDefault();
    try { (await loadModal()).open(); } catch { location.href = link.href; }
  });
});
// Sommaire du guide : met en avant la rubrique en cours de lecture.
const links = [...document.querySelectorAll('.guide-toc a[href^="#"]')];
const sections = links.map((link) => document.getElementById(link.hash.slice(1))).filter(Boolean);

if (sections.length) {
  const toc = document.querySelector('.guide-toc');
  let current = null;
  const activate = (id) => {
    if (id === current) return;
    current = id;
    links.forEach((link) => {
      const active = link.hash === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
      // Barre horizontale (tablette, mobile) : garde l'onglet actif visible.
      if (active && toc.scrollWidth > toc.clientWidth) toc.scrollTo({ left: link.offsetLeft - 16, behavior: 'smooth' });
    });
  };
  // La rubrique active est la dernière dont le titre est passé sous le haut de l'écran.
  const update = () => {
    const line = window.innerHeight * 0.3;
    let id = sections[0].id;
    for (const section of sections) if (section.getBoundingClientRect().top <= line) id = section.id;
    activate(id);
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  update();
}
