// Onglet Tableau de bord : chiffre d'affaires et occupation (par année), fréquentation et boutons (par période).
// Les données brutes viennent de /api/journal ; tous les indicateurs sont calculés ici.

const COMMISSION_RATE = 0.15; // frais qu'Airbnb aurait prélevés sur une réservation directe (estimation)
const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('fr-FR');
const percent = (value, digits = 0) => `${(value * 100).toLocaleString('fr-FR', { maximumFractionDigits: digits, minimumFractionDigits: digits })} %`;
const monthNames = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const monthLong = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const dayFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });

const PERIODS = [['7', '7 jours'], ['30', '30 jours'], ['90', '90 jours'], ['365', '12 mois']];

const CTA_LABELS = {
  header: ['« Je réserve »', 'En-tête de l’accueil'],
  'hero-card': ['« Réserver »', 'Carte calendrier, haut de l’accueil'],
  host: ['« Réserver maintenant »', 'Sous le mot de Christophe'],
  pricing: ['« Vérifier mes dates »', 'Section Tarifs'],
  final: ['« Je réserve »', 'Bas de l’accueil'],
  promo: ['Bouton de la bannière', 'Promotion'],
  'home-guide': ['« Préparer votre séjour »', 'Accueil, vers le guide'],
  'guide-header': ['« Je réserve »', 'En-tête du guide'],
  'guide-bottom': ['« Réserver mon séjour »', 'Bas du guide'],
  'addresses-header': ['« Je réserve »', 'En-tête des Bonnes adresses'],
  'whatsapp-bubble': ['Bulle WhatsApp', 'Toutes les pages'],
  'modal-whatsapp': ['WhatsApp', 'Dans la fenêtre de réservation']
};
// Boutons qui ouvrent la fenêtre de réservation (les autres mènent ailleurs : guide, WhatsApp).
const BOOKING_CTAS = ['header', 'hero-card', 'host', 'pricing', 'final', 'promo', 'guide-header', 'guide-bottom', 'addresses-header'];

const SOURCE_LABELS = { direct: 'Accès direct', google: 'Google', bing: 'Autres moteurs', ai: 'Assistants IA', airbnb: 'Airbnb', social: 'Réseaux sociaux', whatsapp: 'WhatsApp', email: 'Email', qr: 'QR code de la maison', other: 'Autres sites' };
const PAGE_LABELS = { '/': 'Accueil (FR)', '/en': 'Accueil (EN)', '/normandie-pays-d-auge': 'Guide (FR)', '/en/normandy-guide': 'Guide (EN)', '/bonnes-adresses': 'Bonnes adresses (FR)', '/en/local-favourites': 'Bonnes adresses (EN)', other: 'Autres pages' };

// ---- dates ------------------------------------------------------------------
const iso = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const parse = (value) => new Date(`${value}T00:00:00`);
const addDays = (value, days) => { const date = parse(value); date.setDate(date.getDate() + days); return iso(date); };
const nightsBetween = (start, end) => Math.round((parse(end) - parse(start)) / 86400000);
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
function* eachNight(start, end) { for (let night = start; night < end; night = addDays(night, 1)) yield night; }

// ---- calculs ------------------------------------------------------------------
const valueOf = (request) => request.amount ?? request.estimate ?? 0;

