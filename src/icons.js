// Icônes au trait, insérées dans le HTML (accueil, fenêtre de réservation).
export const icon = (name, size = 18) => {
  const paths = {
    wifi: '<path d="M2.5 8.5a14 14 0 0 1 19 0M5.5 12a9.5 9.5 0 0 1 13 0M9 15.5a4.6 4.6 0 0 1 6 0"/><path d="M12 20h.01"/>',
    spark: '<path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
    fire: '<path d="M12 22c4.5 0 7-3.4 7-7.2 0-3.2-1.9-5.5-4.2-7.8.1 2.5-1.1 3.8-2.4 4.6.2-3.2-1.5-5.9-3.8-7.6.2 4.2-3.6 5.8-3.6 10.8C5.9 18.7 8.2 22 12 22Z"/>',
    utensils: '<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3v18M17 3c2 1.5 3 4 3 6.5S19 14.5 17 16"/>',
    parking: '<path d="M5 21V3h8a4 4 0 0 1 0 8H5"/>',
    broom: '<path d="m14 4 6 6M3 21l6.5-6.5M10 13l-3-3 7-7 3 3-7 7ZM3 21l4-9 5 5-9 4Z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    chevron: '<path d="m8 10 4 4 4-4"/>',
    star: '<path d="m12 2.7 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.3l6.2-.9L12 2.7Z"/>',
    pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 20v-1.5a5.5 5.5 0 0 1 11 0V20M16 5.5a3 3 0 0 1 0 5.8M20.5 20v-1.5a5.5 5.5 0 0 0-3.5-5.1"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.3 2.5 3.7 5.5 3.7 9s-1.4 6.5-3.7 9c-2.3-2.5-3.7-5.5-3.7-9s1.4-6.5 3.7-9Z"/>',
    badge: '<path d="m12 3 7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z"/><path d="m9 12 2 2 4-4"/>',
    ruler: '<path d="M3 16 16 3l5 5L8 21H3v-5Z"/><path d="m13.5 6.5 2 2M10 10l2 2M6.5 13.5l2 2"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m10.5 12.5 8-8M16 6l2 2M19 3l2 2"/>',
    chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.2 0-2.3-.2-3.4-.7L3 21l1.8-5.4A8.5 8.5 0 1 1 21 11.5Z"/>',
    map: '<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
    tag: '<path d="M20.6 12.6 12.6 20.6a2 2 0 0 1-2.8 0l-6.4-6.4a2 2 0 0 1 0-2.8L11.4 3.4A2 2 0 0 1 12.8 3H19a1 1 0 0 1 1 1v6.2a2 2 0 0 1-.4 1.4Z"/><circle cx="16" cy="8" r="1.5"/>',
    circleCheck: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.3 2.3 2.3 4.7-4.7"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};
