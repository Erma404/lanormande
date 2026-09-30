import { content } from './content.js';
import { applyOverrides } from './content-overrides.js';

const icon = (name, size = 18) => {
  const paths = {
    wifi: '<path d="M2.5 8.5a14 14 0 0 1 19 0M5.5 12a9.5 9.5 0 0 1 13 0M9 15.5a4.6 4.6 0 0 1 6 0"/><path d="M12 20h.01"/>',
    spark: '<path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
    fire: '<path d="M12 22c4.5 0 7-3.4 7-7.2 0-3.2-1.9-5.5-4.2-7.8.1 2.5-1.1 3.8-2.4 4.6.2-3.2-1.5-5.9-3.8-7.6.2 4.2-3.6 5.8-3.6 10.8C5.9 18.7 8.2 22 12 22Z"/>',
    utensils: '<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3v18M17 3c2 1.5 3 4 3 6.5S19 14.5 17 16"/>',
    parking: '<path d="M5 21V3h8a4 4 0 0 1 0 8H5"/>',
    broom: '<path d="m14 4 6 6M3 21l6.5-6.5M10 13l-3-3 7-7 3 3-7 7ZM3 21l4-9 5 5-9 4Z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    chevron: '<path d="m8 10 4 4 4-4"/>',
    star: '<path d="m12 2.7 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.3l6.2-.9L12 2.7Z"/>',
    pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 20v-1.5a5.5 5.5 0 0 1 11 0V20M16 5.5a3 3 0 0 1 0 5.8M20.5 20v-1.5a5.5 5.5 0 0 0-3.5-5.1"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.3 2.5 3.7 5.5 3.7 9s-1.4 6.5-3.7 9c-2.3-2.5-3.7-5.5-3.7-9s1.4-6.5 3.7-9Z"/>',
    badge: '<path d="m12 3 7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z"/><path d="m9 12 2 2 4-4"/>',
    ruler: '<path d="M3 16 16 3l5 5L8 21H3v-5Z"/><path d="m13.5 6.5 2 2M10 10l2 2M6.5 13.5l2 2"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m10.5 12.5 8-8M16 6l2 2M19 3l2 2"/>',
    chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.2 0-2.3-.2-3.4-.7L3 21l1.8-5.4A8.5 8.5 0 1 1 21 11.5Z"/>',
    map: '<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
    tag: '<path d="M20.6 12.6 12.6 20.6a2 2 0 0 1-2.8 0l-6.4-6.4a2 2 0 0 1 0-2.8L11.4 3.4A2 2 0 0 1 12.8 3H19a1 1 0 0 1 1 1v6.2a2 2 0 0 1-.4 1.4Z"/><circle cx="16" cy="8" r="1.5"/>',
    circleCheck: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.3 2.3 2.3 4.7-4.7"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};


// Floor-plan room data: language-independent (image, class, grid size, area,
// capacity number). Only the room name and "N guests" wording are translated,
// via content[lang].roomNames[cls] and content[lang].floorPlan.guestsWord().
const floorData = {
  ground: [
    ['01', 'entry', 'sm', '/images/maison-exterieur-jardin.avif', '8 m²', null],
    ['02', 'living', 'lg', '/images/piece-de-vie.jpeg', '38 m²', 8],
    ['03', 'kitchen', 'wd', '/images/cuisine-1.avif', '18 m²', 6],
    ['04', 'dining', 'wd', '/images/piece-de-vie.jpeg', '20 m²', 10],
    ['05', 'bed1', 'wd', '/images/chambre-1.avif', '18 m²', 2],
    ['06', 'bath0', 'sm', '/images/salle-de-bain.avif', '6 m²', null],
    ['07', 'terrace', 'lg', '/images/jardin-terrasse.avif', '8 000 m²', 20],
    ['08', 'veranda', 'wd', '/images/veranda.avif', '16 m²', 8],
    ['09', 'firepit', 'sm', '/images/coin-du-feu.avif', '—', 6],
    ['10', 'pingpong', 'sm', '/images/ping-pong.avif', '—', 4]
  ],
  first: [
    ['01', 'bed2', 'wd', '/images/chambre-2.avif', '16 m²', 2],
    ['02', 'bed3', 'wd', '/images/chambre-3.avif', '20 m²', 2],
    ['03', 'bath', 'sm', '/images/salle-de-bain.avif', '6 m²', null]
  ],
  second: [
    ['01', 'bed4', 'lg', '/images/chambre-4.avif', '15 m²', 2],
    ['02', 'bath2', 'sm', '/images/salle-de-bain.avif', '5 m²', null]
  ]
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const LANG_KEY = 'lmn-lang';
const detectLang = () => {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'fr' || saved === 'en') return saved;
  return navigator.language && navigator.language.toLowerCase().startsWith('en') ? 'en' : 'fr';
};
let lang = detectLang();

// Persistent app state — survives a language switch (re-mount), so a visitor
// who already picked dates / guests / a room doesn't lose their place.
const today = new Date(); today.setHours(0, 0, 0, 0);
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let selected = [];

// Nuits indisponibles (Airbnb + blocages admin), plages [arrivée, départ) au format ISO.
let blockedRanges = [];
let refreshCalendar = () => {};
const isoOf = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const isNightBlocked = (iso) => blockedRanges.some(([start, end]) => iso >= start && iso < end);
function rangeCrossesBookedDate(startIso, endIso) {
  const cursor = new Date(startIso + 'T00:00:00');
  const end = new Date(endIso + 'T00:00:00');
  while (cursor < end) {
    if (isNightBlocked(isoOf(cursor))) return true;
    cursor.setDate(cursor.getDate() + 1);
  }
  return false;
}
fetch('/api/availability')
  .then((response) => (response.ok ? response.json() : null))
  .then((data) => {
    if (!data?.blocked) return;
    blockedRanges = data.blocked;
    if (selected.length && (isNightBlocked(selected[0]) || (selected[1] && rangeCrossesBookedDate(selected[0], selected[1])))) selected = [];
    refreshCalendar();
  })
  .catch(() => {});
let guests = { adults: 2, children: 0 };
let activeSpace = 0;
let activeFloor = 'ground';

const guestSummaryText = () => {
  const t = content[lang].booking;
  const parts = [`${guests.adults} ${t.adultWord(guests.adults)}`];
  if (guests.children) parts.push(`${guests.children} ${t.childWord(guests.children)}`);
  return parts.join(', ');
};
const formatShort = (iso) => {
  const t = content[lang];
  const [, m, d] = iso.split('-').map(Number);
  return t.formatShort(d, t.monthNames[m - 1].slice(0, 3));
};
const formatFull = (iso) => {
  if (!iso) return '—';
  const t = content[lang];
  const [y, m, d] = iso.split('-').map(Number);
  return t.formatFull(d, t.monthNames[m - 1], y);
};

let mountController = null;
let revealObserver = null;

function mount() {
  if (mountController) mountController.abort();
  mountController = new AbortController();
  const { signal } = mountController;
  if (revealObserver) revealObserver.disconnect();

  const t = content[lang];
  document.documentElement.lang = lang;
  document.title = t.meta.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t.meta.description);

  document.querySelector('#app').innerHTML = `
  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="${t.brandAria}"><span class="brand-mark"><i></i><i></i></span><span>La Maison<br><em>Normande</em></span></a>
    <nav class="nav-links" aria-label="Navigation principale">
      <a href="#cadre">${t.nav.cadre}</a><a href="#equipements">${t.nav.equipements}</a><a href="#chambres">${t.nav.chambres}</a><a href="#plan">${t.nav.plan}</a><a href="#avis">${t.nav.avis}</a><a href="#faq">${t.nav.faq}</a>
    </nav>
    <button class="header-cta booking-trigger">${t.headerCta} <span>${icon('arrow', 15)}</span></button>
    <button class="lang-toggle" id="lang-toggle" aria-label="${t.langToggleAria}">${t.langToggleLabel}</button>
    <button class="menu-toggle" aria-label="${t.menuAria}"><i class="menu-toggle-bars"><span></span><span></span><span></span></i><i class="menu-toggle-x">${icon('close', 20)}</i></button>
  </header>

  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-image image-placeholder"><img src="/images/la-maison.jpeg" alt="${t.hero.imageAlt}" /></div>
      <div class="hero-wash"></div>
      <div class="hero-copy shell">
        <p class="eyebrow light"><span></span>${t.hero.eyebrow}</p>
        <h1 id="hero-title">${t.hero.titleLine1}<br><em>${t.hero.titleEm}</em></h1>
        <p class="hero-intro">${t.hero.intro}</p>
        <a href="#cadre" class="text-link light-link">${t.hero.discover} ${icon('arrow', 17)}</a>
      </div>
      <aside class="booking-card" id="booking" aria-label="${t.booking.aria}">
        <div class="booking-top"><div><p class="booking-label">${t.booking.label}</p><h2>${t.booking.title}</h2></div><span class="booking-status"><i></i>${t.booking.status}</span></div>
        <div class="calendar-header"><button id="cal-prev" aria-label="${t.booking.prevAria}">‹</button><strong id="cal-month"></strong><button id="cal-next" aria-label="${t.booking.nextAria}">›</button></div>
        <div class="weekdays">${t.days.map(d => `<span>${d}</span>`).join('')}</div>
        <div class="calendar-grid" id="calendar-grid"></div>
        <div class="date-fields"><button><span>${t.booking.arrival}</span><strong id="arrival-value">${selected[0] ? formatShort(selected[0]) : t.booking.select}</strong></button><button><span>${t.booking.departure}</span><strong id="departure-value">${selected[1] ? formatShort(selected[1]) : t.booking.select}</strong></button></div>
        <div class="guest-line"><span>${icon('users', 17)} ${t.booking.travelers}</span><button class="guest-toggle"><strong id="guest-summary">${guestSummaryText()}</strong>${icon('chevron', 15)}</button></div>
        <div class="guest-panel" hidden>
          <div><span>${t.booking.adults} <small>${t.booking.adultsSub}</small></span><p class="stepper"><button data-type="adults" data-change="-1">−</button><b id="adult-count">${guests.adults}</b><button data-type="adults" data-change="1">+</button></p></div>
          <div><span>${t.booking.children} <small>${t.booking.childrenSub}</small></span><p class="stepper"><button data-type="children" data-change="-1">−</button><b id="child-count">${guests.children}</b><button data-type="children" data-change="1">+</button></p></div>
        </div>
        <button class="reserve-button" id="reserve">${t.booking.reserve} <span>${t.booking.fromPrice}</span></button>
        <p class="booking-note">${t.booking.note}</p>
      </aside>
      <div class="hero-bottom"><span>${t.hero.travelers}</span><span>${t.hero.specs}</span></div>
    </section>

    <section class="intro section shell" id="cadre">
      <div class="intro-collage" aria-label="Aperçus de la maison">
        <figure class="intro-photo one image-placeholder"><img src="/images/piece-de-vie.jpeg" alt="${t.cadre.photoOneAlt}" loading="lazy" /><figcaption>${t.cadre.photoOneCaption}</figcaption></figure>
        <figure class="intro-photo two image-placeholder"><img src="/images/jardin-table.avif" alt="${t.cadre.photoTwoAlt}" loading="lazy" /><figcaption>${t.cadre.photoTwoCaption}</figcaption></figure>
        <div class="review-stamp"><strong>${t.cadre.overallRating}<small>/5</small></strong><span>${icon('star', 13)} ${t.cadre.reviewsVerified}</span></div>
      </div>
      <div class="intro-copy">
        <p class="eyebrow"><span></span>${t.cadre.eyebrow}</p>
        <h2>${t.cadre.h2}</h2>
        <p>${t.cadre.p1}</p>
        <p>${t.cadre.p2}</p>
        <a href="#chambres" class="text-link">${t.cadre.link} ${icon('arrow', 17)}</a>
      </div>
    </section>

    <section class="amenities section" id="equipements"><div class="shell">
      <div class="centered-heading"><p class="eyebrow"><span></span>${t.amenitiesSection.eyebrow}</p><h2>${t.amenitiesSection.h2}</h2></div>
      <div class="amenities-grid">${t.amenities.map(([i, label]) => `<div class="amenity"><span class="amenity-icon">${icon(i, 17)}</span><strong>${label}</strong></div>`).join('')}</div>
      <button class="outline-button" id="amenities-button" aria-haspopup="dialog">${t.amenitiesSection.seeAll} ${icon('arrow', 16)}</button>
    </div></section>

    <div class="modal-backdrop" id="amenities-modal" hidden>
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-head"><h3 id="modal-title">${t.amenitiesSection.modalTitle}</h3><button class="modal-close" id="modal-close" aria-label="${t.amenitiesSection.closeAria}">${icon('close', 18)}</button></div>
        <div class="modal-body">${t.amenityCategories.map(([category, items]) => `
          <section class="modal-category"><h4>${category}</h4>${items.map(item => `<div class="modal-item">${icon('check', 15)}<span>${item}</span></div>`).join('')}</section>
        `).join('')}</div>
      </div>
    </div>

    <section class="spaces section" id="chambres"><div class="shell">
      <div class="section-top"><div><p class="eyebrow"><span></span>${t.spacesSection.eyebrow}</p><h2>${t.spacesSection.h2}</h2></div><div class="carousel-controls"><button class="carousel-prev" aria-label="${t.spacesSection.prevAria}">←</button><span><b id="slide-index">01</b> <i></i> ${String(t.spaces.length).padStart(2,'0')}</span><button class="carousel-next" aria-label="${t.spacesSection.nextAria}">→</button></div></div>
      <div class="space-stage">
        <div class="space-image image-placeholder" id="space-image" role="button" tabindex="0" aria-label="${t.spacesSection.imageAria}"></div>
        <article class="space-caption"><p class="eyebrow"><span></span><span id="space-count"></span></p><h3 id="space-title"></h3><p id="space-text"></p><button class="text-link" id="open-gallery">${t.spacesSection.seeAllPhotos} ${icon('arrow', 17)}</button></article>
      </div>
      <div class="space-thumbnails" id="space-thumbnails"></div>
    </div></section>

    <div class="modal-backdrop gallery-backdrop" id="gallery-modal" hidden>
      <button class="gallery-close" id="gallery-close" aria-label="${t.spacesSection.galleryCloseAria}">${icon('close', 20)}</button>
      <button class="gallery-nav prev" id="gallery-prev" aria-label="${t.spacesSection.galleryPrevAria}">${icon('arrow', 20)}</button>
      <figure class="gallery-figure">
        <img id="gallery-image" src="" alt="" />
        <figcaption><strong id="gallery-title"></strong><span id="gallery-count"></span></figcaption>
      </figure>
      <button class="gallery-nav next" id="gallery-next" aria-label="${t.spacesSection.galleryNextAria}">${icon('arrow', 20)}</button>
    </div>

    <section class="host section"><div class="shell host-grid">
      <div class="host-portrait-wrap">
        <div class="host-portrait image-placeholder"><img src="/images/christophe.jpg" alt="${t.host.portraitAlt}" loading="lazy" /></div>
        <div class="host-card">
          <strong>${t.host.name}</strong>
          <div class="host-fact">${icon('globe', 16)}<span>${t.host.languages}</span></div>
          <div class="host-fact">${icon('badge', 16)}<span>${t.host.years}</span></div>
        </div>
      </div>
      <div class="host-copy"><p class="eyebrow"><span></span>${t.host.eyebrow}</p><blockquote>${t.host.quote}</blockquote><p>${t.host.bio}</p><a href="#booking" class="text-link booking-trigger">${t.host.cta} ${icon('arrow', 17)}</a></div>
    </div></section>

    <section class="floor-plan section" id="plan"><div class="shell">
      <div class="plan-heading"><p class="eyebrow light"><span></span>${t.floorPlan.eyebrow}</p><h2>${t.floorPlan.h2}</h2><p>${t.floorPlan.p}</p></div>
      <div class="plan-tabs" role="tablist"><button class="${activeFloor === 'ground' ? 'active' : ''}" data-floor="ground">${t.floorPlan.tabs.ground}</button><button class="${activeFloor === 'first' ? 'active' : ''}" data-floor="first">${t.floorPlan.tabs.first}</button><button class="${activeFloor === 'second' ? 'active' : ''}" data-floor="second">${t.floorPlan.tabs.second}</button></div>
      <div class="house-plan" id="house-plan"></div>
      <div class="plan-key" id="plan-key"></div>
    </div></section>

    <section class="nearby section" id="nearby">
      <div class="shell">
        <div class="section-top"><div><p class="eyebrow"><span></span>${t.nearbySection.eyebrow}</p><h2>${t.nearbySection.h2}</h2></div><a class="text-link booking-trigger" href="#booking">${t.nearbySection.cta} ${icon('arrow', 17)}</a></div>
        <div class="nearby-pin-body">
          <div class="nearby-pin-image" id="nearby-pin-image">${t.nearbyItems.map(([, , , img], i) => `<div class="nearby-pin-slide ${i === 0 ? 'active' : ''}" data-index="${i}" style="background-image:url('${img}')"></div>`).join('')}</div>
          <div class="nearby-pin-list" id="nearby-pin-list">${t.nearbyItems.map(([title, time, text], i) => `<article class="${i === 0 ? 'active' : ''}" data-index="${i}" role="button" tabindex="0" aria-label="${title}"><span class="nearby-no">0${i + 1}</span><div><h3>${title}</h3><p>${text}</p></div><span>${time}</span></article>`).join('')}</div>
        </div>
        <div class="nearby-pin-progress" id="nearby-pin-progress">${t.nearbyItems.map((_, i) => `<i class="${i === 0 ? 'active' : ''}"></i>`).join('')}</div>
      </div>
    </section>

    <section class="reviews section" id="avis">
      <div class="shell reviews-lead"><p class="eyebrow"><span></span>${t.reviewsSection.eyebrow}</p><h2>${t.reviewsSection.h2}</h2></div>
      <div class="shell reviews-stats">
        <div class="stat-block"><strong>${t.reviewsSection.count}</strong><span>${t.reviewsSection.countLabel}</span></div>
        <div class="stat-block"><strong>${t.reviewsSection.overallRating}</strong><span class="stars">★★★★★</span></div>
        <div class="stat-bars">${t.ratingCategories.map(([label, score]) => `<div class="stat-bar-row"><span>${label}</span><span class="stat-bar"><i style="width:${Number(score.replace(',', '.')) / 5 * 100}%"></i></span><b>${score}</b></div>`).join('')}</div>
      </div>
      <div class="review-scroll-wrap">
        <div class="review-cards" id="review-cards">${t.reviews.concat(t.reviews).map(([initials, name, date, text], i) => `<article class="${i % t.reviews.length === 1 ? 'highlight' : ''}" aria-hidden="${i >= t.reviews.length ? 'true' : 'false'}"><div class="review-top"><span class="initials">${initials}</span><div><b>${name}</b><small>${date}</small></div><span class="stars">★★★★★</span></div><p>“${text}”</p></article>`).join('')}</div>
      </div>
    </section>

    <section class="faq section" id="faq"><div class="shell faq-grid"><div><p class="eyebrow"><span></span>${t.faqSection.eyebrow}</p><h2>${t.faqSection.h2}</h2><p class="faq-intro">${t.faqSection.intro}</p><a class="outline-button small" href="mailto:bonjour@lamaisonnormande.fr">${t.faqSection.contact} ${icon('arrow', 16)}</a></div><div class="accordion">${t.faq.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q} <span>${icon('plus',18)}</span></summary><p>${a}</p></details>`).join('')}</div></div></section>

    <section class="final-cta"><div class="final-image image-placeholder"><img src="/images/les-alentours.jpeg" alt="${t.finalCta.imageAlt}" loading="lazy" /></div><div class="final-wash"></div><div class="shell final-copy"><p class="eyebrow light"><span></span>${t.finalCta.eyebrow}</p><h2>${t.finalCta.h2}</h2><button class="reserve-button booking-trigger">${t.finalCta.button}</button><p class="final-note">${t.finalCta.note}</p></div></section>
  </main>
  <footer><div class="shell footer-row"><a class="brand footer-brand" href="#top"><span class="brand-mark"><i></i><i></i></span><span>La Maison<br><em>Normande</em></span></a><p>${t.footer.tagline}</p><div><a href="#cadre">${t.footer.linkHouse}</a><a href="#faq">${t.footer.linkFaq}</a><a href="mailto:bonjour@lamaisonnormande.fr">${t.footer.linkContact}</a></div></div><div class="shell footer-bottom"><span>${t.footer.copyright}</span><span>${t.footer.bottomNote}</span></div></footer>
  <div class="toast" role="status" aria-live="polite"></div>

  <div class="modal-backdrop" id="reserve-modal" hidden>
    <div class="modal-card reserve-card" role="dialog" aria-modal="true" aria-labelledby="reserve-modal-title">
      <div class="modal-head"><h3 id="reserve-modal-title">${t.reserveModal.title}</h3><button class="modal-close" id="reserve-modal-close" aria-label="${t.amenitiesSection.closeAria}">${icon('close', 18)}</button></div>
      <form class="reserve-form" id="reserve-form">
        <p class="reserve-form-intro">${t.reserveModal.intro}</p>
        <label>${t.reserveModal.name}<input type="text" id="rf-name" name="name" required placeholder="${t.reserveModal.namePlaceholder}" /></label>
        <div class="reserve-form-row">
          <label>${t.reserveModal.arrival}<input type="date" id="rf-arrival" name="arrival" required /></label>
          <label>${t.reserveModal.departure}<input type="date" id="rf-departure" name="departure" required /></label>
        </div>
        <label>${t.reserveModal.guests}<input type="number" id="rf-guests" name="guests" min="1" max="8" value="${guests.adults + guests.children}" required /></label>
        <label>${t.reserveModal.message}<textarea id="rf-message" name="message" rows="2" placeholder="${t.reserveModal.messagePlaceholder}"></textarea></label>
        <button type="submit" class="reserve-button">${t.reserveModal.submit} ${icon('arrow', 16)}</button>
      </form>
    </div>
  </div>
