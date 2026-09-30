// Textes modifiés depuis l'admin : { fr: { 'hero.intro': '…' }, en: { … } }.
// Ils sont saisis en texte simple : un retour à la ligne devient <br>,
// et *un mot entre astérisques* est mis en valeur (<em>, en couleur sur le site).

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const toHtml = (text) => escapeHtml(text).replace(/\r?\n/g, '<br>').replace(/\*([^*\n]+)\*/g, '<em>$1</em>');

export const toEditable = (html) => String(html)
  .replace(/<br\s*\/?>/g, '\n')
  .replace(/<em>(.*?)<\/em>/g, '*$1*')
  .replace(/&amp;/g, '&');

export function getPath(object, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), object);
}

function setPath(object, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const parent = keys.reduce((node, key) => (node == null ? undefined : node[key]), object);
  // On ne remplace que des textes qui existent déjà : impossible de créer ou casser une structure.
  if (parent && typeof parent[last] === 'string') parent[last] = value;
}

export function applyOverrides(content, overrides) {
  for (const lang of ['fr', 'en']) {
    for (const [path, value] of Object.entries(overrides?.[lang] || {})) {
      if (typeof value === 'string') setPath(content[lang], path, toHtml(value));
    }
  }
}
