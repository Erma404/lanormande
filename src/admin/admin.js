import { renderAvailability } from './availability.js';
import { renderContentEditor } from './content-editor.js';

const root = document.querySelector('#admin');
const RESEND_DELAY = 60;

const state = { email: '', expiresAt: 0, resendAt: 0, timer: null, user: null, tab: 'availability', dirty: false };

window.addEventListener('beforeunload', (event) => { if (state.dirty) event.preventDefault(); });

const tabs = [
  ['availability', 'Disponibilités', 'Bloquer ou libérer des dates dans le calendrier du site.'],
  ['pricing', 'Tarifs', 'Prix par nuit, saisons et durée minimale de séjour.'],
  ['requests', 'Demandes', 'Demandes de réservation reçues, à confirmer ou refuser.'],
  ['content', 'Contenus', 'Les textes de la page d’accueil, en français et en anglais.']
];

const errors = {
  invalid_email: 'Cette adresse email ne semble pas valide.',
  too_many_requests: 'Trop de tentatives. Patientez quelques minutes avant de réessayer.',
  expired_code: 'Ce code a expiré ou a été trop souvent mal saisi. Demandez-en un nouveau.',
  server_error: 'Une erreur est survenue. Réessayez dans un instant.',
  network: 'Connexion impossible. Vérifiez votre réseau.'
};

async function api(path, body) {
  try {
    const response = await fetch(`/api/auth/${path}`, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin'
    });
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: 'network' } };
  }
}

const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const formatClock = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

function stopTimer() { clearInterval(state.timer); state.timer = null; }

function shell(content) {
  root.innerHTML = `
    <main class="auth">
      <aside class="auth-visual">
        <img src="/images/admin-alentours.jpg" alt="" />
        <div class="auth-visual-copy">
          <a class="brand" href="/"><span class="brand-mark"><i></i><i></i></span><span>La Maison<br><em>Normande</em></span></a>
          <p>Espace propriétaires</p>
        </div>
      </aside>
      <section class="auth-panel"><div class="auth-card">${content}</div></section>
    </main>`;
}

function showError(message) {
  const box = root.querySelector('.form-error');
  box.textContent = message;
  box.hidden = !message;
}

function setBusy(form, busy) {
  form.querySelectorAll('button, input').forEach((el) => { el.disabled = busy; });
  form.querySelector('[type="submit"]').classList.toggle('loading', busy);
}

function renderEmailStep() {
  stopTimer();
  shell(`
    <p class="kicker">Connexion admin</p>
    <h1>Recevoir un code<br>de connexion</h1>
    <p class="lead">Saisissez votre adresse. Si elle est autorisée, vous recevrez un code à 6 chiffres valable 15 minutes.</p>
    <form id="email-form" novalidate>
      <label for="email">Adresse email</label>
      <input id="email" name="email" type="email" autocomplete="email" inputmode="email" required value="${escape(state.email)}" placeholder="vous@exemple.fr" />
      <p class="form-error" role="alert" hidden></p>
      <button type="submit" class="primary">Envoyer le code</button>
    </form>
    <a class="back-link" href="/">← Retour au site</a>`);

  const form = root.querySelector('#email-form');
  const input = form.querySelector('#email');
  input.focus();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError(errors.invalid_email);
    setBusy(form, true);
    const result = await api('request-code', { email });
    setBusy(form, false);
    if (!result.ok) return showError(errors[result.data.error] || errors.server_error);
    state.email = email;
    state.expiresAt = result.data.expiresAt;
    state.localMode = Boolean(result.data.localMode);
    state.localCode = result.data.localCode || '';
    state.resendAt = Date.now() + RESEND_DELAY * 1000;
    renderCodeStep();
  });
}

