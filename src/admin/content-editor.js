// Onglet Contenus : modifier les textes de la page d'accueil, en français et en anglais.
import { content as defaults } from '../content.js';
import { getPath, toEditable } from '../content-overrides.js';
import { autosize } from './autosize.js';

const fields = (base, list) => list.map(([key, label]) => ({ path: `${base}.${key}`, label }));
const items = (base, parts, name) => (defaults.fr[base] || []).flatMap((item, i) =>
  parts.map(([index, label]) => ({ path: `${base}.${i}.${index}`, label: `${name(item, i)} — ${label}` })));

const sections = [
  { title: 'Haut de page', fields: [
    ...fields('hero', [['eyebrow', 'Petit titre'], ['titleLine1', 'Titre — ligne 1'], ['titleEm', 'Titre — ligne 2 (en couleur)'], ['intro', 'Texte d’introduction'], ['travelers', 'Capacité'], ['specs', 'Chambres, lits, salles de bain']]),
    { path: 'booking.fromPrice', label: 'Prix affiché sur le bouton Réserver' },
    { path: 'headerCta', label: 'Bouton du menu' }
  ] },
  { title: 'La maison', fields: fields('cadre', [['eyebrow', 'Petit titre'], ['h2', 'Titre'], ['p1', 'Paragraphe 1'], ['p2', 'Paragraphe 2'], ['photoOneCaption', 'Légende photo 1'], ['photoTwoCaption', 'Légende photo 2']]) },
  { title: 'Équipements', fields: [
    ...fields('amenitiesSection', [['eyebrow', 'Petit titre'], ['h2', 'Titre']]),
    ...items('amenities', [[1, 'Libellé']], (_, i) => `Équipement ${i + 1}`)
  ] },
  { title: 'Les pièces', fields: [
    ...fields('spacesSection', [['eyebrow', 'Petit titre'], ['h2', 'Titre']]),
    ...items('spaces', [[0, 'Nom'], [1, 'Description']], (item) => item[0])
  ] },
  { title: 'L’hôte', fields: fields('host', [['name', 'Prénom'], ['languages', 'Langues parlées'], ['years', 'Ancienneté'], ['eyebrow', 'Petit titre'], ['quote', 'Citation'], ['bio', 'Présentation'], ['cta', 'Lien de réservation']]) },
  { title: 'Plan de la maison', fields: fields('floorPlan', [['eyebrow', 'Petit titre'], ['h2', 'Titre'], ['p', 'Texte']]) },
  { title: 'Autour de Danestal', fields: [
    ...fields('nearbySection', [['eyebrow', 'Petit titre'], ['h2', 'Titre'], ['cta', 'Lien']]),
    ...items('nearbyItems', [[0, 'Titre'], [1, 'Distance'], [2, 'Description']], (item) => item[0])
  ] },
  { title: 'Avis', fields: [
    ...fields('reviewsSection', [['eyebrow', 'Petit titre'], ['h2', 'Titre'], ['count', 'Nombre d’avis'], ['overallRating', 'Note moyenne']]),
    { path: 'cadre.overallRating', label: 'Note moyenne (badge sur la photo « La maison »)' },
    { path: 'cadre.reviewsVerified', label: 'Nombre d’avis (badge sur la photo « La maison »)' },
    ...items('ratingCategories', [[1, 'Note sur 5 (vide = masquée)']], (item) => item[0]),
    ...items('reviews', [[1, 'Nom'], [2, 'Date'], [3, 'Avis']], (item, i) => `Avis ${i + 1}`)
  ] },
  { title: 'Questions fréquentes', fields: [
    ...fields('faqSection', [['eyebrow', 'Petit titre'], ['h2', 'Titre'], ['intro', 'Introduction'], ['contact', 'Bouton contact']]),
    ...items('faq', [[0, 'Question'], [1, 'Réponse']], (_, i) => `Question ${i + 1}`)
  ] },
  { title: 'Bas de page', fields: [
    ...fields('finalCta', [['eyebrow', 'Petit titre'], ['h2', 'Titre'], ['button', 'Bouton'], ['note', 'Note sous le bouton']]),
    ...fields('footer', [['tagline', 'Phrase du pied de page'], ['bottomNote', 'Mention en bas']])
  ] }
];

const defaultText = (lang, path) => toEditable(getPath(defaults[lang], path) ?? '');

