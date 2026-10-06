// Gabarit de la fenêtre de réservation : fonction pure, partagée par l'accueil (HTML généré
// au build) et le guide (insérée au premier clic sur « Réserver »).
import { icon } from './icons.js';

export const reserveModalHtml = (t, guestCount = 2) => `
  <div class="modal-backdrop" id="reserve-modal" hidden>
    <div class="modal-card reserve-card" role="dialog" aria-modal="true" aria-labelledby="reserve-modal-title">
      <div class="modal-head"><h3 id="reserve-modal-title">${t.reserveModal.title}</h3><button class="modal-close" id="reserve-modal-close" aria-label="${t.amenitiesSection.closeAria}">${icon('close', 18)}</button></div>
      <form class="reserve-form" id="reserve-form" novalidate>
        <p class="reserve-form-intro">${t.reserveModal.intro}</p>
        <div class="reserve-form-row reserve-form-row-name">
          <label>${t.reserveModal.name}<input type="text" id="rf-name" name="name" required maxlength="80" autocomplete="name" placeholder="${t.reserveModal.namePlaceholder}" /></label>
          <label>${t.reserveModal.guests}<input type="number" id="rf-guests" name="guests" min="1" max="8" value="${guestCount}" required /></label>
        </div>
        <div class="reserve-form-row">
          <label>${t.reserveModal.email}<input type="email" id="rf-email" name="email" required maxlength="254" autocomplete="email" inputmode="email" placeholder="${t.reserveModal.emailPlaceholder}" /></label>
          <label>${t.reserveModal.phone}<input type="tel" id="rf-phone" name="phone" maxlength="30" autocomplete="tel" placeholder="${t.reserveModal.phonePlaceholder}" /></label>
        </div>
        <div class="reserve-form-row">
          <div class="rf-date-field"><span class="rf-date-label" id="rf-arrival-label">${t.reserveModal.arrival}</span><button type="button" class="rf-date" id="rf-arrival-btn" data-picker="arrival" aria-labelledby="rf-arrival-label rf-arrival-btn">${t.reserveModal.picker.choose}</button></div>
          <div class="rf-date-field"><span class="rf-date-label" id="rf-departure-label">${t.reserveModal.departure}</span><button type="button" class="rf-date" id="rf-departure-btn" data-picker="departure" aria-labelledby="rf-departure-label rf-departure-btn">${t.reserveModal.picker.choose}</button></div>
          <input type="hidden" id="rf-arrival" name="arrival" /><input type="hidden" id="rf-departure" name="departure" />
        </div>
        <label>${t.reserveModal.message}<textarea id="rf-message" name="message" rows="2" maxlength="1000" placeholder="${t.reserveModal.messagePlaceholder}"></textarea></label>
        <label class="rf-trap" aria-hidden="true">Website<input type="text" id="rf-website" name="website" tabindex="-1" autocomplete="off" /></label>
        <div class="rf-estimate" id="rf-estimate" aria-live="polite" hidden>
          <div class="rf-estimate-stay"><strong id="rf-est-nights"></strong><span id="rf-est-detail"></span></div>
          <div class="rf-estimate-total"><span>${t.reserveModal.estimate.total}</span><strong id="rf-est-total"></strong></div>
        </div>
        <p class="reserve-form-error" id="rf-error" role="alert" hidden></p>
        <button type="submit" class="reserve-button">${t.reserveModal.submit} ${icon('arrow', 16)}</button>
        <button type="button" class="reserve-whatsapp" id="rf-whatsapp">${t.reserveModal.whatsapp}</button>
      </form>
      <div class="rf-picker" id="rf-picker" role="dialog" aria-modal="true" aria-labelledby="rf-picker-title" hidden>
        <div class="rf-picker-head">
          <div><strong id="rf-picker-title">${t.reserveModal.picker.title}</strong><p id="rf-picker-hint">${t.reserveModal.picker.subtitle}</p></div>
          <div class="rf-picker-fields">
            <div class="rf-pf" id="rf-pf-arrival"><span>${t.reserveModal.arrival}</span><strong id="rf-pf-arrival-val">${t.reserveModal.picker.choose}</strong></div>
            <div class="rf-pf" id="rf-pf-departure"><span>${t.reserveModal.departure}</span><strong id="rf-pf-departure-val">${t.reserveModal.picker.choose}</strong></div>
          </div>
        </div>
        <div class="rf-picker-body">
          <button type="button" class="rf-picker-nav prev" id="rf-picker-prev" aria-label="${t.reserveModal.picker.prev}">‹</button>
          <button type="button" class="rf-picker-nav next" id="rf-picker-next" aria-label="${t.reserveModal.picker.next}">›</button>
          <div class="rf-picker-months" id="rf-picker-months"></div>
        </div>
        <div class="rf-picker-foot"><button type="button" class="rf-picker-clear" id="rf-picker-clear">${t.reserveModal.picker.clear}</button><button type="button" class="rf-picker-done" id="rf-picker-done">${t.reserveModal.picker.done}</button></div>
      </div>
      <div class="reserve-success" id="reserve-success" hidden>
        <p class="reserve-success-mark">${icon('check', 22)}</p>
        <h4>${t.reserveModal.successTitle}</h4>
        <p>${t.reserveModal.successText}</p>
        <button type="button" class="reserve-button" id="reserve-success-close">${t.reserveModal.successClose}</button>
      </div>
    </div>
  </div>
`;