function renderCodeStep(notice = '') {
  shell(`
    <p class="kicker">Vérification</p>
    <h1>Saisissez<br>votre code</h1>
    ${state.localMode
      ? `<div class="local-mode"><p><strong>Mode local</strong> — aucun email n’est envoyé tant que l’envoi n’est pas configuré.</p>${state.localCode ? `<p>Votre code : <b>${escape(state.localCode)}</b></p>` : '<p>Cette adresse n’est pas autorisée : aucun code n’a été créé.</p>'}</div>`
      : `<p class="lead">Si <strong>${escape(state.email)}</strong> est une adresse autorisée, un code vient d’y être envoyé. Pensez à vérifier vos spams.</p>`}
    <form id="code-form" novalidate>
      <label for="code">Code à 6 chiffres</label>
      <input id="code" name="code" class="code-input" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="••••••" required />
      <p class="countdown" aria-live="polite"></p>
      <p class="form-notice" ${notice ? '' : 'hidden'}>${escape(notice)}</p>
      <p class="form-error" role="alert" hidden></p>
      <button type="submit" class="primary">Se connecter</button>
    </form>
    <div class="code-actions">
      <button type="button" class="link-button" id="resend"></button>
      <button type="button" class="link-button" id="change-email">Changer d’adresse</button>
    </div>`);

  const form = root.querySelector('#code-form');
  const input = form.querySelector('#code');
  const countdown = form.querySelector('.countdown');
  const resend = root.querySelector('#resend');
  input.focus();

  const tick = () => {
    const left = Math.max(0, Math.round((state.expiresAt - Date.now()) / 1000));
    countdown.textContent = left > 0 ? `Code valable encore ${formatClock(left)}` : 'Ce code a expiré. Demandez-en un nouveau.';
    countdown.classList.toggle('expired', left === 0);
    const wait = Math.max(0, Math.ceil((state.resendAt - Date.now()) / 1000));
    resend.disabled = wait > 0;
    resend.textContent = wait > 0 ? `Renvoyer un code (${wait} s)` : 'Renvoyer un code';
  };
  stopTimer();
  tick();
  state.timer = setInterval(tick, 1000);

  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 6);
    showError('');
    if (input.value.length === 6) form.requestSubmit();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(input.value)) return showError('Le code contient 6 chiffres.');
    setBusy(form, true);
    const result = await api('verify', { email: state.email, code: input.value });
    setBusy(form, false);
    if (result.ok) { stopTimer(); state.user = { email: result.data.email }; return renderDashboard(); }
    const { error, remaining } = result.data;
    if (error === 'invalid_code') {
      showError(remaining > 0 ? `Code incorrect. Il vous reste ${remaining} essai${remaining > 1 ? 's' : ''}.` : 'Code incorrect.');
    } else {
      showError(errors[error] || errors.server_error);
    }
    input.value = '';
    input.focus();
  });

  resend.addEventListener('click', async () => {
    resend.disabled = true;
    const result = await api('request-code', { email: state.email });
    if (!result.ok) return showError(errors[result.data.error] || errors.server_error);
    state.expiresAt = result.data.expiresAt;
    state.localMode = Boolean(result.data.localMode);
    state.localCode = result.data.localCode || '';
    state.resendAt = Date.now() + RESEND_DELAY * 1000;
    renderCodeStep('Un nouveau code a été envoyé. L’ancien n’est plus valable.');
  });

  root.querySelector('#change-email').addEventListener('click', renderEmailStep);
}

function renderDashboard() {
  const [, title, description] = tabs.find(([id]) => id === state.tab);
  root.innerHTML = `
    <div class="dash">
      <header class="dash-header">
        <a class="brand" href="/" target="_blank" rel="noopener"><span class="brand-mark"><i></i><i></i></span><span>La Maison<br><em>Normande</em></span></a>
        <nav class="dash-tabs" aria-label="Sections">
          ${tabs.map(([id, label]) => `<button data-tab="${id}" class="${id === state.tab ? 'active' : ''}" ${id === state.tab ? 'aria-current="page"' : ''}>${label}</button>`).join('')}
        </nav>
        <div class="dash-user"><span>${escape(state.user.email)}</span><button id="logout" class="ghost">Déconnexion</button></div>
      </header>
      <main class="dash-main">
        <p class="kicker">Espace admin</p>
        <h1>${title}</h1>
        <p class="lead">${description}</p>
        <div id="tab-content">
          <div class="placeholder">
            <strong>Bientôt disponible</strong>
            <p>Cette section est en cours de construction. Elle arrive aux prochaines étapes.</p>
          </div>
        </div>
      </main>
    </div>`;

  state.dirty = false;
  if (state.tab === 'availability') renderAvailability(root.querySelector('#tab-content'), { escape });
  if (state.tab === 'content') renderContentEditor(root.querySelector('#tab-content'), { escape, onDirtyChange: (dirty) => { state.dirty = dirty; } });

  root.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => {
    if (state.dirty && !window.confirm('Des modifications ne sont pas enregistrées. Quitter cet onglet quand même ?')) return;
    state.tab = button.dataset.tab;
    renderDashboard();
  }));
  root.querySelector('#logout').addEventListener('click', async () => {
    await api('logout', {});
    state.user = null;
    renderEmailStep();
  });
}

(async function init() {
  root.innerHTML = '<p class="boot">Chargement…</p>';
  const result = await api('me');
  if (result.ok) { state.user = result.data; renderDashboard(); } else { renderEmailStep(); }
})();