// Ventile chaque séjour nuit par nuit sur les mois (comptabilité à l'avancement) et calcule l'occupation.
function finance(data, year) {
  const months = Array.from({ length: 12 }, (_, month) => ({ month, site: 0, siteEstimated: 0, siteNights: 0, airbnbNights: 0, airbnb: data.airbnbRevenue[`${year}-${String(month + 1).padStart(2, '0')}`] ?? null }));
  const siteNights = new Set();
  const accepted = data.requests.filter((request) => request.status === 'accepted');
  for (const request of accepted) {
    const nights = nightsBetween(request.arrival, request.departure);
    const perNight = valueOf(request) / nights;
    for (const night of eachNight(request.arrival, request.departure)) {
      siteNights.add(night);
      if (Number(night.slice(0, 4)) !== year) continue;
      const row = months[Number(night.slice(5, 7)) - 1];
      row.site += perNight;
      if (request.amount == null) row.siteEstimated += perNight;
      row.siteNights += 1;
    }
  }
  // Nuits Airbnb : réservations du calendrier Airbnb qui ne sont pas déjà des réservations du site.
  for (const [start, end, kind] of data.airbnb.ranges) {
    if (kind === 'blocked') continue;
    for (const night of eachNight(start, end)) {
      if (siteNights.has(night) || Number(night.slice(0, 4)) !== year) continue;
      months[Number(night.slice(5, 7)) - 1].airbnbNights += 1;
    }
  }
  months.forEach((row) => { row.occupancy = (row.siteNights + row.airbnbNights) / daysInMonth(year, row.month); });

  const sum = (key) => months.reduce((total, row) => total + (row[key] || 0), 0);
  const inYear = accepted.filter((request) => request.arrival.startsWith(String(year)));
  const stayNights = inYear.reduce((total, request) => total + nightsBetween(request.arrival, request.departure), 0);
  const today = iso(new Date());
  const pending = data.requests.filter((request) => request.status === 'new' && request.departure > today);
  const decided = data.requests.filter((request) => request.status !== 'new' && new Date(request.createdAt).getFullYear() === year);
  const daysOfYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
  return {
    months,
    site: sum('site'),
    siteEstimated: sum('siteEstimated'),
    airbnb: sum('airbnb'),
    airbnbMissing: months.filter((row) => row.airbnb === null && row.airbnbNights > 0).length,
    siteNights: sum('siteNights'),
    airbnbNights: sum('airbnbNights'),
    occupancy: (sum('siteNights') + sum('airbnbNights')) / daysOfYear,
    averageNight: sum('siteNights') ? sum('site') / sum('siteNights') : null,
    averageStay: inYear.length ? stayNights / inYear.length : null,
    averageBasket: inYear.length ? inYear.reduce((total, request) => total + valueOf(request), 0) / inYear.length : null,
    pendingCount: pending.length,
    pendingValue: pending.reduce((total, request) => total + (request.estimate || 0), 0),
    acceptance: decided.length ? decided.filter((request) => request.status === 'accepted').length / decided.length : null,
    decided: decided.length
  };
}

function traffic(data, from, to) {
  const totals = {};
  for (const { counts } of data.traffic.days) for (const [field, value] of Object.entries(counts)) totals[field] = (totals[field] || 0) + value;
  const previous = data.traffic.previousTotals;
  const inPeriod = (time) => { const day = iso(new Date(time)); return day >= from && day <= to; };
  const requests = data.requests.filter((request) => inPeriod(request.createdAt));
  const previousRequests = data.requests.filter((request) => { const day = iso(new Date(request.createdAt)); return day >= data.traffic.previousFrom && day <= data.traffic.previousTo; });
  const group = (prefix) => Object.entries(totals).filter(([field]) => field.startsWith(prefix)).map(([field, value]) => [field.slice(prefix.length), value]).sort((a, b) => b[1] - a[1]);
  const firstDay = data.traffic.days.find(({ counts }) => counts.pv)?.date || null;
  return { totals, previous, requests, previousRequests, group, firstDay };
}

// ---- éléments graphiques ------------------------------------------------------
const delta = (current, before) => {
  if (!before) return '';
  const change = (current - before) / before;
  const sign = change > 0 ? '+' : change < 0 ? '−' : '';
  return `<span class="kpi-delta ${change > 0 ? 'up' : change < 0 ? 'down' : ''}" title="Par rapport à la période précédente">${sign}${percent(Math.abs(change))}</span>`;
};

const tile = (label, value, note = '', extra = '') => `
  <div class="kpi"><p class="kpi-label">${label}</p><p class="kpi-value">${value}${extra}</p>${note ? `<p class="kpi-note">${note}</p>` : ''}</div>`;

