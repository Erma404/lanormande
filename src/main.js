import { content } from './content.js';
import { applyOverrides } from './content-overrides.js';
import { icon, renderPage } from './page.js';
import { SITE_URL } from './site.js';

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

// La langue vient de l'URL (/ = français, /en = anglais) : chaque version a sa propre
// adresse, indexable par les moteurs de recherche.
const langFromPath = () => (/^\/en(\/|$)/.test(location.pathname) ? 'en' : 'fr');
const pathForLang = (value) => (value === 'en' ? '/en' : '/');
let lang = langFromPath();

// Persistent app state — survives a language switch (re-mount), so a visitor
// who already picked dates / guests / a room doesn't lose their place.
const today = new Date(); today.setHours(0, 0, 0, 0);
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let selected = [];

// Nuits indisponibles (Airbnb + blocages admin), plages [arrivée, départ) au format ISO.
let blockedRanges = [];
let availabilityLoaded = false;
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
// Tant que les disponibilités ne sont pas chargées, le calendrier affiche un squelette et
// n'accepte pas de clic (on ne laisse pas choisir une date peut-être déjà prise).
const finishAvailability = () => { if (!availabilityLoaded) { availabilityLoaded = true; refreshCalendar(); } };
setTimeout(finishAvailability, 5000);
fetch('/api/availability')
  .then((response) => (response.ok ? response.json() : null))
  .then((data) => {
    if (data?.blocked) {
      blockedRanges = data.blocked;
      if (selected.length && (isNightBlocked(selected[0]) || (selected[1] && rangeCrossesBookedDate(selected[0], selected[1])))) selected = [];
    }
    finishAvailability();
  })
  .catch(finishAvailability);
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
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', SITE_URL + (lang === 'en' ? '/en' : '/'));

  document.querySelector('#app').innerHTML = renderPage(t, {
    arrivalText: selected[0] ? formatShort(selected[0]) : t.booking.select,
    departureText: selected[1] ? formatShort(selected[1]) : t.booking.select,
    guestSummary: guestSummaryText(),
    adults: guests.adults,
    children: guests.children,
    activeFloor
  });

  // ---- language toggle -----------------------------------------------------
  $('#lang-toggle').addEventListener('click', () => {
    lang = lang === 'fr' ? 'en' : 'fr';
    history.pushState(null, '', pathForLang(lang) + location.hash);
    mount();
  });

  // ---- la photo du haut grandit si la carte de réservation devient plus haute
  // (mois sur 6 semaines, choix des voyageurs ouvert) : la carte n'est jamais coupée.
  const bookingCard = $('.booking-card');
  const hero = $('.hero');
  if (window.ResizeObserver && bookingCard && hero) {
    const fitHero = () => {
      hero.style.minHeight = '';
      if (getComputedStyle(bookingCard).display === 'none') return;
      const margin = 32;
      const needed = bookingCard.offsetTop + bookingCard.offsetHeight + margin;
      const neededFromBottom = bookingCard.offsetHeight + margin * 2;
      const target = Math.max(needed, neededFromBottom);
      if (target > hero.offsetHeight) hero.style.minHeight = `${target}px`;
    };
    const observer = new ResizeObserver(fitHero);
    observer.observe(bookingCard);
    signal.addEventListener('abort', () => observer.disconnect());
  }

  // ---- booking widget: real calendar (past dates locked, month navigation) -
  const showToast = (message) => { const toast = $('.toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3500); };

  function renderCalendar() {
    const firstWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday-first
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = Array(firstWeekday).fill(null).concat(Array.from({ length: totalDays }, (_, i) => i + 1));
    while (cells.length % 7 !== 0) cells.push(null);

    $('#cal-month').textContent = `${t.monthNames[viewMonth]} ${viewYear}`;
    $('#cal-prev').disabled = viewYear === today.getFullYear() && viewMonth === today.getMonth();

    const grid = $('#calendar-grid');
    grid.classList.toggle('loading', !availabilityLoaded);
    grid.setAttribute('aria-busy', String(!availabilityLoaded));
    grid.innerHTML = cells.map(day => {
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
      if (!availabilityLoaded) return;
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

// La page arrive déjà rendue (HTML généré au build) : on la rend interactive tout de suite,
// puis on applique les textes modifiés depuis l'admin s'il y en a de plus récents.
mount();
fetch('/api/content')
  .then((response) => (response.ok ? response.json() : null))
  .then((overrides) => {
    if (!overrides || !Object.keys({ ...overrides.fr, ...overrides.en }).length) return;
    applyOverrides(content, overrides);
    mount();
  })
  .catch(() => {});

window.addEventListener('popstate', () => {
  const next = langFromPath();
  if (next !== lang) { lang = next; mount(); }
});
