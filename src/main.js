import { content } from './content.js';
import { applyOverrides } from './content-overrides.js';
import { icon, renderPage } from './page.js';
import { imgAttrs, sized, srcset } from './images.js';
import { estimateStay } from './pricing.js';
import { SITE_URL } from './site.js';
import './cookie-notice.js';
import { WHATSAPP_NUMBER } from './whatsapp-widget.js';

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
  renderPromo();
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

  // ---- reservation modal: the request is saved on the site, WhatsApp stays as an alternative
  const reserveModal = $('#reserve-modal');
  // Récapitulatif du prix, comme à la fin d'un achat de billet : apparaît dès que les dates sont valides.
  const updateEstimate = () => {
    const box = $('#rf-estimate');
    const result = estimateStay($('#rf-arrival').value, $('#rf-departure').value);
    if (!result) { box.hidden = true; return; }
    const e = t.reserveModal.estimate;
    const money = (n) => new Intl.NumberFormat(e.locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
    $('#rf-est-nights').textContent = e.night(result.nights);
    if (result.total === null) {
      $('#rf-est-detail').textContent = e.oneNight;
      $('#rf-est-total').textContent = '—';
    } else {
      const season = result.seasons.length > 1 ? e.seasons.both : e.seasons[result.seasons[0]];
      const exact = result.perNight * result.nights === result.total;
      $('#rf-est-detail').textContent = `${season} · ${exact ? '' : e.approx}${money(result.perNight)} / ${e.perNight}`;
      $('#rf-est-total').textContent = money(result.total);
    }
    box.hidden = false;
  };
  // ---- calendrier de la fenêtre de réservation (comme Airbnb) -------------------
  // Mêmes disponibilités que le calendrier du haut (Airbnb + blocages admin) : les nuits prises
  // sont barrées ; une fois l'arrivée choisie, impossible de choisir un départ qui traverse une
  // nuit occupée. Le jour où une réservation commence reste possible comme jour de départ.
  const pk = t.reserveModal.picker;
  const picker = $('#rf-picker');
  let pick = [];
  let pickYear = today.getFullYear();
  let pickMonth = today.getMonth();
  const setDates = (arrival, departure) => {
    $('#rf-arrival').value = arrival || '';
    $('#rf-departure').value = departure || '';
    $('#rf-arrival-btn').textContent = arrival ? formatShort(arrival) : pk.choose;
    $('#rf-departure-btn').textContent = departure ? formatShort(departure) : pk.choose;
    $('#rf-arrival-btn').classList.toggle('filled', Boolean(arrival));
    $('#rf-departure-btn').classList.toggle('filled', Boolean(departure));
    updateEstimate();
  };
  const monthHtml = (year, month) => {
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells = Array(firstWeekday).fill(null).concat(Array.from({ length: totalDays }, (_, i) => i + 1));
    while (cells.length % 7 !== 0) cells.push(null);
    const days = cells.map(day => {
      if (!day) return '<span></span>';
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = new Date(year, month, day) < today;
      const isBooked = !isPast && isNightBlocked(iso);
      const choosingDeparture = pick.length === 1;
      const isValidDeparture = choosingDeparture && iso > pick[0] && !rangeCrossesBookedDate(pick[0], iso);
      // Arrivée choisie : les jours au-delà de la prochaine nuit occupée sont grisés (comme Airbnb).
      const beyondBooking = choosingDeparture && iso > pick[0] && !isValidDeparture;
      const disabled = isPast || (isBooked && !isValidDeparture) || beyondBooking;
      const isEdge = pick.includes(iso);
      const inRange = pick.length === 2 && iso > pick[0] && iso < pick[1];
      const cls = ['rf-day', isBooked && !isValidDeparture ? 'booked' : '', isPast ? 'past' : '', isEdge ? 'edge' : '', inRange ? 'in-range' : '',
        pick.length === 2 && iso === pick[0] ? 'start' : '', pick.length === 2 && iso === pick[1] ? 'end' : ''].filter(Boolean).join(' ');
      return `<button type="button" class="${cls}" data-date="${iso}" ${disabled ? 'disabled' : ''} ${isBooked && !isValidDeparture ? `title="${pk.booked}"` : ''}>${day}</button>`;
    }).join('');
    return `<div class="rf-month"><p class="rf-month-title">${t.monthNames[month]} ${year}</p><div class="rf-weekdays">${t.days.map(d => `<span>${d}</span>`).join('')}</div><div class="rf-days">${days}</div></div>`;
  };
  const renderPicker = () => {
    const second = pickMonth === 11 ? [pickYear + 1, 0] : [pickYear, pickMonth + 1];
    $('#rf-picker-prev').disabled = pickYear === today.getFullYear() && pickMonth === today.getMonth();
    $('#rf-picker-months').innerHTML = availabilityLoaded
      ? monthHtml(pickYear, pickMonth) + monthHtml(...second)
      : `<p class="rf-picker-loading">${pk.loading}</p>`;
    // En-tête : cases Arrivée / Départ (celle en cours de saisie est entourée) et récapitulatif.
    $('#rf-pf-arrival-val').textContent = pick[0] ? formatShort(pick[0]) : pk.choose;
    $('#rf-pf-departure-val').textContent = pick[1] ? formatShort(pick[1]) : pk.choose;
    $('#rf-pf-arrival').classList.toggle('active', pick.length !== 1);
    $('#rf-pf-departure').classList.toggle('active', pick.length === 1);
    $('#rf-pf-arrival').classList.toggle('filled', Boolean(pick[0]));
    $('#rf-pf-departure').classList.toggle('filled', Boolean(pick[1]));
    const result = pick.length === 2 ? estimateStay(pick[0], pick[1]) : null;
    const e = t.reserveModal.estimate;
    $('#rf-picker-hint').textContent = result
      ? `${e.night(result.nights)} · ${result.total === null ? e.oneNight : new Intl.NumberFormat(e.locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(result.total)}`
      : pick.length === 1 ? pk.departure : pk.subtitle;
    $$('#rf-picker-months .rf-day:not([disabled])').forEach(button => button.addEventListener('click', () => {
      const iso = button.dataset.date;
      if (pick.length !== 1 || iso <= pick[0]) pick = [iso];
      else pick = [pick[0], iso];
      renderPicker();
    }));
  };
  const openPicker = (field) => {
    const arrival = $('#rf-arrival').value;
    const departure = $('#rf-departure').value;
    pick = arrival && departure ? (field === 'departure' ? [arrival] : [arrival, departure]) : arrival ? [arrival] : [];
    const base = arrival ? new Date(`${arrival}T00:00:00`) : today;
    pickYear = base.getFullYear();
    pickMonth = base.getMonth();
    picker.hidden = false;
    picker.closest('.reserve-card').classList.add('picking');
    picker.closest('.reserve-card').scrollTop = 0;
    renderPicker();
    $('#rf-picker-done').focus();
  };
  const closePicker = (apply) => {
    if (apply && pick.length === 2) {
      setDates(pick[0], pick[1]);
      // Le calendrier du haut de page reprend les mêmes dates.
      selected = [...pick];
      $('#arrival-value').textContent = formatShort(pick[0]);
      $('#departure-value').textContent = formatShort(pick[1]);
      refreshCalendar();
    }
    picker.hidden = true;
    picker.closest('.reserve-card').classList.remove('picking');
  };
  $$('[data-picker]').forEach(button => button.addEventListener('click', () => openPicker(button.dataset.picker)));
  $('#rf-picker-done').addEventListener('click', () => closePicker(true));
  $('#rf-picker-clear').addEventListener('click', () => { pick = []; renderPicker(); });
  $('#rf-picker-prev').addEventListener('click', () => { pickMonth--; if (pickMonth < 0) { pickMonth = 11; pickYear--; } renderPicker(); });
  $('#rf-picker-next').addEventListener('click', () => { pickMonth++; if (pickMonth > 11) { pickMonth = 0; pickYear++; } renderPicker(); });

  const openReserveModal = () => {
    if (selected.length === 2) setDates(selected[0], selected[1]); else setDates('', '');
    picker.hidden = true;
    picker.closest('.reserve-card').classList.remove('picking');
    $('#rf-guests').value = guests.adults + guests.children;
    $('#reserve-form').hidden = false;
    $('#reserve-success').hidden = true;
    setReserveError('');
    reserveModal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#rf-name').focus();
  };
  // The message field starts small so the pop-in fits short screens, then grows with the text.
  $('#rf-message').addEventListener('input', (event) => {
    const field = event.target;
    field.style.height = '';
    field.style.height = `${Math.min(field.scrollHeight + 2, 140)}px`;
  });
  const setReserveError = (message) => { $('#rf-error').textContent = message; $('#rf-error').hidden = !message; };
  const closeReserveModal = () => { reserveModal.hidden = true; document.body.style.overflow = ''; };
  $$('.booking-trigger').forEach(button => button.addEventListener('click', (event) => { event.preventDefault(); openReserveModal(); }));
  // Tarifs : sélecteur de saison, ouvert sur la saison en cours (gélule « Saison actuelle »).
  const month = new Date().getMonth() + 1;
  const showSeason = (id) => {
    $$('.pricing-toggle [data-season]').forEach(tab => { const on = tab.dataset.season === id; tab.classList.toggle('active', on); tab.setAttribute('aria-selected', String(on)); });
    $$('.pricing-card').forEach(card => { card.hidden = card.id !== `season-${id}`; });
  };
  let currentSeason = null;
  $$('.pricing-card').forEach(card => {
    const isCurrent = card.dataset.months.split(',').map(Number).includes(month);
    card.classList.toggle('current', isCurrent);
    if (isCurrent) currentSeason = card.id.replace('season-', '');
  });
  $$('.pricing-toggle [data-season]').forEach(tab => {
    tab.classList.toggle('is-current', tab.dataset.season === currentSeason);
    tab.addEventListener('click', () => showSeason(tab.dataset.season));
  });
  if (currentSeason) showSeason(currentSeason);
  // Arrivée depuis le guide (lien « /#reserver ») : on ouvre la réservation tout de suite.
  if (location.hash === '#reserver') { history.replaceState(null, '', location.pathname + location.search); openReserveModal(); }
  $('#reserve').addEventListener('click', openReserveModal);
  $('#reserve-modal-close').addEventListener('click', closeReserveModal);
  reserveModal.addEventListener('click', (event) => { if (event.target === reserveModal) closeReserveModal(); });
  // Échap ferme d'abord le calendrier, puis la fenêtre.
  document.addEventListener('keydown', (event) => { if (event.key !== 'Escape' || reserveModal.hidden) return; if (!picker.hidden) closePicker(false); else closeReserveModal(); }, { signal });

  const readReserveForm = () => ({
    name: $('#rf-name').value.trim(),
    email: $('#rf-email').value.trim(),
    phone: $('#rf-phone').value.trim(),
    arrival: $('#rf-arrival').value,
    departure: $('#rf-departure').value,
    guests: Number($('#rf-guests').value),
    message: $('#rf-message').value.trim(),
    website: $('#rf-website').value,
    lang
  });
  // Contrôles faits avant l'envoi ; le serveur refait les mêmes.
  const reserveFormError = (data) => {
    const errors = t.reserveModal.errors;
    if (data.name.length < 2) return errors.invalid_name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) return errors.invalid_email;
    if (!data.arrival || !data.departure || data.departure <= data.arrival || data.arrival < isoOf(today)) return errors.invalid_range;
    if (rangeCrossesBookedDate(data.arrival, data.departure)) return t.toast.conflict;
    if (!Number.isInteger(data.guests) || data.guests < 1 || data.guests > 8) return errors.invalid_guests;
    return '';
  };

  $('#reserve-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = readReserveForm();
    const problem = reserveFormError(data);
    if (problem) return setReserveError(problem);
    setReserveError('');
    const button = event.submitter || $('#reserve-form .reserve-button');
    const label = button.innerHTML;
    button.disabled = true;
    button.textContent = t.reserveModal.sending;
    let error = '';
    try {
      const response = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!response.ok) error = (await response.json().catch(() => ({}))).error || 'server_error';
    } catch { error = 'network'; }
    button.disabled = false;
    button.innerHTML = label;
    if (error) return setReserveError(t.reserveModal.errors[error] || t.reserveModal.errors.server_error);
    $('#reserve-form').reset();
    setDates('', '');
    $('#reserve-form').hidden = true;
    $('#reserve-success').hidden = false;
    $('#reserve-success-close').focus();
  });
  $('#reserve-success-close').addEventListener('click', closeReserveModal);

  $('#rf-whatsapp').addEventListener('click', () => {
    const data = readReserveForm();
    let message = t.whatsapp(data.name || '—', formatFull(data.arrival), formatFull(data.departure), data.guests || 1);
    if (data.message) message += ` ${data.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  // ---- spaces carousel ------------------------------------------------------
  const spacesTotal = String(t.spaces.length).padStart(2,'0');
  const galleryModal = $('#gallery-modal');
  function renderSpace() {
    const [title, text, image] = t.spaces[activeSpace];
    $('#space-image').innerHTML = `<img ${imgAttrs(image, '(max-width: 720px) 100vw, 60vw')} alt="${t.spacesSection.imageAltSuffix(title)}" loading="lazy" />`; $('#space-title').textContent = title; $('#space-text').textContent = text;
    $('#space-count').textContent = `${String(activeSpace + 1).padStart(2,'0')} — ${spacesTotal}`; $('#slide-index').textContent = String(activeSpace + 1).padStart(2,'0');
    $('#space-thumbnails').innerHTML = t.spaces.map(([title,,image], i) => `<button class="space-thumb ${i===activeSpace?'active':''}" data-space="${i}" aria-label="${title}"><img src="${sized(image, 200)}" alt="" loading="lazy" /><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');
    $$('.space-thumb').forEach(button => button.addEventListener('click', () => { activeSpace = Number(button.dataset.space); renderSpace(); if (!galleryModal.hidden) renderGallery(); }));
    if (galleryModal && !galleryModal.hidden) renderGallery();
  }
  $('.carousel-prev').addEventListener('click', () => { activeSpace = (activeSpace + t.spaces.length - 1) % t.spaces.length; renderSpace(); });
  $('.carousel-next').addEventListener('click', () => { activeSpace = (activeSpace + 1) % t.spaces.length; renderSpace(); });
  renderSpace();

  // ---- photo gallery ---------------------------------------------------------
  function renderGallery() {
    const [title, , image] = t.spaces[activeSpace];
    $('#gallery-image').srcset = srcset(image); $('#gallery-image').sizes = '90vw'; $('#gallery-image').src = image; $('#gallery-image').alt = t.spacesSection.imageAltSuffix(title);
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
    // Une seule fiche ouverte à la fois : sur mobile, les fiches s'empilaient et masquaient le plan.
    const setOpen = (room, open) => { room.classList.toggle('open', open); room.setAttribute('aria-expanded', String(open)); };
    $$('.room').forEach(room => {
      const toggle = () => {
        const open = !room.classList.contains('open');
        $$('.room.open').forEach(other => setOpen(other, false));
        setOpen(room, open);
      };
      room.addEventListener('click', (event) => { event.stopPropagation(); toggle(); });
      room.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } });
    });
  }
  // Toucher ailleurs ou Échap referme la fiche ouverte.
  document.addEventListener('click', () => $$('.room.open').forEach(room => { room.classList.remove('open'); room.setAttribute('aria-expanded', 'false'); }), { signal });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') $$('.room.open').forEach(room => { room.classList.remove('open'); room.setAttribute('aria-expanded', 'false'); }); }, { signal });
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

