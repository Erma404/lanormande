import './cookie-notice.js';
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
