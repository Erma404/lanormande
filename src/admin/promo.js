// Onglet Promotion : bannière affichée en haut du site, entre deux dates, en français et en anglais.

const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const formatDate = (iso) => dateFormat.format(new Date(`${iso}T00:00:00`));
const todayIso = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());

const errors = {
  invalid_range: 'La date de fin doit être après la date de début.',
  missing_text: 'Écrivez au moins le texte en français pour activer la bannière.',
  unauthenticated: 'Votre session a expiré. Rechargez la page pour vous reconnecter.'
};

// Ce que verra le visiteur, en une phrase.
function statusOf(promo, live) {
  if (!promo.enabled) return ['warn', 'Désactivée : la bannière n’apparaît pas sur le site.'];
  if (live) return ['ok', promo.end ? `En ligne maintenant, jusqu’au ${formatDate(promo.end)} inclus.` : 'En ligne maintenant, sans date de fin.'];
  if (promo.start && todayIso() < promo.start) return ['ok', `Programmée : elle apparaîtra le ${formatDate(promo.start)}${promo.end ? ` et disparaîtra après le ${formatDate(promo.end)}` : ''}.`];
  return ['warn', 'Terminée : la date de fin est passée, la bannière n’apparaît plus.'];
}

export function renderPromo(container, { escape, onDirtyChange }) {
  let promo = null;
  let live = false;

  async function call(body) {
    const response = await fetch('/api/admin/promo', {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin'
    }).catch(() => null);
    if (!response) return { error: 'Connexion impossible. Vérifiez votre réseau.' };
    const json = await response.json().catch(() => ({}));
    if (!response.ok) return { error: errors[json.error] || 'Une erreur est survenue. Réessayez.' };
    ({ promo, live } = json);
    return {};
  }

  const field = (id, label, value, max, placeholder, hint = '') => `
    <div class="promo-field">
      <div class="field-head"><label for="${id}">${label}</label><small class="char-count" data-for="${id}">${value.length}/${max}</small></div>
      <input id="${id}" type="text" maxlength="${max}" value="${escape(value)}" placeholder="${escape(placeholder)}" />
      ${hint ? `<p class="muted small-text">${hint}</p>` : ''}
    </div>`;

  function render(message = '', saved = false) {
    const [tone, status] = statusOf(promo, live);
    container.innerHTML = `
      ${message ? `<p class="form-error panel-error" role="alert">${escape(message)}</p>` : ''}
      <form id="promo-form" class="promo-form">
        <section class="panel">
          <div class="promo-switch-row">
            <div><h2>Bannière de promotion</h2><p class="status ${tone}">${escape(status)}</p></div>
            <label class="switch"><input type="checkbox" id="promo-enabled" ${promo.enabled ? 'checked' : ''} /><span aria-hidden="true"></span><b>${promo.enabled ? 'Activée' : 'Désactivée'}</b></label>
          </div>
          <div class="promo-dates">
            <div><label for="promo-start">Afficher à partir du</label><input id="promo-start" type="date" value="${promo.start}" /></div>
            <div><label for="promo-end">Jusqu’au (inclus)</label><input id="promo-end" type="date" value="${promo.end}" /></div>
          </div>
          <p class="muted small-text">Sans dates, la bannière reste affichée tant qu’elle est activée.</p>
        </section>

        <section class="panel">
          <h2>Aperçu</h2>
          <div class="promo-preview-tabs" role="tablist">
            <button type="button" class="active" data-preview="fr">Français</button>
            <button type="button" data-preview="en">English</button>
          </div>
          <div class="promo-preview" id="promo-preview"></div>
        </section>

        <section class="panel">
          <h2>Textes</h2>
          ${field('promo-fr-text', 'Message en français', promo.fr.text, 140, '-15 % sur les séjours de novembre, réservez en direct')}
          ${field('promo-en-text', 'Message en anglais', promo.en.text, 140, '15% off November stays, book direct', 'Laissé vide, le message français est affiché aux visiteurs anglophones.')}
          <label class="check"><input type="checkbox" id="promo-button" ${promo.showButton ? 'checked' : ''} /> Afficher un bouton qui ouvre la réservation</label>
          <div class="promo-dates" id="promo-cta-fields" ${promo.showButton ? '' : 'hidden'}>
            ${field('promo-fr-cta', 'Bouton (français)', promo.fr.cta, 30, 'J’en profite')}
            ${field('promo-en-cta', 'Bouton (anglais)', promo.en.cta, 30, 'Book now')}
          </div>
        </section>

        <div class="promo-save">
          <button type="submit" class="primary small" id="promo-save">Enregistrer</button>
          ${saved ? '<span class="saved-note" role="status">Enregistré. Le site est à jour sous une minute.</span>' : ''}
        </div>
      </form>`;

    const $ = (selector) => container.querySelector(selector);
    let previewLang = 'fr';
    const read = () => ({
      enabled: $('#promo-enabled').checked,
      start: $('#promo-start').value,
      end: $('#promo-end').value,
      showButton: $('#promo-button').checked,
      fr: { text: $('#promo-fr-text').value, cta: $('#promo-fr-cta').value },
      en: { text: $('#promo-en-text').value, cta: $('#promo-en-cta').value }
    });
    const renderPreview = () => {
      const values = read();
      const text = values[previewLang].text || values.fr.text;
      const cta = values[previewLang].cta || (previewLang === 'en' ? 'Book now' : 'J’en profite');
      $('#promo-preview').innerHTML = text
        ? `<div class="preview-banner"><p><span class="spark"></span>${escape(text)}</p>${values.showButton ? `<span class="preview-cta">${escape(cta)} →</span>` : ''}<span class="preview-close">✕</span></div>
           <div class="preview-header"><span>Villa <em>Normande</em></span><i></i><i></i><i></i></div>`
        : '<p class="empty">Écrivez un message pour voir l’aperçu.</p>';
    };
    renderPreview();

    container.querySelectorAll('[data-preview]').forEach((button) => button.addEventListener('click', () => {
      previewLang = button.dataset.preview;
      container.querySelectorAll('[data-preview]').forEach((other) => other.classList.toggle('active', other === button));
      renderPreview();
    }));
    $('#promo-form').addEventListener('input', (event) => {
      onDirtyChange(true);
      const counter = container.querySelector(`.char-count[data-for="${event.target.id}"]`);
      if (counter) counter.textContent = `${event.target.value.length}/${event.target.maxLength}`;
      if (event.target.id === 'promo-enabled') $('.switch b').textContent = event.target.checked ? 'Activée' : 'Désactivée';
      if (event.target.id === 'promo-button') $('#promo-cta-fields').hidden = !event.target.checked;
      if (event.target.id === 'promo-start') $('#promo-end').min = event.target.value;
      renderPreview();
    });
    $('#promo-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const values = read();
      if (values.start && values.end && values.end < values.start) return render(errors.invalid_range);
      const button = $('#promo-save');
      button.disabled = true;
      button.classList.add('loading');
      const result = await call(values);
      if (!result.error) onDirtyChange(false);
      render(result.error, !result.error);
    });
  }

  container.innerHTML = `<div class="panels" aria-busy="true" aria-label="Chargement de la promotion">${'<div class="panel"><span class="skel skel-h"></span><span class="skel skel-line"></span><span class="skel skel-input"></span></div>'.repeat(2)}</div>`;
  call().then((result) => {
    if (result.error) container.innerHTML = `<p class="form-error">${escape(result.error)}</p>`;
    else render();
  });
}