// Échelle « ronde » pour les graduations.
function niceMax(value) {
  if (value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  return [1, 2, 2.5, 5, 10].map((step) => step * power).find((candidate) => candidate >= value);
}

// Histogramme vertical, empilé si plusieurs séries ; une info-bulle par colonne.
function columns({ id, rows, series, format, label, max: forcedMax, dense = false }) {
  const totals = rows.map((row) => series.reduce((total, serie) => total + (row.values[serie.key] || 0), 0));
  const max = forcedMax || niceMax(Math.max(...totals, 0));
  const ticks = [max, max / 2, 0];
  return `
    <div class="chart ${dense ? 'dense' : ''}" id="${id}">
      <div class="chart-axis" aria-hidden="true">${ticks.map((tick) => `<span>${format(tick, true)}</span>`).join('')}</div>
      <div class="chart-plot" role="list" aria-label="${label}">
        ${ticks.map((_, i) => `<i class="gridline" style="bottom:${100 - i * 50}%"></i>`).join('')}
        ${rows.map((row, i) => {
          const tip = `<strong>${row.long || row.label}</strong>${series.map((serie) => `<span><i style="background:${serie.color}"></i>${serie.label}<b>${format(row.values[serie.key] || 0)}</b></span>`).join('')}${series.length > 1 ? `<span class="tip-total">Total<b>${format(totals[i])}</b></span>` : ''}`;
          const stack = series.filter((serie) => row.values[serie.key] > 0)
            .map((serie) => `<span class="seg" style="height:${(row.values[serie.key] / max) * 100}%;background:${serie.color}"></span>`).join('');
          return `<div class="col" role="listitem" tabindex="0" aria-label="${row.long || row.label} : ${series.map((serie) => `${serie.label} ${format(row.values[serie.key] || 0)}`).join(', ')}"><div class="stack">${stack}</div><div class="tip" role="tooltip">${tip}</div></div>`;
        }).join('')}
      </div>
      <div class="chart-labels" aria-hidden="true">${rows.map((row, i) => `<span>${!dense || i % Math.ceil(rows.length / 7) === 0 ? row.label : ''}</span>`).join('')}</div>
    </div>`;
}

const legend = (series) => `<div class="legend">${series.map((serie) => `<span><i style="background:${serie.color}"></i>${serie.label}</span>`).join('')}</div>`;

// Barres horizontales classées (sources, pages…).
function ranking(items, total, labels) {
  if (!items.length) return '<p class="dash-empty">Pas encore de données sur cette période.</p>';
  const max = items[0][1];
  return `<ul class="ranking">${items.map(([key, value]) => `
    <li><span class="rank-label">${labels[key] || key}</span><span class="rank-bar"><i style="width:${(value / max) * 100}%"></i></span><span class="rank-value">${number.format(value)}<small>${total ? percent(value / total) : ''}</small></span></li>`).join('')}</ul>`;
}

// ---- rendu ------------------------------------------------------------------
export function renderDashboard(container, { escape }) {
  const now = new Date();
  const state = { period: '30', year: now.getFullYear(), data: null, error: '' };

  const range = () => {
    const to = iso(now);
    return { from: addDays(to, -(Number(state.period) - 1)), to };
  };

  async function load() {
    const { from, to } = range();
    const response = await fetch(`/api/journal?from=${from}&to=${to}`, { credentials: 'same-origin' }).catch(() => null);
    if (!response) return 'Connexion impossible. Vérifiez votre réseau.';
    if (response.status === 401) return 'Votre session a expiré. Rechargez la page pour vous reconnecter.';
    if (!response.ok) return 'Le tableau de bord n’a pas pu être chargé. Réessayez.';
    state.data = await response.json();
    return '';
  }

  async function saveAirbnb(month, value) {
    const response = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action: 'setAirbnbRevenue', month, amount: value === '' ? null : Number(value) })
    }).catch(() => null);
    if (!response?.ok) return false;
    state.data.airbnbRevenue = (await response.json()).airbnbRevenue;
    return true;
  }

  function financeSection() {
    const f = finance(state.data, state.year);
    const years = new Set([now.getFullYear(), now.getFullYear() + 1]);
    state.data.requests.forEach((request) => years.add(Number(request.arrival.slice(0, 4))));
    Object.keys(state.data.airbnbRevenue).forEach((month) => years.add(Number(month.slice(0, 4))));
    const SITE = { key: 'site', label: 'Site (réservation directe)', color: '#2f7a4f' };
    const AIRBNB = { key: 'airbnb', label: 'Airbnb', color: '#c9824f' };
    const revenueRows = f.months.map((row) => ({ label: monthNames[row.month], long: `${monthLong[row.month]} ${state.year}`, values: { site: row.site, airbnb: row.airbnb || 0 } }));
    const occupancyRows = f.months.map((row) => {
      const days = daysInMonth(state.year, row.month);
      return { label: monthNames[row.month], long: `${monthLong[row.month]} ${state.year} (${days} nuits)`, values: { site: row.siteNights / days, airbnb: row.airbnbNights / days } };
    });
    const total = f.site + f.airbnb;

    return `
      <section class="dash-section" aria-labelledby="dash-finance">
        <header class="dash-section-head">
          <div><h2 id="dash-finance">Chiffre d’affaires et occupation</h2><p class="hint">Chaque séjour est réparti nuit par nuit sur les mois où il a lieu.</p></div>
          <label class="year-select">Année <select id="dash-year">${[...years].sort().map((year) => `<option ${year === state.year ? 'selected' : ''}>${year}</option>`).join('')}</select></label>
        </header>
        <div class="kpis">
          ${tile('CA total', euros.format(total), f.airbnbMissing ? `CA Airbnb à saisir pour ${f.airbnbMissing} mois` : 'Site + Airbnb')}
          ${tile('CA du site', euros.format(f.site), f.siteEstimated ? `dont ${euros.format(f.siteEstimated)} estimés d’après la grille` : 'Montants réels encaissés')}
          ${tile('CA Airbnb', euros.format(f.airbnb), 'Saisi mois par mois, plus bas')}
          ${tile('Commission Airbnb évitée', euros.format(f.site * COMMISSION_RATE), `Estimation : ${percent(COMMISSION_RATE)} du CA du site`)}
          ${tile('Taux d’occupation', percent(f.occupancy), `${number.format(f.siteNights + f.airbnbNights)} nuits réservées sur l’année`)}
          ${tile('Prix moyen par nuit', f.averageNight ? euros.format(f.averageNight) : '—', 'Réservations du site')}
          ${tile('Séjour moyen', f.averageStay ? `${f.averageStay.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} nuits` : '—', f.averageBasket ? `Panier moyen ${euros.format(f.averageBasket)}` : 'Réservations du site')}
          ${tile('Demandes en attente', number.format(f.pendingCount), f.pendingCount ? `${euros.format(f.pendingValue)} potentiels` : 'Rien à traiter', f.acceptance !== null ? `<small class="kpi-side">${percent(f.acceptance)} acceptées</small>` : '')}
        </div>
        <div class="dash-grid two">
          <figure class="panel chart-panel">
            <figcaption><strong>CA par mois</strong>${legend([SITE, AIRBNB])}</figcaption>
            ${columns({ id: 'chart-revenue', rows: revenueRows, series: [SITE, AIRBNB], format: (value, short) => short && value >= 1000 ? `${number.format(Math.round(value / 100) / 10)} k€` : euros.format(value), label: 'Chiffre d’affaires par mois' })}
          </figure>
          <figure class="panel chart-panel">
            <figcaption><strong>Occupation par mois</strong>${legend([SITE, AIRBNB])}</figcaption>
            ${columns({ id: 'chart-occupancy', rows: occupancyRows, series: [SITE, AIRBNB], format: (value) => percent(value), max: 1, label: 'Taux d’occupation par mois' })}
          </figure>
        </div>
        <div class="panel table-panel">
          <div class="table-head"><strong>Détail mensuel</strong><p class="hint">Saisissez le CA Airbnb du mois (versements reçus, dans <b>Airbnb → Revenus</b>). Enregistré automatiquement.</p></div>
          <div class="table-scroll">
            <table class="dash-table">
              <thead><tr><th scope="col">Mois</th><th scope="col">Nuits site</th><th scope="col">CA site</th><th scope="col">Nuits Airbnb</th><th scope="col">CA Airbnb</th><th scope="col">Occupation</th></tr></thead>
              <tbody>${f.months.map((row) => {
                const key = `${state.year}-${String(row.month + 1).padStart(2, '0')}`;
                return `<tr><th scope="row">${monthLong[row.month]}</th><td>${row.siteNights || '—'}</td><td>${row.site ? euros.format(row.site) : '—'}${row.siteEstimated ? '<small> est.</small>' : ''}</td><td>${row.airbnbNights || '—'}</td>
                  <td><span class="amount-field"><input type="number" inputmode="numeric" min="0" step="1" data-airbnb="${key}" value="${row.airbnb ?? ''}" placeholder="${row.airbnbNights ? 'à saisir' : '—'}" aria-label="CA Airbnb ${monthLong[row.month]} ${state.year}" /><span>€</span></span></td>
                  <td>${row.occupancy ? percent(row.occupancy) : '—'}</td></tr>`;
              }).join('')}</tbody>
              <tfoot><tr><th scope="row">Total</th><td>${f.siteNights}</td><td>${euros.format(f.site)}</td><td>${f.airbnbNights}</td><td>${euros.format(f.airbnb)}</td><td>${percent(f.occupancy)}</td></tr></tfoot>
            </table>
          </div>
          <p class="hint table-foot">Nuits Airbnb : lues dans le calendrier Airbnb synchronisé (réservations uniquement, pas les dates fermées). Airbnb n’y montre que les séjours récents et à venir : le site garde désormais l’historique des séjours passés, mais les mois antérieurs à la mise en ligne du tableau de bord n’ont que le CA saisi.</p>
        </div>
      </section>`;
  }

  function trafficSection() {
    const { from, to } = range();
    const t = traffic(state.data, from, to);
    const visits = t.totals.visits || 0;
    const views = t.totals.pv || 0;
    const sent = t.totals['step:sent'] || 0;
    const accepted = t.requests.filter((request) => request.status === 'accepted').length;

    // Visites par jour, ou par mois sur 12 mois.
    let rows;
    if (state.period === '365') {
      const byMonth = new Map();
      for (const { date, counts } of state.data.traffic.days) {
        const key = date.slice(0, 7);
        byMonth.set(key, (byMonth.get(key) || 0) + (counts.visits || 0));
      }
      rows = [...byMonth].map(([key, value]) => ({ label: monthNames[Number(key.slice(5)) - 1], long: `${monthLong[Number(key.slice(5)) - 1]} ${key.slice(0, 4)}`, values: { visits: value } }));
    } else {
      rows = state.data.traffic.days.map(({ date, counts }) => ({ label: dayFormat.format(parse(date)), long: new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(parse(date)), values: { visits: counts.visits || 0 } }));
    }
    const VISITS = { key: 'visits', label: 'Visites', color: '#2f7a4f' };

    // Entonnoir : chaque étape en part des visites, et taux de passage depuis l'étape précédente.
    const steps = [
      ['Visites', visits],
      ['Fenêtre de réservation ouverte', t.totals['step:open'] || 0],
      ['Dates choisies', t.totals['step:dates'] || 0],
      ['Demande envoyée', sent],
      ['Demande acceptée', accepted]
    ];
    const funnel = `<p class="hint funnel-hint">« De passage » : part de l’étape précédente qui passe à l’étape suivante.</p><ol class="funnel">${steps.map(([label, value], i) => {
      const width = visits ? Math.max((value / visits) * 100, value ? 1.5 : 0) : 0;
      const pass = i && steps[i - 1][1] ? `${percent(value / steps[i - 1][1])} de passage` : '';
      return `<li><span class="funnel-label">${label}</span><span class="rank-bar"><i style="width:${width}%"></i></span><span class="rank-value">${number.format(value)}<small>${pass}</small></span></li>`;
    }).join('')}</ol>`;

    // Boutons : clics, taux de clic (sur les visites), demandes envoyées après ce bouton, transformation.
    const ctaRows = Object.keys(CTA_LABELS).map((id) => {
      const clicks = t.totals[`cta:${id}`] || 0;
      const requests = t.requests.filter((request) => request.cta === id).length;
      return { id, clicks, requests, rate: visits ? clicks / visits : 0, conversion: clicks && BOOKING_CTAS.includes(id) ? requests / clicks : null };
    }).filter((row) => row.clicks || row.requests).sort((a, b) => b.clicks - a.clicks || b.requests - a.requests);
    const maxClicks = Math.max(...ctaRows.map((row) => row.clicks), 1);
    const best = ctaRows.filter((row) => row.conversion !== null && row.clicks >= 5).sort((a, b) => b.conversion - a.conversion)[0];
    const ctaTable = ctaRows.length ? `
      <div class="table-scroll"><table class="dash-table cta-table">
        <thead><tr><th scope="col">Bouton</th><th scope="col">Clics</th><th scope="col">Taux de clic</th><th scope="col">Demandes</th><th scope="col">Transformation</th></tr></thead>
        <tbody>${ctaRows.map((row) => `<tr>
          <th scope="row"><b>${CTA_LABELS[row.id][0]}</b><small>${CTA_LABELS[row.id][1]}</small></th>
          <td><span class="bar-cell"><span class="inline-bar"><i style="width:${(row.clicks / maxClicks) * 100}%"></i></span>${number.format(row.clicks)}</span></td>
          <td>${percent(row.rate, 1)}</td>
          <td>${BOOKING_CTAS.includes(row.id) ? number.format(row.requests) : '<span class="muted-cell">—</span>'}</td>
          <td>${row.conversion === null ? '<span class="muted-cell">—</span>' : percent(row.conversion)}</td></tr>`).join('')}</tbody>
      </table></div>` : '<p class="dash-empty">Aucun clic enregistré sur cette période.</p>';

    const sources = t.group('src:');
    const pages = t.group('page:');
    const devices = t.group('dev:');
    const langs = t.group('lang:');
    const conversion = visits ? sent / visits : null;
    const previousSent = t.previous['step:sent'] || 0;

    return `
      <section class="dash-section" aria-labelledby="dash-traffic">
        <header class="dash-section-head">
          <div><h2 id="dash-traffic">Fréquentation et boutons</h2><p class="hint">Mesure sans cookie : visites et clics comptés de façon anonyme${t.firstDay ? `, depuis le ${new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(parse(t.firstDay))}` : ''}.</p></div>
          <div class="lang-switch period-switch" role="tablist" aria-label="Période">${PERIODS.map(([id, label]) => `<button type="button" role="tab" data-period="${id}" class="${id === state.period ? 'active' : ''}" aria-selected="${id === state.period}">${label}</button>`).join('')}</div>
        </header>
        <div class="kpis">
          ${tile('Visites', number.format(visits), 'Arrivées sur le site depuis l’extérieur', delta(visits, t.previous.visits))}
          ${tile('Pages vues', number.format(views), visits ? `${(views / visits).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} pages par visite` : '', delta(views, t.previous.pv))}
          ${tile('Demandes envoyées', number.format(sent), `${accepted} acceptée${accepted > 1 ? 's' : ''} à ce jour`, delta(sent, previousSent))}
          ${tile('Taux de conversion', conversion === null ? '—' : percent(conversion, 1), 'Demandes envoyées / visites')}
        </div>
        <figure class="panel chart-panel">
          <figcaption><strong>Visites ${state.period === '365' ? 'par mois' : 'par jour'}</strong></figcaption>
          ${visits ? columns({ id: 'chart-visits', rows, series: [VISITS], format: (value) => number.format(Math.round(value)), label: 'Visites', dense: rows.length > 14 }) : '<p class="dash-empty">Pas encore de visites mesurées sur cette période. Les chiffres apparaissent dès la mise en ligne du tableau de bord.</p>'}
        </figure>
        <div class="dash-grid two">
          <div class="panel"><p class="panel-title"><strong>Parcours de réservation</strong></p>${funnel}</div>
          <div class="panel"><p class="panel-title"><strong>D’où viennent les visiteurs</strong></p>${ranking(sources, visits, SOURCE_LABELS)}</div>
        </div>
        <div class="panel table-panel">
          <div class="table-head"><strong>Performance des boutons</strong>${best ? `<p class="hint">Meilleure transformation : <b>${CTA_LABELS[best.id][0]}</b> (${CTA_LABELS[best.id][1].toLowerCase()}), ${percent(best.conversion)} des clics aboutissent à une demande.</p>` : '<p class="hint">Transformation = demandes envoyées après un clic sur ce bouton ÷ clics.</p>'}</div>
          ${ctaTable}
        </div>
        <div class="dash-grid three">
          <div class="panel"><p class="panel-title"><strong>Pages les plus vues</strong></p>${ranking(pages, views, PAGE_LABELS)}</div>
          <div class="panel"><p class="panel-title"><strong>Appareils</strong></p>${ranking(devices, visits, { mobile: 'Téléphone', desktop: 'Ordinateur ou tablette' })}</div>
          <div class="panel"><p class="panel-title"><strong>Langue</strong></p>${ranking(langs, visits, { fr: 'Français', en: 'Anglais' })}</div>
        </div>
      </section>`;
  }

  function render() {
    if (state.error) { container.innerHTML = `<p class="form-error">${escape(state.error)}</p>`; return; }
    container.innerHTML = `<div class="dashboard">${financeSection()}${trafficSection()}</div>`;

    container.querySelector('#dash-year').addEventListener('change', (event) => { state.year = Number(event.target.value); render(); });
    container.querySelectorAll('[data-period]').forEach((button) => button.addEventListener('click', async () => {
      if (button.dataset.period === state.period) return;
      state.period = button.dataset.period;
      container.querySelector('.dashboard').setAttribute('aria-busy', 'true');
      state.error = await load();
      render();
      container.querySelector(`[data-period="${state.period}"]`)?.focus();
    }));
    container.querySelectorAll('[data-airbnb]').forEach((input) => input.addEventListener('change', async () => {
      const value = input.value.trim();
      if (value !== '' && !(Number(value) >= 0)) { input.setCustomValidity('Montant invalide'); input.reportValidity(); return; }
      input.setCustomValidity('');
      input.disabled = true;
      const ok = await saveAirbnb(input.dataset.airbnb, value);
      if (!ok) { input.disabled = false; input.setCustomValidity('Enregistrement impossible, réessayez.'); input.reportValidity(); return; }
      const scroll = window.scrollY;
      render();
      window.scrollTo(0, scroll);
      const next = container.querySelector(`[data-airbnb="${input.dataset.airbnb}"]`);
      next?.closest('td').classList.add('saved');
    }));
  }

  container.innerHTML = `<div class="kpis" aria-busy="true" aria-label="Chargement du tableau de bord">${'<div class="kpi"><span class="skel skel-line short"></span><span class="skel skel-h"></span></div>'.repeat(8)}</div>`;
  load().then((error) => { state.error = error; render(); });
}
