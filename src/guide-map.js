// Carte interactive du guide et des bonnes adresses : liste et carte synchronisées, filtres par thème.
// Leaflet n'est chargé que lorsque la section approche de l'écran.
const container = document.getElementById('guide-map');
const dataTag = document.getElementById('map-data');

if (container && dataTag) {
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    init(JSON.parse(dataTag.textContent));
  }, { rootMargin: '400px 0px' });
  observer.observe(container);
}

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const HOUSE_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 3 2.5 11h2.7v9h5.3v-6h3v6h5.3v-9h2.7z"/></svg>';
// Lieux éloignés (Étretat, Mont-Saint-Michel, fromagerie de Livarot) : la vue d'ensemble ne les cadre que si on filtre sur leur rubrique.
const FAR = new Set(['mont-saint-michel', 'etretat', 'graindorge']);

async function init(data) {
  const [{ default: L }] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
  const list = document.getElementById('map-list');
  const items = new Map([...list.querySelectorAll('li')].map((li) => [li.dataset.key, li]));
  const touch = window.matchMedia('(pointer: coarse)').matches;

  container.querySelector('.map-loading')?.remove();
  const map = L.map(container, { scrollWheelZoom: false, dragging: !touch, tap: false, zoomSnap: 0.25, attributionControl: true });
  // Tuiles OpenStreetMap (gratuites, sans clé) ; teintées en CSS pour s'accorder au site.
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  }).addTo(map);

  const pin = (className, html = '') => L.divIcon({ className: '', html: `<span class="${className}"><b>${html}</b></span>`, iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -14] });
  const house = L.marker(data.house.coords, { icon: pin('map-pin map-pin-house', HOUSE_SVG), zIndexOffset: 1000, keyboard: true, title: data.house.name })
    .addTo(map).bindPopup(`<div class="map-popup"><strong>${escapeHtml(data.house.name)}</strong><p>${escapeHtml(data.house.text)}</p></div>`);

  const markers = new Map();
  data.places.forEach((place, index) => {
    const marker = L.marker(place.coords, { icon: pin('map-pin', String(index + 1)), title: place.name, keyboard: true })
      .bindPopup(`<div class="map-popup">${place.photo ? `<img src="${place.photo}" alt="" width="240" height="160" loading="lazy" />` : ''}
        <div class="map-popup-body"><div class="map-popup-head"><strong>${place.directions ? `<a class="guide-place-link" href="${place.directions}" target="_blank" rel="noopener">${escapeHtml(place.name)}</a>` : escapeHtml(place.name)}</strong><span>${escapeHtml(place.time)}</span></div>
        <p>${escapeHtml(place.text)}</p></div></div>`, { maxWidth: 260, minWidth: 240 });
    marker.on('click', () => select(place.key, { fly: false }));
    marker.addTo(map);
    markers.set(place.key, { marker, place });
  });

  let filter = 'all';
  const visible = () => data.places.filter((place) => filter === 'all' || place.category === filter);
  function frame() {
    const shown = visible();
    const framed = filter === 'all' ? shown.filter((place) => !FAR.has(place.key)) : shown;
    const bounds = L.latLngBounds([data.house.coords, ...framed.map((place) => place.coords)]);
    map.flyToBounds(bounds, { padding: [36, 36], maxZoom: 11, duration: 0.6 });
  }

  function select(key, { fly = true } = {}) {
    items.forEach((li, k) => li.classList.toggle('active', k === key));
    markers.forEach(({ marker }, k) => marker.getElement()?.querySelector('.map-pin')?.classList.toggle('active', k === key));
    const entry = markers.get(key);
    if (!entry) return;
    const li = items.get(key);
    // Garde l'élément visible dans la liste (elle défile sur grand écran).
    if (li && list.scrollHeight > list.clientHeight) list.scrollTo({ top: li.offsetTop - list.offsetTop - 12, behavior: 'smooth' });
    if (fly) {
      map.flyTo(entry.place.coords, Math.max(map.getZoom(), 11), { duration: 0.7 });
      map.once('moveend', () => entry.marker.openPopup());
      // Sur téléphone, la carte est au-dessus de la liste : on la ramène à l'écran.
      if (window.matchMedia('(max-width: 860px)').matches) container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  items.forEach((li, key) => li.querySelector('button').addEventListener('click', () => select(key)));
  document.querySelectorAll('.map-filters [data-filter]').forEach((button) => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('.map-filters [data-filter]').forEach((other) => {
      other.classList.toggle('active', other === button);
      other.setAttribute('aria-pressed', String(other === button));
    });
    markers.forEach(({ marker, place }) => {
      const show = filter === 'all' || place.category === filter;
      if (show && !map.hasLayer(marker)) marker.addTo(map);
      if (!show && map.hasLayer(marker)) marker.remove();
      items.get(place.key).hidden = !show;
    });
    // Bonnes adresses : les rubriques sans adresse affichée disparaissent avec leur titre.
    document.querySelectorAll('[data-group]').forEach((group) => { group.hidden = filter !== 'all' && group.dataset.group !== filter; });
    map.closePopup();
    frame();
  }));

  map.fitBounds(L.latLngBounds([data.house.coords, ...data.places.filter((p) => !FAR.has(p.key)).map((p) => p.coords)]), { padding: [36, 36] });
}
