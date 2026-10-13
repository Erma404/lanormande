// Onglet Tarifs : prix de la grille (par durée et par saison) et mois de chaque saison.
// Même calcul que le site (src/pricing.js) : la simulation montre exactement ce que verra le voyageur.
import { cleanGrid, estimateStay, MAX_RATE, RATE_KEYS, RATE_NIGHTS, SEASONS } from '../pricing.js';

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const SEASON_NAMES = { basse: 'Basse saison', haute: 'Haute saison' };
const LABELS = {
  weekend2: ['Week-end · 2 nuits', 'prix du séjour'],
  weekend3: ['Week-end · 3 nuits', 'prix du séjour'],
  short: ['4 à 6 nuits', 'prix par nuit'],
  week: ['Semaine · 7 nuits', 'prix du séjour'],
  long: ['Plus de 7 nuits', 'prix par nuit']
};

const errors = {
  invalid_price: `Chaque prix doit être un nombre entier entre 1 et ${MAX_RATE.toLocaleString('fr-FR')} €.`,
  invalid_seasons: 'Chaque saison doit compter au moins un mois.',
  unauthenticated: 'Votre session a expiré. Rechargez la page pour vous reconnecter.'
};

export function renderPricing(container, { escape, onDirtyChange }) {
  let saved = null;

  async function call(body) {
    const response = await fetch('/api/admin/content', {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify({ pricing: body }) : undefined,
      credentials: 'same-origin'
    }).catch(() => null);
    if (!response) return { error: 'Connexion impossible. Vérifiez votre réseau.' };
    const json = await response.json().catch(() => ({}));
    if (!response.ok) return { error: errors[json.error] || 'L’enregistrement a échoué. Réessayez.' };
    saved = json.pricing;
    return {};
  }

  const listMonths = (months) => months.map((m) => MONTHS[m - 1].toLowerCase()).join(', ');

  function render(message = '', justSaved = false) {
    container.innerHTML = `
      ${message ? `<p class="form-error panel-error" role="alert">${escape(message)}</p>` : ''}
      <form id="pricing-form" class="promo-form" novalidate>
        <section class="panel">
          <h2>Prix</h2>
          <p class="muted small-text">Les week-ends et la semaine se saisissent en prix du séjour ; les autres durées en prix par nuit. Un séjour d’une seule nuit reste « sur demande ».</p>
          <div class="pricing-grid" role="table" aria-label="Grille tarifaire">
            <div class="pricing-grid-row pricing-grid-head" role="row"><span role="columnheader">Durée</span>${SEASONS.map((s) => `<span role="columnheader">${SEASON_NAMES[s]}</span>`).join('')}</div>
            ${RATE_KEYS.map((key) => `
            <div class="pricing-grid-row" role="row">
              <span class="pricing-grid-label" role="rowheader"><strong>${LABELS[key][0]}</strong><small>${LABELS[key][1]}</small></span>
              ${SEASONS.map((season) => `
              <span class="pricing-grid-cell" role="cell">
                <span class="amount-field"><input type="number" inputmode="numeric" min="1" max="${MAX_RATE}" step="1" data-season="${season}" data-key="${key}" value="${saved.rates[season][key]}" aria-label="${LABELS[key][0]}, ${SEASON_NAMES[season].toLowerCase()} (${LABELS[key][1]})" /><span>€</span></span>
                <small class="pricing-grid-hint" data-hint="${season}-${key}"></small>
              </span>`).join('')}
            </div>`).join('')}
          </div>
        </section>

        <section class="panel">
          <h2>Saisons</h2>
          <p class="muted small-text">Touchez un mois pour le faire passer d’une saison à l’autre. Un séjour à cheval sur deux saisons est compté nuit par nuit.</p>
          <div class="season-months" id="season-months">
            ${MONTHS.map((name, i) => `<button type="button" class="season-month" data-month="${i + 1}" aria-pressed="${saved.lowMonths.includes(i + 1)}"><span>${name}</span><small></small></button>`).join('')}
          </div>
          <p class="muted small-text" id="season-summary"></p>
        </section>

        <section class="panel">
          <h2>Simuler un séjour</h2>
          <p class="muted small-text">Le prix que verra un voyageur pour ces dates, avec les prix ci-dessus (même s’ils ne sont pas encore enregistrés). Les prix promo de l’onglet Promotion passent avant, pour leurs dates exactes.</p>
          <div class="promo-dates">
            <div><label for="sim-arrival">Arrivée</label><input id="sim-arrival" type="date" /></div>
            <div><label for="sim-departure">Départ</label><input id="sim-departure" type="date" /></div>
          </div>
          <p class="pricing-sim" id="pricing-sim" aria-live="polite"></p>
        </section>

        <div class="promo-save">
          <button type="submit" class="primary small" id="pricing-save">Enregistrer</button>
          ${justSaved ? '<span class="saved-note" role="status">Enregistré. Le site affiche les nouveaux prix sous une minute ; les demandes déjà reçues gardent leur prix.</span>' : ''}
        </div>
      </form>`;

    const $ = (selector) => container.querySelector(selector);
    const read = () => ({
      lowMonths: [...container.querySelectorAll('.season-month')].filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => Number(b.dataset.month)),
      rates: Object.fromEntries(SEASONS.map((season) => [season, Object.fromEntries(RATE_KEYS.map((key) => [key, container.querySelector(`[data-season="${season}"][data-key="${key}"]`).value]))]))
    });

    const refresh = () => {
      const values = read();
      for (const season of SEASONS) for (const key of RATE_KEYS) {
        const value = Number(values.rates[season][key]);
        const nights = RATE_NIGHTS[key];
        const hint = $(`[data-hint="${season}-${key}"]`);
        // Prix du séjour : on rappelle le prix par nuit ; prix par nuit : un exemple de séjour (le plus court de la tranche).
        const example = key === 'short' ? 4 : 8;
        hint.textContent = !(value >= 1) ? 'Prix manquant'
          : nights ? `soit ${Number.isInteger(value / nights) ? '' : '≈ '}${euro.format(Math.round(value / nights))} / nuit`
          : `ex. ${example} nuits = ${euro.format(value * example)}`;
        hint.classList.toggle('error', !(value >= 1));
      }
      container.querySelectorAll('.season-month').forEach((button) => {
        const low = button.getAttribute('aria-pressed') === 'true';
        button.classList.toggle('low', low);
        button.querySelector('small').textContent = low ? 'Basse' : 'Haute';
      });
      const high = Array.from({ length: 12 }, (_, i) => i + 1).filter((m) => !values.lowMonths.includes(m));
      $('#season-summary').textContent = `Basse saison : ${listMonths(values.lowMonths) || 'aucun mois'}. Haute saison : ${listMonths(high) || 'aucun mois'}.`;

      const grid = cleanGrid(values);
      const arrival = $('#sim-arrival').value;
      const departure = $('#sim-departure').value;
      const result = grid && estimateStay(arrival, departure, grid);
      const sim = $('#pricing-sim');
      if (!grid) sim.textContent = 'Complétez la grille pour simuler un séjour.';
      else if (!arrival || !departure) sim.textContent = 'Choisissez une arrivée et un départ.';
      else if (!result) sim.textContent = 'Le départ doit être après l’arrivée.';
      else if (result.total === null) sim.textContent = '1 nuit : tarif sur demande.';
      else sim.innerHTML = `${result.nights} nuits · ${result.seasons.length > 1 ? 'basse et haute saison' : SEASON_NAMES[result.seasons[0]].toLowerCase()} · <strong>${euro.format(result.total)}</strong> <span class="muted">(${result.perNight * result.nights === result.total ? '' : '≈ '}${euro.format(result.perNight)} / nuit)</span>`;
    };
    refresh();

    const markDirty = () => onDirtyChange(JSON.stringify(cleanGrid(read())) !== JSON.stringify(cleanGrid(saved)));
    $('#season-months').addEventListener('click', (event) => {
      const button = event.target.closest('.season-month');
      if (!button) return;
      button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
      refresh();
      markDirty();
    });
    $('#pricing-form').addEventListener('input', (event) => {
      if (event.target.id === 'sim-arrival') $('#sim-departure').min = event.target.value;
      refresh();
      if (event.target.dataset.key) markDirty();
    });
    $('#pricing-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const values = read();
      const showError = (text) => {
        container.querySelector('.panel-error')?.remove();
        container.insertAdjacentHTML('afterbegin', `<p class="form-error panel-error" role="alert">${escape(text)}</p>`);
        container.scrollIntoView({ behavior: 'smooth' });
      };
      if (!values.lowMonths.length || values.lowMonths.length === 12) return showError(errors.invalid_seasons);
      if (!cleanGrid(values) || SEASONS.some((s) => RATE_KEYS.some((k) => !/^\d+$/.test(values.rates[s][k])))) return showError(errors.invalid_price);
      const button = $('#pricing-save');
      button.disabled = true;
      button.classList.add('loading');
      const result = await call(values);
      if (!result.error) onDirtyChange(false);
      render(result.error, !result.error);
    });
  }

  container.innerHTML = `<div class="panels" aria-busy="true" aria-label="Chargement des tarifs">${'<div class="panel"><span class="skel skel-h"></span><span class="skel skel-line"></span><span class="skel skel-input"></span></div>'.repeat(2)}</div>`;
  call().then((result) => {
    if (result.error) container.innerHTML = `<p class="form-error">${escape(result.error)}</p>`;
    else render();
  });
}
