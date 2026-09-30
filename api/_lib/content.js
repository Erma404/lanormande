import * as store from './store.js';

const KEY = 'content:overrides';
const PATH = /^[a-zA-Z]+(\.[a-zA-Z0-9]+){1,3}$/;
const MAX_FIELDS = 400;
const MAX_LENGTH = 2000;

export async function getOverrides() {
  return (await store.get(KEY)) || { fr: {}, en: {} };
}

// Remplace toutes les modifications d'une langue ; renvoie null si les données sont invalides.
export async function saveOverrides(lang, values) {
  if (!['fr', 'en'].includes(lang) || !values || typeof values !== 'object') return null;
  const entries = Object.entries(values);
  if (entries.length > MAX_FIELDS) return null;
  const clean = {};
  for (const [path, value] of entries) {
    if (!PATH.test(path) || typeof value !== 'string' || value.length > MAX_LENGTH) return null;
    clean[path] = value;
  }
  const overrides = await getOverrides();
  overrides[lang] = clean;
  overrides.updatedAt = Date.now();
  await store.set(KEY, overrides);
  return overrides;
}
