// Ajuste la hauteur des zones de texte à leur contenu : tout le texte reste visible, sans barre de défilement.
export function fit(textarea) {
  if (!textarea.offsetParent) return; // masquée (section repliée) : on mesurera à l'ouverture
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight + 2}px`;
}

export function autosize(root) {
  root.querySelectorAll('textarea').forEach((textarea) => {
    fit(textarea);
    textarea.addEventListener('input', () => fit(textarea));
  });
  root.querySelectorAll('details').forEach((details) => details.addEventListener('toggle', () => {
    if (details.open) details.querySelectorAll('textarea').forEach(fit);
  }));
}

// La largeur change (fenêtre redimensionnée) : les lignes aussi.
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => document.querySelectorAll('textarea').forEach(fit), 150);
});