export function renderContentEditor(container, { escape, onDirtyChange }) {
  let lang = 'fr';
  let saved = { fr: {}, en: {} };
  let draft = { fr: {}, en: {} };
  let openSections = new Set([0]);

  const valueOf = (path) => draft[lang][path] ?? defaultText(lang, path);
  const changedCount = (l) => Object.keys(draft[l]).length;
  const isDirty = () => ['fr', 'en'].some((l) => JSON.stringify(draft[l]) !== JSON.stringify(saved[l] || {}));

  async function request(body) {
    const response = await fetch('/api/admin/content', {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin'
    }).catch(() => null);
    if (!response) return { error: 'Connexion impossible. Vérifiez votre réseau.' };
    const json = await response.json().catch(() => ({}));
    if (response.status === 401) return { error: 'Votre session a expiré. Rechargez la page pour vous reconnecter.' };
    if (!response.ok) return { error: 'L’enregistrement a échoué. Réessayez.' };
    return { data: json };
  }

  function updateBar(message = '', kind = '') {
    const dirty = isDirty();
    onDirtyChange?.(dirty);
    const bar = container.querySelector('.save-bar');
    bar.classList.toggle('dirty', dirty);
    bar.querySelector('.save-state').textContent = message || (dirty ? 'Modifications non enregistrées' : 'Tout est enregistré');
    bar.querySelector('.save-state').dataset.kind = kind;
    bar.querySelector('#save-content').disabled = !dirty;
  }

  function fieldHtml({ path, label }) {
    const original = defaultText(lang, path);
    const value = valueOf(path);
    const changed = path in draft[lang];
    // Au-delà d'une quarantaine de caractères, un champ d'une ligne couperait le texte : zone de texte.
    const long = Math.max(original.length, value.length) > 40 || original.includes('\n');
    const id = `f-${path.replaceAll('.', '-')}`;
    const input = long
      ? `<textarea id="${id}" data-path="${path}" rows="2">${escape(value)}</textarea>`
      : `<input id="${id}" data-path="${path}" type="text" value="${escape(value)}" />`;
    return `<div class="field ${changed ? 'changed' : ''}">
      <div class="field-head"><label for="${id}">${escape(label)}</label>${changed ? `<span class="badge">Modifié</span><button type="button" class="link-button reset" data-reset="${path}">Rétablir</button>` : ''}</div>
      ${input}
    </div>`;
  }

  function render(message, kind) {
    container.innerHTML = `
      <div class="editor-top">
        <div class="lang-switch" role="group" aria-label="Langue">
          ${['fr', 'en'].map((l) => `<button type="button" data-lang="${l}" class="${l === lang ? 'active' : ''}" aria-pressed="${l === lang}">${l === 'fr' ? 'Français' : 'English'}${changedCount(l) ? ` <small>${changedCount(l)}</small>` : ''}</button>`).join('')}
        </div>
        <p class="hint">Un retour à la ligne crée un saut de ligne. Un <b>*mot entre astérisques*</b> apparaît en couleur sur le site.</p>
      </div>
      <div class="sections">
        ${sections.map((section, index) => {
          const count = section.fields.filter(({ path }) => path in draft[lang]).length;
          return `<details class="section-card" data-index="${index}" ${openSections.has(index) ? 'open' : ''}>
            <summary><span>${section.title}</span>${count ? `<span class="badge">${count} modifié${count > 1 ? 's' : ''}</span>` : ''}</summary>
            <div class="fields">${section.fields.map(fieldHtml).join('')}</div>
          </details>`;
        }).join('')}
      </div>
      <div class="save-bar">
        <span class="save-state" aria-live="polite"></span>
        <a class="secondary small view-site" href="/" target="_blank" rel="noopener">Voir le site</a>
        <button type="button" class="primary small" id="save-content">Enregistrer</button>
      </div>`;

    container.querySelectorAll('details').forEach((details) => details.addEventListener('toggle', () => {
      const index = Number(details.dataset.index);
      if (details.open) openSections.add(index); else openSections.delete(index);
    }));
    container.querySelectorAll('[data-lang]').forEach((button) => button.addEventListener('click', () => {
      lang = button.dataset.lang;
      render();
    }));
    container.querySelectorAll('[data-path]').forEach((input) => input.addEventListener('input', () => {
      const { path } = input.dataset;
      const field = input.closest('.field');
      if (input.value === defaultText(lang, path)) delete draft[lang][path];
      else draft[lang][path] = input.value;
      const changed = path in draft[lang];
      if (changed !== field.classList.contains('changed')) {
        field.classList.toggle('changed', changed);
        const head = field.querySelector('.field-head');
        head.querySelectorAll('.badge, .reset').forEach((el) => el.remove());
        if (changed) {
          head.insertAdjacentHTML('beforeend', `<span class="badge">Modifié</span><button type="button" class="link-button reset" data-reset="${path}">Rétablir</button>`);
          head.querySelector('.reset').addEventListener('click', () => { delete draft[lang][path]; render(); });
        }
      }
      updateBar();
    }));
    container.querySelectorAll('[data-reset]').forEach((button) => button.addEventListener('click', () => {
      delete draft[lang][button.dataset.reset];
      render();
    }));
    container.querySelector('#save-content').addEventListener('click', async (event) => {
      const button = event.currentTarget;
      button.disabled = true;
      button.classList.add('loading');
      const results = [];
      for (const l of ['fr', 'en']) {
        if (JSON.stringify(draft[l]) !== JSON.stringify(saved[l] || {})) results.push(await request({ lang: l, values: draft[l] }));
      }
      const failed = results.find((result) => result.error);
      if (failed) return render(failed.error, 'error');
      const last = results[results.length - 1];
      saved = { fr: { ...(last.data.fr || {}) }, en: { ...(last.data.en || {}) } };
      render('Enregistré. Le site est à jour d’ici une minute.', 'ok');
    });
    autosize(container);
    updateBar(message, kind);
  }

  container.innerHTML = `<div aria-busy="true" aria-label="Chargement des textes"><span class="skel skel-switch"></span><div class="sections">${'<div class="section-card skel-card"><span class="skel skel-h"></span></div>'.repeat(6)}</div></div>`;
  request().then((result) => {
    if (result.error) { container.innerHTML = `<p class="form-error">${escape(result.error)}</p>`; return; }
    saved = { fr: { ...(result.data.fr || {}) }, en: { ...(result.data.en || {}) } };
    draft = { fr: { ...saved.fr }, en: { ...saved.en } };
    render();
  });
}
