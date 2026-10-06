// Bannière d'information cookies. Le site n'utilise que des éléments strictement nécessaires :
// pas de consentement à recueillir, juste une information, masquée une fois lue.
const KEY = 'cookie-notice-ok';
const TEXT = {
  fr: { text: 'Ce site n’utilise aucun cookie publicitaire ni de mesure d’audience, seulement des éléments techniques nécessaires à son fonctionnement.', more: 'En savoir plus', ok: 'J’ai compris' },
  en: { text: 'This site uses no advertising or analytics cookies, only technical elements needed for it to work.', more: 'Learn more', ok: 'Got it' }
};

function seen() { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } }

export function showCookieNotice() {
  if (seen() || document.getElementById('cookie-notice')) return;
  const t = TEXT[document.documentElement.lang === 'en' ? 'en' : 'fr'];
  const notice = document.createElement('div');
  notice.id = 'cookie-notice';
  notice.className = 'cookie-notice';
  notice.setAttribute('role', 'region');
  notice.setAttribute('aria-label', 'Cookies');
  notice.innerHTML = `<p>${t.text} <a href="/politique-de-confidentialite#cookies">${t.more}</a></p><button type="button">${t.ok}</button>`;
  notice.querySelector('button').addEventListener('click', () => {
    try { localStorage.setItem(KEY, '1'); } catch { /* navigation privée : réapparaîtra */ }
    notice.classList.remove('show');
    document.body.classList.remove('cookie-notice-open');
    setTimeout(() => notice.remove(), 350);
  });
  document.body.append(notice);
  document.body.classList.add('cookie-notice-open');
  requestAnimationFrame(() => requestAnimationFrame(() => notice.classList.add('show')));
}

showCookieNotice();
