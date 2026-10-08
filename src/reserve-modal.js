// Fenêtre de réservation : la demande est enregistrée sur le site, WhatsApp reste une alternative.
// Partagée par l'accueil et le guide ; le HTML vient de reserve-modal-html.js.
import { availability, isoOf, isNightBlocked, onAvailability, rangeCrossesBookedDate } from './availability.js';
import { applyOffer, estimateStay } from './pricing.js';
import { promoReady } from './promo-data.js';
import { WHATSAPP_NUMBER } from './whatsapp-widget.js';
import { lastCtaId, track } from './track.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

// t : textes de la langue ; getInitial : dates et voyageurs déjà choisis ailleurs sur la page ;
// onPick : dates validées dans le calendrier de la fenêtre ; signal : arrête l'écoute du clavier.
export function setupReserveModal({ t, lang, getInitial = () => ({ dates: null, guests: 2 }), onPick = () => {}, signal }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const formatShort = (iso) => {
    const [, m, d] = iso.split('-').map(Number);
    return t.formatShort(d, t.monthNames[m - 1].slice(0, 3));
  };
  const formatFull = (iso) => {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-').map(Number);
    return t.formatFull(d, t.monthNames[m - 1], y);
  };

  const reserveModal = $('#reserve-modal');
  const e = t.reserveModal.estimate;
  const money = (n) => new Intl.NumberFormat(e.locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  // Prix promo saisis dans l'admin : le prix de la grille apparaît barré à côté.
  let offers = [];
  const estimate = (arrival, departure) => applyOffer(estimateStay(arrival, departure), arrival, departure, offers);
  const totalHtml = (result) => (result.offer ? `<s>${money(result.regular)}</s> ${money(result.total)}` : money(result.total));
  // Récapitulatif du prix, comme à la fin d'un achat de billet : apparaît dès que les dates sont valides.
  const updateEstimate = () => {
    const box = $('#rf-estimate');
    const result = estimate($('#rf-arrival').value, $('#rf-departure').value);
    if (!result) { box.hidden = true; return; }
    $('#rf-est-nights').textContent = e.night(result.nights);
    box.classList.toggle('is-offer', Boolean(result.offer));
    if (result.total === null) {
      $('#rf-est-detail').textContent = e.oneNight;
      $('#rf-est-total').textContent = '—';
    } else if (result.offer) {
      $('#rf-est-detail').textContent = e.offer;
      $('#rf-est-total').innerHTML = totalHtml(result);
    } else {
      const season = result.seasons.length > 1 ? e.seasons.both : e.seasons[result.seasons[0]];
      const exact = result.perNight * result.nights === result.total;
      $('#rf-est-detail').textContent = `${season} · ${exact ? '' : e.approx}${money(result.perNight)} / ${e.perNight}`;
      $('#rf-est-total').textContent = money(result.total);
    }
    box.hidden = false;
  };
  promoReady.then((promo) => { offers = promo?.offers || []; updateEstimate(); });
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
    $('#rf-picker-months').innerHTML = availability.loaded
      ? monthHtml(pickYear, pickMonth) + monthHtml(...second)
      : `<p class="rf-picker-loading">${pk.loading}</p>`;
    // En-tête : cases Arrivée / Départ (celle en cours de saisie est entourée) et récapitulatif.
    $('#rf-pf-arrival-val').textContent = pick[0] ? formatShort(pick[0]) : pk.choose;
    $('#rf-pf-departure-val').textContent = pick[1] ? formatShort(pick[1]) : pk.choose;
    $('#rf-pf-arrival').classList.toggle('active', pick.length !== 1);
    $('#rf-pf-departure').classList.toggle('active', pick.length === 1);
    $('#rf-pf-arrival').classList.toggle('filled', Boolean(pick[0]));
    $('#rf-pf-departure').classList.toggle('filled', Boolean(pick[1]));
    const result = pick.length === 2 ? estimate(pick[0], pick[1]) : null;
    $('#rf-picker-hint').innerHTML = result
      ? `${e.night(result.nights)} · ${result.total === null ? e.oneNight : `${totalHtml(result)}${result.offer ? ` · ${e.offer}` : ''}`}`
      : pick.length === 1 ? pk.departure : pk.subtitle;
    $$('#rf-picker-months .rf-day:not([disabled])').forEach(button => button.addEventListener('click', () => {
      const iso = button.dataset.date;
      if (pick.length !== 1 || iso <= pick[0]) pick = [iso];
      else pick = [pick[0], iso];
      renderPicker();
    }));
  };
  // Calendrier ouvert pendant le chargement : il se remplit dès que les disponibilités arrivent.
  const stopListening = onAvailability(() => { if (!picker.hidden) renderPicker(); });
  signal?.addEventListener('abort', stopListening);
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
      onPick([...pick]);
      trackDates();
    }
    picker.hidden = true;
    picker.closest('.reserve-card').classList.remove('picking');
  };
  $$('[data-picker]').forEach(button => button.addEventListener('click', () => openPicker(button.dataset.picker)));
  $('#rf-picker-done').addEventListener('click', () => closePicker(true));
  $('#rf-picker-clear').addEventListener('click', () => { pick = []; renderPicker(); });
  $('#rf-picker-prev').addEventListener('click', () => { pickMonth--; if (pickMonth < 0) { pickMonth = 11; pickYear--; } renderPicker(); });
  $('#rf-picker-next').addEventListener('click', () => { pickMonth++; if (pickMonth > 11) { pickMonth = 0; pickYear++; } renderPicker(); });

  const setReserveError = (message) => { $('#rf-error').textContent = message; $('#rf-error').hidden = !message; };
  // Tableau de bord : une fenêtre ouverte, puis des dates choisies (au plus une fois par ouverture).
  let datesTracked = false;
  function trackDates() {
    if (datesTracked) return;
    datesTracked = true;
    track({ type: 'step', step: 'dates' });
  }
  // Le focus revient sur le bouton qui a ouvert la fenêtre.
  let opener = null;
  const open = () => {
    opener = document.activeElement;
    datesTracked = false;
    track({ type: 'step', step: 'open' });
    const { dates, guests } = getInitial();
    if (dates?.length === 2) { setDates(dates[0], dates[1]); trackDates(); } else setDates('', '');
    picker.hidden = true;
    picker.closest('.reserve-card').classList.remove('picking');
    $('#rf-guests').value = guests;
    $('#reserve-form').hidden = false;
    $('#reserve-success').hidden = true;
    setReserveError('');
    reserveModal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#rf-name').focus();
  };
  const close = () => {
    reserveModal.hidden = true;
    document.body.style.overflow = '';
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  };
  // The message field starts small so the pop-in fits short screens, then grows with the text.
  $('#rf-message').addEventListener('input', (event) => {
    const field = event.target;
    field.style.height = '';
    field.style.height = `${Math.min(field.scrollHeight + 2, 140)}px`;
  });
  $('#reserve-modal-close').addEventListener('click', close);
  reserveModal.addEventListener('click', (event) => { if (event.target === reserveModal) close(); });
  // Échap ferme d'abord le calendrier, puis la fenêtre.
  document.addEventListener('keydown', (event) => { if (event.key !== 'Escape' || reserveModal.hidden) return; if (!picker.hidden) closePicker(false); else close(); }, { signal });

  const readReserveForm = () => ({
    name: $('#rf-name').value.trim(),
    email: $('#rf-email').value.trim(),
    phone: $('#rf-phone').value.trim(),
    arrival: $('#rf-arrival').value,
    departure: $('#rf-departure').value,
    guests: Number($('#rf-guests').value),
    message: $('#rf-message').value.trim(),
    website: $('#rf-website').value,
    cta: lastCtaId(),
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
    const form = $('#reserve-form');
    // Envoi visible (bouton qui tourne) et jamais infini : au-delà de 20 s, on abandonne avec un message.
    button.disabled = true;
    button.classList.add('is-sending');
    button.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span>${t.reserveModal.sending}`;
    form.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    let error = '';
    try {
      const response = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: controller.signal });
      if (!response.ok) error = (await response.json().catch(() => ({}))).error || 'server_error';
    } catch { error = 'network'; }
    clearTimeout(timeout);
    form.removeAttribute('aria-busy');
    button.disabled = false;
    button.classList.remove('is-sending');
    button.innerHTML = label;
    if (error) return setReserveError(t.reserveModal.errors[error] || t.reserveModal.errors.server_error);
    $('#reserve-form').reset();
    setDates('', '');
    $('#reserve-form').hidden = true;
    $('#reserve-success').hidden = false;
    $('#reserve-success-close').focus();
  });
  $('#reserve-success-close').addEventListener('click', close);

  $('#rf-whatsapp').addEventListener('click', () => {
    const data = readReserveForm();
    let message = t.whatsapp(data.name || '—', formatFull(data.arrival), formatFull(data.departure), data.guests || 1);
    if (data.message) message += ` ${data.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  return { open, close };
}