// ---- bannière de promotion ------------------------------------------------
// Réglée par Christophe dans l'admin ; l'API ne la renvoie que pendant ses dates.
// Placée hors de #app pour survivre aux changements de langue (re-mount).
let promo = null;
const PROMO_DISMISSED = 'promo-dismissed';
const promoDismissed = (id) => { try { return localStorage.getItem(PROMO_DISMISSED) === id; } catch { return false; } };

function renderPromo() {
  const existing = document.querySelector('#promo-banner');
  if (!promo || promoDismissed(promo.id)) { existing?.remove(); return; }
  const t = promo[lang];
  const banner = existing || document.createElement('aside');
  banner.id = 'promo-banner';
  banner.className = 'promo-banner';
  banner.setAttribute('aria-label', lang === 'en' ? 'Special offer' : 'Offre du moment');
  banner.innerHTML = `<div class="promo-inner">
      <p class="promo-text"><span class="promo-spark" aria-hidden="true"></span>${escapeHtml(t.text)}</p>
      ${promo.showButton ? `<button type="button" class="promo-cta">${escapeHtml(t.cta)} ${icon('arrow', 14)}</button>` : ''}
    </div>
    <button type="button" class="promo-close" aria-label="${lang === 'en' ? 'Close' : 'Fermer'}">${icon('close', 14)}</button>`;
  banner.querySelector('.promo-cta')?.addEventListener('click', () => document.querySelector('#reserve')?.click());
  banner.querySelector('.promo-close').addEventListener('click', () => {
    try { localStorage.setItem(PROMO_DISMISSED, promo.id); } catch { /* navigation privée */ }
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 400);
  });
  if (!existing) {
    document.body.prepend(banner);
    requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('show')));
  }
}
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

fetch('/api/promo')
  .then((response) => (response.ok ? response.json() : null))
  .then((data) => { promo = data?.promo || null; renderPromo(); })
  .catch(() => {});

// ---- parallaxe de la photo au-dessus du pied de page ----------------------
// La photo est plus haute que son cadre (style.css) et glisse plus lentement que la page.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let parallaxTicking = false;
  const updateParallax = () => {
    parallaxTicking = false;
    const section = document.querySelector('.final-cta');
    const image = section?.querySelector('.final-image');
    if (!image) return;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    // -1 quand la section entre par le bas, +1 quand elle sort par le haut.
    const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / (window.innerHeight / 2 + rect.height / 2);
    // Elle n'entre que par le bas (le pied de page suit) : déplacement surtout vers le haut, d'où l'image allongée en bas.
    image.style.setProperty('--parallax', `${(Math.max(-1, Math.min(0.35, progress)) * rect.height * 0.26).toFixed(1)}px`);
  };
  const requestParallax = () => { if (!parallaxTicking) { parallaxTicking = true; requestAnimationFrame(updateParallax); } };
  window.addEventListener('scroll', requestParallax, { passive: true });
  window.addEventListener('resize', requestParallax);
  requestParallax();
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
