// Onglet Disponibilités : synchro Airbnb, export iCal et blocages manuels.

const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
const timeFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const formatDate = (iso) => dateFormat.format(new Date(`${iso}T00:00:00`));
const nights = (start, end) => Math.round((new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000);
const describe = (start, end) => `${formatDate(start)} → ${formatDate(end)} · ${nights(start, end)} nuit${nights(start, end) > 1 ? 's' : ''}`;
const todayIso = () => new Date().toISOString().slice(0, 10);

const errors = {
  invalid_url: 'Ce lien n’est pas un lien de calendrier Airbnb (il doit commencer par https://www.airbnb… et finir par .ics).',
  invalid_range: 'La date de départ doit être après la date d’arrivée.',
  unauthenticated: 'Votre session a expiré. Rechargez la page pour vous reconnecter.'
};

export function renderAvailability(container, { escape }) {
  let data = null;

  async function call(body) {
    const response = await fetch('/api/admin/availability', {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin'
    }).catch(() => null);
    if (!response) return { error: 'Connexion impossible. Vérifiez votre réseau.' };
    const json = await response.json().catch(() => ({}));
    if (!response.ok) return { error: errors[json.error] || 'Une erreur est survenue. Réessayez.' };
    data = json;
    return {};
  }

  function syncStatus() {
    const { airbnb } = data;
    if (!airbnb.configured) return '<p class="status warn">Pas encore connecté : ajoutez le lien de votre calendrier Airbnb ci-dessous.</p>';
    const when = airbnb.syncedAt ? `Dernière synchronisation : ${timeFormat.format(airbnb.syncedAt)}` : 'Jamais synchronisé';
    if (airbnb.error) return `<p class="status error">${when}. Échec de la dernière tentative : ${escape(airbnb.error)}. Les dates connues restent bloquées.</p>`;
    return `<p class="status ok">Connecté · ${when}. Le site se met à jour automatiquement toutes les 10 minutes.</p>`;
  }

  function render(message = '') {
    const exportUrl = `${location.origin}/calendar.ics`;
    container.innerHTML = `
      ${message ? `<p class="form-error panel-error" role="alert">${escape(message)}</p>` : ''}
      <div class="panels">
        <section class="panel">
          <h2>Calendrier Airbnb → site</h2>
          ${syncStatus()}
          <form id="airbnb-form" class="inline-form">
            <label for="airbnb-url">Lien d’export du calendrier Airbnb</label>
            <input id="airbnb-url" type="text" value="${escape(data.airbnbUrl)}" placeholder="https://www.airbnb.fr/calendar/ical/….ics?s=…" spellcheck="false" />
            <div class="actions">
              <button type="submit" class="primary small">Enregistrer</button>
              <button type="button" id="sync-now" class="secondary small" ${data.airbnb.configured ? '' : 'disabled'}>Synchroniser maintenant</button>
            </div>
          </form>
          <details class="help"><summary>Où trouver ce lien ?</summary>
            <p>Sur Airbnb : <strong>Annonces</strong> → votre annonce → <strong>Disponibilités</strong> → <strong>Associer des calendriers</strong> → <strong>Exporter le calendrier</strong>. Copiez le lien affiché et collez-le ici.</p>
          </details>
        </section>

        <section class="panel">
          <h2>Site → calendrier Airbnb</h2>
          <p class="muted">Pour que les dates bloquées ici soient aussi bloquées sur Airbnb, importez ce lien une fois dans Airbnb : <strong>Associer des calendriers</strong> → <strong>Importer un calendrier</strong>, nom « Site La Maison Normande ».</p>
          <div class="copy-row"><input type="text" readonly value="${escape(exportUrl)}" id="export-url" /><button type="button" class="secondary small" id="copy-export">Copier</button></div>
          <p class="muted small-text">Airbnb relit ce calendrier environ toutes les 2 à 3 heures.</p>
        </section>

        <section class="panel">
          <h2>Bloquer des dates</h2>
          <p class="muted">Réservation confirmée par WhatsApp, travaux, séjour en famille… Les nuits bloquées disparaissent du calendrier du site et d’Airbnb.</p>
          <form id="block-form" class="block-form">
            <div><label for="block-start">Arrivée</label><input id="block-start" type="date" min="${todayIso()}" required /></div>
            <div><label for="block-end">Départ</label><input id="block-end" type="date" min="${todayIso()}" required /></div>
            <div class="wide"><label for="block-note">Note (visible par les admins uniquement)</label><input id="block-note" type="text" maxlength="120" placeholder="Ex. Famille Martin — WhatsApp" /></div>
            <button type="submit" class="primary small wide">Bloquer ces dates</button>
          </form>
          ${data.manual.length ? `<ul class="range-list">${data.manual.map((block) => `
            <li><div><strong>${describe(block.start, block.end)}</strong>${block.note ? `<span>${escape(block.note)}</span>` : ''}</div>
            <button type="button" class="link-button danger" data-remove="${escape(block.id)}">Débloquer</button></li>`).join('')}</ul>` : '<p class="empty">Aucune date bloquée manuellement.</p>'}
        </section>

        <section class="panel">
          <h2>Réservé sur Airbnb</h2>
          ${data.airbnb.ranges.length ? `<ul class="range-list">${data.airbnb.ranges.map(([start, end]) => `<li><div><strong>${describe(start, end)}</strong></div></li>`).join('')}</ul>` : '<p class="empty">Aucune réservation Airbnb à venir.</p>'}
        </section>
      </div>`;

    const busy = async (button, body) => {
      button.disabled = true;
      button.classList.add('loading');
      const result = await call(body);
      render(result.error);
    };

    container.querySelector('#airbnb-form').addEventListener('submit', (event) => {
      event.preventDefault();
      busy(event.submitter, { action: 'setAirbnbUrl', url: container.querySelector('#airbnb-url').value });
    });
    container.querySelector('#sync-now').addEventListener('click', (event) => busy(event.currentTarget, { action: 'sync' }));
    container.querySelector('#copy-export').addEventListener('click', async (event) => {
      const button = event.currentTarget;
      try { await navigator.clipboard.writeText(exportUrl); button.textContent = 'Copié'; } catch { container.querySelector('#export-url').select(); }
    });
    const start = container.querySelector('#block-start');
    const end = container.querySelector('#block-end');
    start.addEventListener('change', () => { end.min = start.value; if (end.value && end.value <= start.value) end.value = ''; });
    container.querySelector('#block-form').addEventListener('submit', (event) => {
      event.preventDefault();
      if (!start.value || !end.value || end.value <= start.value) return render(errors.invalid_range);
      busy(event.submitter, { action: 'addBlock', start: start.value, end: end.value, note: container.querySelector('#block-note').value });
    });
    container.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => {
      busy(button, { action: 'removeBlock', id: button.dataset.remove });
    }));
  }

  container.innerHTML = `<div class="panels" aria-busy="true" aria-label="Chargement des disponibilités">${'<div class="panel"><span class="skel skel-h"></span><span class="skel skel-line"></span><span class="skel skel-line short"></span><span class="skel skel-input"></span></div>'.repeat(4)}</div>`;
  call().then((result) => {
    if (result.error) container.innerHTML = `<p class="form-error">${escape(result.error)}</p>`;
    else render();
  });
}
