// Grille tarifaire réglée dans l'onglet Tarifs de l'admin (src/pricing.js pour le format et le calcul).
import { get, set } from './store.js';
import { cleanGrid, DEFAULT_GRID } from '../../src/pricing.js';

const KEY = 'pricing:grid';

export async function getGrid() {
  return cleanGrid(await get(KEY)) || DEFAULT_GRID;
}

// Renvoie la grille enregistrée, ou null si elle est invalide.
export async function saveGrid(input) {
  const grid = cleanGrid(input);
  if (!grid) return null;
  await set(KEY, { ...grid, updatedAt: Date.now() });
  return grid;
}
