// Indicateur de chargement commun à tous les onglets : barre en haut de l'écran pendant chaque appel
// à l'API, message « Enregistrement en cours » si l'attente se prolonge, et délai maximal pour qu'un
// bouton ne tourne jamais indéfiniment (l'appel échoue alors avec le message « Connexion impossible »).

const TIMEOUT = 20000;   // ms avant d'abandonner un appel
const SLOW_AFTER = 1200; // ms avant d'afficher le message d'attente

const bar = document.createElement('div');
bar.className = 'load-bar';
bar.setAttribute('aria-hidden', 'true');
const toast = document.createElement('p');
toast.className = 'load-toast';
toast.setAttribute('role', 'status');
document.body.append(bar, toast);

const pending = new Set();
let slowTimer = null;

function update() {
  const busy = pending.size > 0;
  bar.classList.toggle('active', busy);
  document.body.toggleAttribute('aria-busy', busy);
  clearTimeout(slowTimer);
  if (!busy) return toast.classList.remove('show');
  const calls = [...pending];
  const saving = calls.some((call) => call.saving);
  const message = calls.some((call) => call.auth) ? 'Connexion en cours…' : saving ? 'Enregistrement en cours…' : 'Chargement en cours…';
  if (toast.classList.contains('show')) { toast.textContent = message; return; }
  slowTimer = setTimeout(() => {
    toast.textContent = message;
    toast.classList.add('show');
  }, saving ? 300 : SLOW_AFTER);
}

const nativeFetch = window.fetch.bind(window);
window.fetch = (input, init = {}) => {
  const url = typeof input === 'string' ? input : input.url;
  if (!url.startsWith('/api/') || init.signal) return nativeFetch(input, init);
  const controller = new AbortController();
  const call = { saving: (init.method || 'GET') !== 'GET', auth: url.startsWith('/api/auth/') };
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  pending.add(call);
  update();
  return nativeFetch(input, { ...init, signal: controller.signal }).finally(() => {
    clearTimeout(timer);
    pending.delete(call);
    update();
  });
};