`;

  // ---- language toggle -----------------------------------------------------
  $('#lang-toggle').addEventListener('click', () => {
    lang = lang === 'fr' ? 'en' : 'fr';
    localStorage.setItem(LANG_KEY, lang);
    mount();
  });

  // ---- booking widget: real calendar (past dates locked, month navigation) -
  const showToast = (message) => { const toast = $('.toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3500); };

  function renderCalendar() {
    const firstWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday-first
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = Array(firstWeekday).fill(null).concat(Array.from({ length: totalDays }, (_, i) => i + 1));
    while (cells.length % 7 !== 0) cells.push(null);

    $('#cal-month').textContent = `${t.monthNames[viewMonth]} ${viewYear}`;
    $('#cal-prev').disabled = viewYear === today.getFullYear() && viewMonth === today.getMonth();

    $('#calendar-grid').innerHTML = cells.map(day => {
      if (!day) return '<span></span>';
      const cellDate = new Date(viewYear, viewMonth, day);
      const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = cellDate < today;
      const isBooked = !isPast && isNightBlocked(iso);
      // Un jour dont la nuit est prise reste choisissable comme date de départ.
      const isValidDeparture = selected.length === 1 && iso > selected[0] && !rangeCrossesBookedDate(selected[0], iso);
      const disabled = isPast || (isBooked && !isValidDeparture);
      const isSelected = selected.includes(iso);
      const inRange = selected.length === 2 && iso > selected[0] && iso < selected[1];
      return `<button class="calendar-day ${isBooked && !isValidDeparture ? 'unavailable' : ''} ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''} ${inRange ? 'in-range' : ''}" data-date="${iso}" ${disabled ? 'disabled' : ''}>${day}</button>`;
    }).join('');

    $$('.calendar-day:not([disabled])').forEach(day => day.addEventListener('click', () => {
      const iso = day.dataset.date;
      if (selected.length === 2) selected = [];
      selected.push(iso);
      selected.sort();
      if (selected.length === 2) {
        if (rangeCrossesBookedDate(selected[0], selected[1])) {
          showToast(t.toast.conflict);
          selected = [iso];
          $('#arrival-value').textContent = formatShort(iso);
          $('#departure-value').textContent = t.booking.select;
        } else {
          $('#arrival-value').textContent = formatShort(selected[0]);
          $('#departure-value').textContent = formatShort(selected[1]);
        }
      } else {
        $('#arrival-value').textContent = formatShort(iso);
        $('#departure-value').textContent = t.booking.select;
      }
      renderCalendar();
    }));
  }

  $('#cal-prev').addEventListener('click', () => {
    if ($('#cal-prev').disabled) return;
    viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  $('#cal-next').addEventListener('click', () => {
    viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });
  renderCalendar();
  refreshCalendar = renderCalendar;

  $('.guest-toggle').addEventListener('click', () => { const panel = $('.guest-panel'); panel.hidden = !panel.hidden; });
  $$('.stepper button').forEach(button => button.addEventListener('click', () => {
    const type = button.dataset.type; const next = guests[type] + Number(button.dataset.change);
    if (next < 0 || (type === 'adults' && next < 1) || guests.adults + guests.children + (next - guests[type]) > 8) return;
    guests[type] = next; $(`#${type === 'adults' ? 'adult' : 'child'}-count`).textContent = next;
    $('#guest-summary').textContent = guestSummaryText();
  }));

  // ---- reservation modal: every "book now" CTA hands off to WhatsApp -------
  const WHATSAPP_NUMBER = '33603830585'; // Christophe
  const reserveModal = $('#reserve-modal');
  const openReserveModal = () => {
    if (selected.length === 2) { $('#rf-arrival').value = selected[0]; $('#rf-departure').value = selected[1]; }
    $('#rf-guests').value = guests.adults + guests.children;
    reserveModal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#rf-name').focus();
  };
  const closeReserveModal = () => { reserveModal.hidden = true; document.body.style.overflow = ''; };
  $$('.booking-trigger').forEach(button => button.addEventListener('click', (event) => { event.preventDefault(); openReserveModal(); }));
  $('#reserve').addEventListener('click', openReserveModal);
  $('#reserve-modal-close').addEventListener('click', closeReserveModal);
  reserveModal.addEventListener('click', (event) => { if (event.target === reserveModal) closeReserveModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !reserveModal.hidden) closeReserveModal(); }, { signal });

  $('#reserve-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('#rf-name').value.trim();
    const arrival = $('#rf-arrival').value;
    const departure = $('#rf-departure').value;
    const guestCount = $('#rf-guests').value;
    if (arrival && departure && (departure <= arrival || rangeCrossesBookedDate(arrival, departure))) {
      showToast(t.toast.conflict);
      return;
    }
    const extra = $('#rf-message').value.trim();
    let message = t.whatsapp(name, formatFull(arrival), formatFull(departure), guestCount);
    if (extra) message += ` ${extra}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    closeReserveModal();
  });

  // ---- spaces carousel ------------------------------------------------------
  const spacesTotal = String(t.spaces.length).padStart(2,'0');
  const galleryModal = $('#gallery-modal');
  function renderSpace() {
    const [title, text, image] = t.spaces[activeSpace];
    $('#space-image').innerHTML = `<img src="${image}" alt="${t.spacesSection.imageAltSuffix(title)}" loading="lazy" />`; $('#space-title').textContent = title; $('#space-text').textContent = text;
    $('#space-count').textContent = `${String(activeSpace + 1).padStart(2,'0')} — ${spacesTotal}`; $('#slide-index').textContent = String(activeSpace + 1).padStart(2,'0');
    $('#space-thumbnails').innerHTML = t.spaces.map(([title,,image], i) => `<button class="space-thumb ${i===activeSpace?'active':''}" data-space="${i}" aria-label="${title}"><img src="${image}" alt="" /><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');
    $$('.space-thumb').forEach(button => button.addEventListener('click', () => { activeSpace = Number(button.dataset.space); renderSpace(); if (!galleryModal.hidden) renderGallery(); }));
    if (galleryModal && !galleryModal.hidden) renderGallery();
  }
  $('.carousel-prev').addEventListener('click', () => { activeSpace = (activeSpace + t.spaces.length - 1) % t.spaces.length; renderSpace(); });
  $('.carousel-next').addEventListener('click', () => { activeSpace = (activeSpace + 1) % t.spaces.length; renderSpace(); });
  renderSpace();

  // ---- photo gallery ---------------------------------------------------------
  function renderGallery() {
    const [title, , image] = t.spaces[activeSpace];
    $('#gallery-image').src = image; $('#gallery-image').alt = t.spacesSection.imageAltSuffix(title);
    $('#gallery-title').textContent = title;
    $('#gallery-count').textContent = `${String(activeSpace + 1).padStart(2,'0')} / ${spacesTotal}`;
  }
  const openGallery = () => { renderGallery(); galleryModal.hidden = false; document.body.style.overflow = 'hidden'; $('#gallery-close').focus(); };
  const closeGallery = () => { galleryModal.hidden = true; document.body.style.overflow = ''; $('#open-gallery').focus(); };
  $('#space-image').addEventListener('click', openGallery);
  $('#space-image').addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openGallery(); } });
  $('#open-gallery').addEventListener('click', openGallery);
  $('#gallery-close').addEventListener('click', closeGallery);
  galleryModal.addEventListener('click', (event) => { if (event.target === galleryModal) closeGallery(); });
  $('#gallery-prev').addEventListener('click', () => { activeSpace = (activeSpace + t.spaces.length - 1) % t.spaces.length; renderGallery(); renderSpace(); });
  $('#gallery-next').addEventListener('click', () => { activeSpace = (activeSpace + 1) % t.spaces.length; renderGallery(); renderSpace(); });
  document.addEventListener('keydown', (event) => {
    if (galleryModal.hidden) return;
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowLeft') $('#gallery-prev').click();
    if (event.key === 'ArrowRight') $('#gallery-next').click();
  }, { signal });

  // ---- floor plan -------------------------------------------------------------
  function renderFloor(floor = 'ground') {
    activeFloor = floor;
    const rooms = floorData[floor];
    $('#house-plan').innerHTML = rooms.map(([n, cls, gridSize, img, area, capacityNum]) => {
      const name = t.roomNames[cls];
      const capacity = capacityNum == null ? '—' : t.floorPlan.guestsWord(capacityNum);
      return `
    <div class="room ${cls} size-${gridSize}" tabindex="0" role="button" aria-expanded="false" aria-label="${t.floorPlan.roomDetailsAria(name)}">
      <span class="room-dot" aria-hidden="true"></span>
      <span class="room-label"><b aria-hidden="true">${n}</b><strong>${name}</strong></span>
      <div class="room-card" aria-hidden="true">
        <div class="room-card-image image-placeholder"><img src="${img}" alt="" loading="lazy" /></div>
        <div class="room-card-body"><strong>${name}</strong><div class="room-card-meta"><span>${icon('ruler', 13)} ${area}</span><span>${icon('users', 13)} ${capacity}</span></div></div>
      </div>
    </div>`;
    }).join('');
    $('#plan-key').innerHTML = rooms.map(([n, cls]) => `<span><b>${n}</b>${t.roomNames[cls]}</span>`).join('');
    $$('.room').forEach(room => {
      const toggle = () => { const open = room.classList.toggle('open'); room.setAttribute('aria-expanded', String(open)); };
      room.addEventListener('click', toggle);
      room.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } });
    });
  }
  $$('.plan-tabs button').forEach(button => button.addEventListener('click', () => { $$('.plan-tabs button').forEach(b => b.classList.toggle('active', b === button)); renderFloor(button.dataset.floor); }));
  renderFloor(activeFloor);

  // ---- amenities modal ----------------------------------------------------
  const modal = $('#amenities-modal');
  const openModal = () => { modal.hidden = false; document.body.style.overflow = 'hidden'; $('#modal-close').focus(); };
  const closeModal = () => { modal.hidden = true; document.body.style.overflow = ''; $('#amenities-button').focus(); };
  $('#amenities-button').addEventListener('click', openModal);
  $('#modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); }, { signal });

  $('.menu-toggle').addEventListener('click', () => { $('.nav-links').classList.toggle('open'); $('.menu-toggle').classList.toggle('open'); });
  $$('.nav-links a').forEach(link => link.addEventListener('click', () => $('.nav-links').classList.remove('open')));

  // ---- hero parallax --------------------------------------------------------
  const heroImg = document.querySelector('.hero-image img');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroImg && !reduceMotion) {
    const hero = $('.hero');
    let ticking = false;
    const updateParallax = () => {
      const rect = hero.getBoundingClientRect();
      const maxShift = rect.height * 0.09;
      const offset = Math.max(-maxShift, Math.min(maxShift, rect.top * -0.15));
      heroImg.style.transform = `translateY(${offset}px) scale(1.22)`;
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; } }, { passive: true, signal });
    updateParallax();
  }

  // ---- nearby: click a list item to switch the photo (previously scroll-driven,
  // which felt unpredictable — a plain click is more direct and works identically
  // on desktop and mobile). ----------------------------------------------------
  const nearbyListItems = $$('#nearby-pin-list > article');
  if (nearbyListItems.length) {
    const nearbySlides = $$('.nearby-pin-slide');
    const nearbyDots = $$('#nearby-pin-progress > i');
    let nearbyActive = 0;

    const setNearbyActive = (index) => {
      if (index === nearbyActive) return;
      nearbyActive = index;
      nearbySlides.forEach(el => el.classList.toggle('active', Number(el.dataset.index) === index));
      nearbyListItems.forEach(el => el.classList.toggle('active', Number(el.dataset.index) === index));
      nearbyDots.forEach((el, i) => el.classList.toggle('active', i === index));
    };

    nearbyListItems.forEach(el => {
      const index = Number(el.dataset.index);
      el.addEventListener('click', () => setNearbyActive(index));
      el.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setNearbyActive(index); } });
    });
  }

  // ---- scroll reveal ----------------------------------------------------------
  $$('.amenities-grid, .review-cards, .accordion').forEach(group => group.classList.add('reveal-group'));
  const revealEls = $$([
    '.hero h1', '.hero-intro', '.hero .text-link',
    '.eyebrow', '.section h2', '.intro-copy > p:not(.eyebrow)',
    '.amenities-grid > .amenity',
    '.host-copy blockquote', '.host-copy > p:not(.eyebrow)', '.host-portrait-wrap',
    '.plan-heading > *:not(.eyebrow)',
    '.reviews-stats', '.review-cards > article',
    '.faq-intro', '.accordion > details',
    '.final-copy > *:not(.eyebrow)'
  ].join(', '));
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('reveal', 'in-view'));
  } else {
    revealEls.forEach(el => el.classList.add('reveal'));
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }
}

// Textes modifiés depuis l'admin : on les attend au plus 1,5 s avant d'afficher la page.
Promise.race([
  fetch('/api/content').then((response) => (response.ok ? response.json() : null)).catch(() => null),
  new Promise((resolve) => setTimeout(resolve, 1500, null))
]).then((overrides) => {
  if (overrides) applyOverrides(content, overrides);
  mount();
});
