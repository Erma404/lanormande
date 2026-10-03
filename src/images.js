// Images adaptées à l'écran : le navigateur choisit la plus petite version suffisante.
import { IMAGE_SIZES } from './image-sizes.js';

const variantUrl = (stem, width) => `/images/r/${stem}-${width}.webp`;

// « srcset » : versions réduites + original à sa largeur réelle.
export function srcset(src) {
  const info = IMAGE_SIZES[src];
  if (!info) return '';
  return [...info.widths.map((w) => `${variantUrl(info.stem, w)} ${w}w`), `${src} ${info.width}w`].join(', ');
}

// Une seule image à une largeur donnée (fonds CSS, vignettes) : la plus petite version assez large.
export function sized(src, width) {
  const info = IMAGE_SIZES[src];
  if (!info) return src;
  const w = info.widths.find((x) => x >= width);
  return w ? variantUrl(info.stem, w) : src;
}

// Attributs src/srcset/sizes prêts à insérer dans une balise <img>.
export function imgAttrs(src, sizes) {
  const set = srcset(src);
  return set ? `src="${src}" srcset="${set}" sizes="${sizes}"` : `src="${src}"`;
}
