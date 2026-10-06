// Bulle WhatsApp : écrire à Christophe depuis n'importe quelle page (accueil, guide).
// Lien wa.me : ouvre l'application sur téléphone, WhatsApp Web sur ordinateur.
export const WHATSAPP_NUMBER = '33603830585'; // Christophe

const TEXT = {
  fr: { label: 'Une question ?', aria: 'Écrire à Christophe sur WhatsApp', message: 'Bonjour Christophe, j’ai une question sur la Villa Normande : ' },
  en: { label: 'Any questions?', aria: 'Message Christophe on WhatsApp', message: 'Hello Christophe, I have a question about Villa Normande: ' }
};
const LOGO = '<svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M16.02 3C8.84 3 3 8.83 3 16c0 2.3.6 4.53 1.75 6.5L3 29l6.68-1.73A13 13 0 0 0 16.02 29C23.2 29 29 23.17 29 16S23.2 3 16.02 3Zm0 23.8c-2.01 0-3.98-.54-5.7-1.56l-.41-.24-3.96 1.03 1.06-3.86-.27-.4A10.78 10.78 0 0 1 5.2 16c0-5.96 4.86-10.8 10.82-10.8 5.97 0 10.8 4.84 10.8 10.8 0 5.96-4.83 10.8-10.8 10.8Zm5.93-8.09c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.17-.22.32-.84 1.05-1.03 1.27-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.62-1.62-.97-.87-1.62-1.93-1.81-2.26-.19-.32-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.54.1-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.41-.27-.63-.54-.55-.73-.56h-.62c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.71s1.17 3.15 1.33 3.36c.16.22 2.3 3.5 5.56 4.91.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.42.19-1.55-.08-.14-.3-.22-.62-.38Z"/></svg>';

const t = TEXT[document.documentElement.lang === 'en' ? 'en' : 'fr'];
const link = document.createElement('a');
link.className = 'wa-bubble';
link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t.message)}`;
link.target = '_blank';
link.rel = 'noopener';
link.setAttribute('aria-label', t.aria);
link.innerHTML = `<span class="wa-bubble-label">${t.label}</span><span class="wa-bubble-icon">${LOGO}</span>`;
document.body.append(link);
// Apparition douce, une fois la page chargée.
setTimeout(() => link.classList.add('show'), 1200);
