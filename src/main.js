const icon = (name, size = 18) => {
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

const amenities = [
  ['wifi', 'Wifi haut débit'], ['spark', 'Jacuzzi privé'], ['fire', 'Cheminée à bois'],
  ['utensils', 'Cuisine équipée'], ['parking', 'Parking gratuit'], ['broom', 'Ménage disponible']
];

const amenityCategories = [
  ['Extérieur', ['Jacuzzi privé toute l’année', 'Barbecue & ustensiles', 'Mobilier extérieur, chaises longues', 'Terrain clos et arboré de 8 000 m²']],
  ['Cuisine & repas', ['Cuisine américaine tout équipée', 'Réfrigérateur, congélateur, lave-vaisselle', 'Cafetière Nespresso & manuelle', 'Table à manger, grille-pain, blender']],
  ['Chambres & linge', ['Draps, serviettes et savon fournis', 'Lave-linge et sèche-linge gratuits', 'Fer à repasser, étendoir', 'Oreillers et couvertures supplémentaires']],
  ['Salle de bain', ['3 salles de bain', 'Sèche-cheveux', 'Eau chaude, gel douche, shampoing', 'Baignoire']],
  ['Divertissement & famille', ['TV HD 42" avec câble', 'Wifi haut débit', 'Table de ping-pong, livres', 'Lit bébé, chaise haute, jeux de société']],
  ['Chauffage & sécurité', ['Cheminée à bois', 'Pompe à chaleur', 'Détecteurs fumée & monoxyde de carbone', 'Trousse de premiers secours']],
  ['Services', ['Ménage disponible pendant le séjour', 'Arrivée autonome (boîte à clé)', 'Parking gratuit sur place', 'Animaux bienvenus sur demande']]
];

const spaces = [
  ['Pièce de vie', 'La table des longues tablées, le feu qui crépite et le jardin en horizon.', '/images/piece-de-vie.jpeg'],
  ['Cuisine', 'Une cuisine campagnarde tout équipée, prête pour les grandes tablées.', '/images/cuisine-2.avif'],
  ['Chambre olive', 'Une chambre douce et calme, à l’étage, sous les poutres.', '/images/chambre-1.avif'],
  ['Chambre lin', 'Un refuge lumineux pensé pour le repos après les escapades normandes.', '/images/chambre-2.avif'],
  ['Chambre brique', 'Un cocon de caractère où l’on entend à peine le jardin respirer.', '/images/chambre-3.avif'],
  ['Chambre ruisseau', 'La chambre ruisseau prolonge le confort de la maison pour toute la tribu.', '/images/chambre-4.avif'],
  ['Véranda', 'Un salon d’été baigné de lumière, ouvert sur le jardin en toute saison.', '/images/veranda.avif'],
  ['Coin du feu', 'Un brasero et des fauteuils profonds pour prolonger les soirées douces.', '/images/coin-du-feu.avif'],
  ['Ping-pong', 'Une partie de ping-pong face à la maison, pour petits et grands.', '/images/ping-pong.avif'],
  ['Terrasse', 'Transats et vue dégagée sur le jardin, pour paresser au soleil.', '/images/terrasse-transats.avif'],
  ['Les pâturages', 'La maison est entourée de pâturages où paissent les vaches normandes.', '/images/paturages.avif']
];

const nearbyItems = [
  ['Balades du pays d’Auge', 'Tout près', 'Des chemins creux entre pommiers et manoirs.', '/images/randonnee-pays-dauge.webp'],
  ['La route du cidre', '12 min', 'Calvados, vergers et rencontres de producteurs.', '/images/route-du-cidre.jpg'],
  ['Les plages de Cabourg', 'À 18 min', 'Le sable fin, les cabines rayées et le front de mer de la Belle Époque.', '/images/plage-cabourg.webp'],
  ['Deauville', '25 min', 'Flâner sur les planches et dîner sur le port.', '/images/deauville.webp']
];

const ratingCategories = [['Propreté', '4,8'], ['Emplacement', '4,8'], ['Qualité-prix', '4,8']];
const reviews = [
  ['ML', 'Marie L.', 'Août 2026', 'Un havre de paix pour notre tribu. Le jardin est immense, la maison a une âme et Claire est d’une attention rare.'],
  ['JD', 'Julien D.', 'Juillet 2026', 'Nos enfants ont adopté le ruisseau, nous avons adopté les apéros sous les pommiers. On reviendra, c’est sûr.'],
  ['AS', 'Anna S.', 'Mai 2026', 'La beauté des poutres, le feu de cheminée, le calme absolu. C’était exactement ce que nous cherchions.'],
  ['SR', 'Sophie R.', 'Juin 2026', 'Un accueil chaleureux du début à la fin. La maison est encore plus belle qu’en photo, et si bien équipée.'],
  ['TB', 'Thomas B.', 'Septembre 2025', 'L’extérieur est un vrai bonheur pour les enfants comme pour les adultes. On s’est sentis chez nous immédiatement.']
];

const days = ['L','M','M','J','V','S','D'];
const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

document.querySelector('#app').innerHTML = `
  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="La Maison Normande, accueil"><span class="brand-mark"><i></i><i></i></span><span>La Maison<br><em>Normande</em></span></a>
    <nav class="nav-links" aria-label="Navigation principale">
      <a href="#cadre">Le cadre</a><a href="#equipements">Équipements</a><a href="#chambres">Chambres</a><a href="#plan">Plan</a><a href="#avis">Avis</a><a href="#faq">FAQ</a>
    </nav>
    <button class="header-cta booking-trigger">Je réserve <span>${icon('arrow', 15)}</span></button>
    <button class="menu-toggle" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
  </header>

  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-image image-placeholder"><img src="/images/la-maison.jpeg" alt="La Maison Normande, maison à colombages au cœur du jardin" /></div>
      <div class="hero-wash"></div>
      <div class="hero-copy shell">
        <p class="eyebrow light"><span></span>Danestal, Pays d’Auge</p>
        <h1 id="hero-title">La Normandie,<br><em>en famille.</em></h1>
        <p class="hero-intro">Une maison à colombages, un jardin qui s’étire jusqu’au ruisseau et assez de place pour être ensemble.</p>
        <a href="#cadre" class="text-link light-link">Découvrir la maison ${icon('arrow', 17)}</a>
      </div>
      <aside class="booking-card" id="booking" aria-label="Réserver votre séjour">
        <div class="booking-top"><div><p class="booking-label">Votre séjour</p><h2>Choisir vos dates</h2></div><span class="booking-status"><i></i>Disponible</span></div>
        <div class="calendar-header"><button id="cal-prev" aria-label="Mois précédent">‹</button><strong id="cal-month"></strong><button id="cal-next" aria-label="Mois suivant">›</button></div>
        <div class="weekdays">${days.map(d => `<span>${d}</span>`).join('')}</div>
        <div class="calendar-grid" id="calendar-grid"></div>
        <div class="date-fields"><button><span>Arrivée</span><strong id="arrival-value">Sélectionner</strong></button><button><span>Départ</span><strong id="departure-value">Sélectionner</strong></button></div>
        <div class="guest-line"><span>${icon('users', 17)} Voyageurs</span><button class="guest-toggle"><strong id="guest-summary">2 adultes</strong>${icon('chevron', 15)}</button></div>
        <div class="guest-panel" hidden>
          <div><span>Adultes <small>13 ans et plus</small></span><p class="stepper"><button data-type="adults" data-change="-1">−</button><b id="adult-count">2</b><button data-type="adults" data-change="1">+</button></p></div>
          <div><span>Enfants <small>2 à 12 ans</small></span><p class="stepper"><button data-type="children" data-change="-1">−</button><b id="child-count">0</b><button data-type="children" data-change="1">+</button></p></div>
        </div>
        <button class="reserve-button" id="reserve">Réserver <span>à partir de 325 € / nuit</span></button>
        <p class="booking-note">Vous ne serez pas débité·e maintenant.</p>
      </aside>
      <div class="hero-bottom"><span>08 voyageurs max.</span><span>4 chambres · 7 lits · 3 salles de bain</span></div>
    </section>

    <section class="intro section shell" id="cadre">
      <div class="intro-collage" aria-label="Aperçus de la maison">
        <figure class="intro-photo one image-placeholder"><img src="/images/piece-de-vie.jpeg" alt="La pièce de vie de la maison" loading="lazy" /><figcaption>La pièce de vie, ouverte sur le jardin</figcaption></figure>
        <figure class="intro-photo two image-placeholder"><img src="/images/jardin-table.avif" alt="La terrasse et le jardin de la maison" loading="lazy" /><figcaption>Le jardin, côté terrasse</figcaption></figure>
        <div class="review-stamp"><strong>4,89<small>/5</small></strong><span>${icon('star', 13)} 264 avis vérifiés</span></div>
      </div>
      <div class="intro-copy">
        <p class="eyebrow"><span></span>Une maison qui rassemble</p>
        <h2>Les bonheurs simples<br>ont leur <em>adresse.</em></h2>
        <p>Cette maison de famille à colombages est nichée à Danestal, entre les vergers du pays d’Auge et les plages de la Côte Fleurie. Ici, les journées commencent dans la rosée et finissent près du feu.</p>
        <p>Le terrain clos et arboré de 8 000 m² laisse à chacun son espace, tandis que le ruisseau dessine doucement la lisière du jardin.</p>
        <a href="#chambres" class="text-link">Découvrir la maison ${icon('arrow', 17)}</a>
      </div>
    </section>

    <section class="amenities section" id="equipements"><div class="shell">
      <div class="centered-heading"><p class="eyebrow"><span></span>Tout ce qu’il faut</p><h2>Le confort, avec <em>l’âme</em> en plus.</h2></div>
      <div class="amenities-grid">${amenities.map(([i, label]) => `<div class="amenity"><span class="amenity-icon">${icon(i, 17)}</span><strong>${label}</strong></div>`).join('')}</div>
      <button class="outline-button" id="amenities-button" aria-haspopup="dialog">Voir tous les équipements ${icon('arrow', 16)}</button>
    </div></section>

    <div class="modal-backdrop" id="amenities-modal" hidden>
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-head"><h3 id="modal-title">Tout ce qui est inclus dans votre séjour</h3><button class="modal-close" id="modal-close" aria-label="Fermer">${icon('close', 18)}</button></div>
        <div class="modal-body">${amenityCategories.map(([category, items]) => `
          <section class="modal-category"><h4>${category}</h4>${items.map(item => `<div class="modal-item">${icon('check', 15)}<span>${item}</span></div>`).join('')}</section>
        `).join('')}</div>
      </div>
    </div>

    <section class="spaces section" id="chambres"><div class="shell">
      <div class="section-top"><div><p class="eyebrow"><span></span>La maison, pièce par pièce</p><h2>Des espaces pour<br><em>vivre longtemps.</em></h2></div><div class="carousel-controls"><button class="carousel-prev" aria-label="Précédent">←</button><span><b id="slide-index">01</b> <i></i> ${String(spaces.length).padStart(2,'0')}</span><button class="carousel-next" aria-label="Suivant">→</button></div></div>
      <div class="space-stage">
        <div class="space-image image-placeholder" id="space-image" role="button" tabindex="0" aria-label="Agrandir la photo"></div>
        <article class="space-caption"><p class="eyebrow"><span></span><span id="space-count"></span></p><h3 id="space-title"></h3><p id="space-text"></p><button class="text-link" id="open-gallery">Voir toutes les photos ${icon('arrow', 17)}</button></article>
      </div>
      <div class="space-thumbnails" id="space-thumbnails"></div>
    </div></section>

    <div class="modal-backdrop gallery-backdrop" id="gallery-modal" hidden>
      <button class="gallery-close" id="gallery-close" aria-label="Fermer la galerie">${icon('close', 20)}</button>
      <button class="gallery-nav prev" id="gallery-prev" aria-label="Photo précédente">${icon('arrow', 20)}</button>
      <figure class="gallery-figure">
        <img id="gallery-image" src="" alt="" />
        <figcaption><strong id="gallery-title"></strong><span id="gallery-count"></span></figcaption>
      </figure>
      <button class="gallery-nav next" id="gallery-next" aria-label="Photo suivante">${icon('arrow', 20)}</button>
    </div>

    <section class="host section"><div class="shell host-grid">
      <div class="host-portrait-wrap">
        <div class="host-portrait image-placeholder"><img src="/images/claire.avif" alt="Claire, votre hôte" loading="lazy" /></div>
        <div class="host-card">
          <strong>Claire</strong>
          <div class="host-fact">${icon('globe', 16)}<span>Français, Anglais</span></div>
          <div class="host-fact">${icon('pin', 16)}<span>Vit à Danestal, pays d’Auge</span></div>
          <div class="host-fact">${icon('badge', 16)}<span>Hôte depuis 6 ans</span></div>
        </div>
      </div>
      <div class="host-copy"><p class="eyebrow"><span></span>Bienvenue chez nous</p><blockquote>“J’ai imaginé cette maison comme un lieu où l’on pose les valises, et où le temps veut bien ralentir.”</blockquote><p>Avec son père Christophe, Claire veille sur cette maison normande depuis six ans. Elle vous partage volontiers son marché préféré, la meilleure route pour rejoindre la plage et les coins secrets du pays d’Auge.</p><a href="#booking" class="text-link booking-trigger">Réserver maintenant ${icon('arrow', 17)}</a></div>
    </div></section>

    <section class="floor-plan section" id="plan"><div class="shell">
      <div class="plan-heading"><p class="eyebrow light"><span></span>Visiter avant d’arriver</p><h2>Découvrez chaque<br>recoin de la <em>maison.</em></h2><p>Une maison à plusieurs rythmes : ceux qui lisent au salon, ceux qui préparent le dîner, ceux qui prennent l’air.</p></div>
      <div class="plan-tabs" role="tablist"><button class="active" data-floor="ground">Rez-de-chaussée</button><button data-floor="first">1er étage</button><button data-floor="second">2ème étage</button></div>
      <div class="house-plan" id="house-plan"></div>
      <div class="plan-key" id="plan-key"></div>
    </div></section>

    <section class="nearby section" id="nearby">
      <div class="nearby-scroller" id="nearby-scroller" style="height: calc(${nearbyItems.length} * 85vh)">
        <div class="nearby-sticky">
          <div class="shell">
            <div class="section-top"><div><p class="eyebrow"><span></span>Autour de Danestal</p><h2>Des échappées,<br>juste <em>à côté.</em></h2></div><a class="text-link booking-trigger" href="#booking">Préparer votre séjour ${icon('arrow', 17)}</a></div>
            <div class="nearby-pin-body">
              <div class="nearby-pin-image" id="nearby-pin-image">${nearbyItems.map(([title, , , img], i) => `<div class="nearby-pin-slide ${i === 0 ? 'active' : ''}" data-index="${i}" style="background-image:url('${img}')"></div>`).join('')}</div>
              <div class="nearby-pin-list" id="nearby-pin-list">${nearbyItems.map(([title, time, text], i) => `<article class="${i === 0 ? 'active' : ''}" data-index="${i}"><span class="nearby-no">0${i + 1}</span><div><h3>${title}</h3><p>${text}</p></div><span>${time}</span></article>`).join('')}</div>
            </div>
            <div class="nearby-pin-progress" id="nearby-pin-progress">${nearbyItems.map((_, i) => `<i class="${i === 0 ? 'active' : ''}"></i>`).join('')}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="reviews section" id="avis">
      <div class="shell reviews-lead"><p class="eyebrow"><span></span>Des séjours qui restent</p><h2>Ils en parlent<br><em>mieux que nous.</em></h2></div>
      <div class="shell reviews-stats">
        <div class="stat-block"><strong>264</strong><span>Avis</span></div>
        <div class="stat-block"><strong>4,89</strong><span class="stars">★★★★★</span></div>
        <div class="stat-bars">${ratingCategories.map(([label, score]) => `<div class="stat-bar-row"><span>${label}</span><span class="stat-bar"><i style="width:${Number(score.replace(',', '.')) / 5 * 100}%"></i></span><b>${score}</b></div>`).join('')}</div>
      </div>
      <div class="review-scroll-wrap">
        <div class="review-cards" id="review-cards">${reviews.concat(reviews).map(([initials, name, date, text], i) => `<article class="${i % reviews.length === 1 ? 'highlight' : ''}" aria-hidden="${i >= reviews.length ? 'true' : 'false'}"><div class="review-top"><span class="initials">${initials}</span><div><b>${name}</b><small>${date}</small></div><span class="stars">★★★★★</span></div><p>“${text}”</p></article>`).join('')}</div>
      </div>
    </section>

    <section class="faq section" id="faq"><div class="shell faq-grid"><div><p class="eyebrow"><span></span>Bon à savoir</p><h2>Tout ce qu’il faut<br>pour vous <em>projeter.</em></h2><p class="faq-intro">Une question avant de réserver ? Vous pouvez aussi écrire directement à Claire.</p><a class="outline-button small" href="mailto:bonjour@lamaisonnormande.fr">Contacter Claire ${icon('arrow', 16)}</a></div><div class="accordion"><details open><summary>Quels sont les horaires d’arrivée et de départ ? <span>${icon('plus',18)}</span></summary><p>Les arrivées se font à partir de 16h et les départs avant 11h. Une arrivée autonome peut être organisée sur demande.</p></details><details><summary>Combien de voyageurs la maison peut-elle accueillir ? <span>${icon('plus',18)}</span></summary><p>La maison accueille confortablement jusqu’à 8 voyageurs, avec quatre chambres, sept lits et trois salles de bain.</p></details><details><summary>Le ménage est-il inclus dans le séjour ? <span>${icon('plus',18)}</span></summary><p>Le ménage de fin de séjour est inclus. Un passage supplémentaire peut être réservé pendant votre séjour.</p></details><details><summary>Les animaux sont-ils acceptés ? <span>${icon('plus',18)}</span></summary><p>Vos compagnons sont les bienvenus sur demande préalable, afin de préparer au mieux leur arrivée.</p></details></div></div></section>

    <section class="final-cta"><div class="final-image image-placeholder"><img src="/images/les-alentours.jpeg" alt="Vue aérienne de la maison et de ses alentours" loading="lazy" /></div><div class="final-wash"></div><div class="shell final-copy"><p class="eyebrow light"><span></span>Danestal, Pays d’Auge</p><h2>Et si votre prochain<br>souvenir commençait <em>ici ?</em></h2><button class="reserve-button booking-trigger">Je réserve</button><p class="final-note">Réponse rapide via WhatsApp</p></div></section>
  </main>
  <footer><div class="shell footer-row"><a class="brand footer-brand" href="#top"><span class="brand-mark"><i></i><i></i></span><span>La Maison<br><em>Normande</em></span></a><p>Une maison de famille, à Danestal.</p><div><a href="#cadre">La maison</a><a href="#faq">Questions fréquentes</a><a href="mailto:bonjour@lamaisonnormande.fr">Contact</a></div></div><div class="shell footer-bottom"><span>© 2026 La Maison Normande</span><span>Réservation directe & sécurisée</span></div></footer>
  <div class="toast" role="status" aria-live="polite"></div>

  <div class="modal-backdrop" id="reserve-modal" hidden>
    <div class="modal-card reserve-card" role="dialog" aria-modal="true" aria-labelledby="reserve-modal-title">
      <div class="modal-head"><h3 id="reserve-modal-title">Je réserve</h3><button class="modal-close" id="reserve-modal-close" aria-label="Fermer">${icon('close', 18)}</button></div>
      <form class="reserve-form" id="reserve-form">
        <p class="reserve-form-intro">Un court message pré-rempli s’ouvrira dans WhatsApp — vous n’avez plus qu’à l’envoyer à Claire.</p>
        <label>Votre nom<input type="text" id="rf-name" name="name" required placeholder="Prénom et nom" /></label>
        <div class="reserve-form-row">
          <label>Arrivée<input type="date" id="rf-arrival" name="arrival" required /></label>
          <label>Départ<input type="date" id="rf-departure" name="departure" required /></label>
        </div>
        <label>Voyageurs<input type="number" id="rf-guests" name="guests" min="1" max="8" value="2" required /></label>
        <label>Message (facultatif)<textarea id="rf-message" name="message" rows="2" placeholder="Une précision à ajouter ?"></textarea></label>
        <button type="submit" class="reserve-button">Envoyer sur WhatsApp ${icon('arrow', 16)}</button>
      </form>
    </div>
  </div>
`;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

// Booking widget — real calendar: correct days per month, past dates locked, month navigation works
const today = new Date(); today.setHours(0, 0, 0, 0);
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let selected = [];

const isoOf = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const formatShort = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${monthNames[m - 1].slice(0, 3).toLowerCase()}.`; };
// No real booking data is connected — every future date is open. Wire this up to a real
// source (Airbnb iCal export, PMS API, etc.) if/when the house's actual availability matters.
const isUnavailableDate = () => false;
const showToast = (message) => { const toast = $('.toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3500); };

// True if any night strictly between two ISO dates falls on an already-booked day —
// a stay can't be reserved "through" a date someone else already holds.
function rangeCrossesBookedDate(startIso, endIso) {
  const cursor = new Date(startIso + 'T00:00:00');
  const end = new Date(endIso + 'T00:00:00');
  cursor.setDate(cursor.getDate() + 1);
  while (cursor < end) {
    if (isUnavailableDate(cursor)) return true;
    cursor.setDate(cursor.getDate() + 1);
  }
  return false;
}

function renderCalendar() {
  const firstWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday-first
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = Array(firstWeekday).fill(null).concat(Array.from({ length: totalDays }, (_, i) => i + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  $('#cal-month').textContent = `${monthNames[viewMonth]} ${viewYear}`;
  $('#cal-prev').disabled = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  $('#calendar-grid').innerHTML = cells.map(day => {
    if (!day) return '<span></span>';
    const cellDate = new Date(viewYear, viewMonth, day);
    const iso = isoOf(viewYear, viewMonth, day);
    const isPast = cellDate < today;
    const isBooked = !isPast && isUnavailableDate(cellDate);
    const disabled = isPast || isBooked;
    const isSelected = selected.includes(iso);
    const inRange = selected.length === 2 && iso > selected[0] && iso < selected[1];
    return `<button class="calendar-day ${isBooked ? 'unavailable' : ''} ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''} ${inRange ? 'in-range' : ''}" data-date="${iso}" ${disabled ? 'disabled' : ''}>${day}</button>`;
  }).join('');

  $$('.calendar-day:not([disabled])').forEach(day => day.addEventListener('click', () => {
    const iso = day.dataset.date;
    if (selected.length === 2) selected = [];
    selected.push(iso);
    selected.sort();
    if (selected.length === 2) {
      if (rangeCrossesBookedDate(selected[0], selected[1])) {
        showToast('Séjour impossible : une nuit déjà réservée se trouve dans cette période.');
        selected = [iso];
        $('#arrival-value').textContent = formatShort(iso);
        $('#departure-value').textContent = 'Sélectionner';
      } else {
        $('#arrival-value').textContent = formatShort(selected[0]);
        $('#departure-value').textContent = formatShort(selected[1]);
      }
    } else {
      $('#arrival-value').textContent = formatShort(iso);
      $('#departure-value').textContent = 'Sélectionner';
    }
    renderCalendar();
  }));
}

$('#cal-prev').addEventListener('click', () => {
  if ($('#cal-prev').disabled) return;
  viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  renderCalendar();
});
$('#cal-next').addEventListener('click', () => {
  viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderCalendar();
});
renderCalendar();

let guests = { adults: 2, children: 0 };

$('.guest-toggle').addEventListener('click', () => { const panel = $('.guest-panel'); panel.hidden = !panel.hidden; });
$$('.stepper button').forEach(button => button.addEventListener('click', () => {
  const type = button.dataset.type; const next = guests[type] + Number(button.dataset.change);
  if (next < 0 || (type === 'adults' && next < 1) || guests.adults + guests.children + (next - guests[type]) > 8) return;
  guests[type] = next; $(`#${type === 'adults' ? 'adult' : 'child'}-count`).textContent = next;
  $('#guest-summary').textContent = `${guests.adults} adulte${guests.adults > 1 ? 's' : ''}${guests.children ? `, ${guests.children} enfant${guests.children > 1 ? 's' : ''}` : ''}`;
}));

// Reservation modal: every "Je réserve" CTA opens a short form that hands off to WhatsApp.
const WHATSAPP_NUMBER = '33611109870'; // test number — replace with the owner's real number when confirmed
const reserveModal = $('#reserve-modal');
const openReserveModal = () => {
  if (selected.length === 2) { $('#rf-arrival').value = selected[0]; $('#rf-departure').value = selected[1]; }
  $('#rf-guests').value = guests.adults + guests.children;
  reserveModal.hidden = false;
  document.body.style.overflow = 'hidden';
  $('#rf-name').focus();
};
const closeReserveModal = () => { reserveModal.hidden = true; document.body.style.overflow = ''; };
$$('.booking-trigger').forEach(button => button.addEventListener('click', (event) => { event.preventDefault(); openReserveModal(); }));
$('#reserve').addEventListener('click', openReserveModal);
$('#reserve-modal-close').addEventListener('click', closeReserveModal);
reserveModal.addEventListener('click', (event) => { if (event.target === reserveModal) closeReserveModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !reserveModal.hidden) closeReserveModal(); });

$('#reserve-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = $('#rf-name').value.trim();
  const arrival = $('#rf-arrival').value;
  const departure = $('#rf-departure').value;
  const guestCount = $('#rf-guests').value;
  const extra = $('#rf-message').value.trim();
  const formatFull = (iso) => { if (!iso) return '—'; const [y, m, d] = iso.split('-').map(Number); return `${d} ${monthNames[m - 1].toLowerCase()} ${y}`; };
  let message = `Bonjour Claire, je souhaite réserver La Maison Normande du ${formatFull(arrival)} au ${formatFull(departure)} pour ${guestCount} voyageur${guestCount > 1 ? 's' : ''}. Mon nom : ${name}.`;
  if (extra) message += ` ${extra}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  closeReserveModal();
});

// Spaces carousel
const spacesTotal = String(spaces.length).padStart(2,'0');
const galleryModal = $('#gallery-modal');
let activeSpace = 0;
function renderSpace() {
  const [title, text, image] = spaces[activeSpace];
  $('#space-image').innerHTML = `<img src="${image}" alt="${title} de La Maison Normande" loading="lazy" />`; $('#space-title').textContent = title; $('#space-text').textContent = text;
  $('#space-count').textContent = `${String(activeSpace + 1).padStart(2,'0')} — ${spacesTotal}`; $('#slide-index').textContent = String(activeSpace + 1).padStart(2,'0');
  $('#space-thumbnails').innerHTML = spaces.map(([title,,image], i) => `<button class="space-thumb ${i===activeSpace?'active':''}" data-space="${i}" aria-label="${title}"><img src="${image}" alt="" /><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');
  $$('.space-thumb').forEach(button => button.addEventListener('click', () => { activeSpace = Number(button.dataset.space); renderSpace(); if (!galleryModal.hidden) renderGallery(); }));
  if (galleryModal && !galleryModal.hidden) renderGallery();
}
$('.carousel-prev').addEventListener('click', () => { activeSpace = (activeSpace + spaces.length - 1) % spaces.length; renderSpace(); });
$('.carousel-next').addEventListener('click', () => { activeSpace = (activeSpace + 1) % spaces.length; renderSpace(); });
renderSpace();

// Photo gallery (opens from the "chambres" block: click the main photo or "Voir toutes les photos")
function renderGallery() {
  const [title, , image] = spaces[activeSpace];
  $('#gallery-image').src = image; $('#gallery-image').alt = `${title} de La Maison Normande`;
  $('#gallery-title').textContent = title;
  $('#gallery-count').textContent = `${String(activeSpace + 1).padStart(2,'0')} / ${spacesTotal}`;
}
const openGallery = () => { renderGallery(); galleryModal.hidden = false; document.body.style.overflow = 'hidden'; $('#gallery-close').focus(); };
const closeGallery = () => { galleryModal.hidden = true; document.body.style.overflow = ''; $('#open-gallery').focus(); };
$('#space-image').addEventListener('click', openGallery);
$('#space-image').addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openGallery(); } });
$('#open-gallery').addEventListener('click', openGallery);
$('#gallery-close').addEventListener('click', closeGallery);
galleryModal.addEventListener('click', (event) => { if (event.target === galleryModal) closeGallery(); });
$('#gallery-prev').addEventListener('click', () => { activeSpace = (activeSpace + spaces.length - 1) % spaces.length; renderGallery(); renderSpace(); });
$('#gallery-next').addEventListener('click', () => { activeSpace = (activeSpace + 1) % spaces.length; renderGallery(); renderSpace(); });
document.addEventListener('keydown', (event) => {
  if (galleryModal.hidden) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowLeft') $('#gallery-prev').click();
  if (event.key === 'ArrowRight') $('#gallery-next').click();
});

// Floor plan
const floorData = {
  ground: [
    ['01','Entrée','entry','sm','/images/maison-exterieur-jardin.avif','8 m²','—'],
    ['02','Salon & cheminée','living','lg','/images/piece-de-vie.jpeg','38 m²','8 pers.'],
    ['03','Cuisine','kitchen','wd','/images/cuisine-1.avif','18 m²','6 pers.'],
    ['04','Salle à manger','dining','wd','/images/piece-de-vie.jpeg','20 m²','10 pers.'],
    ['05','Chambre olive','bed1','wd','/images/chambre-1.avif','18 m²','2 pers.'],
    ['06','Salle de bain','bath0','sm','/images/salle-de-bain.avif','6 m²','—'],
    ['07','Terrasse & jardin','terrace','lg','/images/jardin-terrasse.avif','8 000 m²','20 pers.'],
    ['08','Véranda','veranda','wd','/images/veranda.avif','16 m²','8 pers.'],
    ['09','Coin du feu','firepit','sm','/images/coin-du-feu.avif','—','6 pers.'],
    ['10','Ping-pong','pingpong','sm','/images/ping-pong.avif','—','4 pers.']
  ],
  first: [
    ['01','Chambre lin','bed2','wd','/images/chambre-2.avif','16 m²','2 pers.'],
    ['02','Chambre brique','bed3','wd','/images/chambre-3.avif','20 m²','2 pers.'],
    ['03','Salle de bain','bath','sm','/images/salle-de-bain.avif','6 m²','—']
  ],
  second: [
    ['01','Chambre ruisseau','bed4','lg','/images/chambre-4.avif','15 m²','2 pers.'],
    ['02','Salle de bain','bath2','sm','/images/salle-de-bain.avif','5 m²','—']
  ]
};
function renderFloor(floor = 'ground') {
  const rooms = floorData[floor];
  $('#house-plan').innerHTML = rooms.map(([n,name,cls,gridSize,img,area,capacity]) => `
    <div class="room ${cls} size-${gridSize}" tabindex="0" role="button" aria-expanded="false" aria-label="Voir les détails : ${name}">
      <span class="room-dot" aria-hidden="true"></span>
      <span class="room-label"><b aria-hidden="true">${n}</b><strong>${name}</strong></span>
      <div class="room-card" aria-hidden="true">
        <div class="room-card-image image-placeholder"><img src="${img}" alt="" loading="lazy" /></div>
        <div class="room-card-body"><strong>${name}</strong><div class="room-card-meta"><span>${icon('ruler', 13)} ${area}</span><span>${icon('users', 13)} ${capacity}</span></div></div>
      </div>
    </div>`).join('');
  $('#plan-key').innerHTML = rooms.map(([n,name]) => `<span><b>${n}</b>${name}</span>`).join('');
  $$('.room').forEach(room => {
    const toggle = () => { const open = room.classList.toggle('open'); room.setAttribute('aria-expanded', String(open)); };
    room.addEventListener('click', toggle);
    room.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } });
  });
}
$$('.plan-tabs button').forEach(button => button.addEventListener('click', () => { $$('.plan-tabs button').forEach(b => b.classList.toggle('active', b === button)); renderFloor(button.dataset.floor); }));
renderFloor();

// Amenities modal
const modal = $('#amenities-modal');
const openModal = () => { modal.hidden = false; document.body.style.overflow = 'hidden'; $('#modal-close').focus(); };
const closeModal = () => { modal.hidden = true; document.body.style.overflow = ''; $('#amenities-button').focus(); };
$('#amenities-button').addEventListener('click', openModal);
$('#modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });

$('.menu-toggle').addEventListener('click', () => { $('.nav-links').classList.toggle('open'); $('.menu-toggle').classList.toggle('open'); });
$$('.nav-links a').forEach(link => link.addEventListener('click', () => $('.nav-links').classList.remove('open')));

// Hero parallax
const heroImg = document.querySelector('.hero-image img');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroImg && !reduceMotion) {
  const hero = $('.hero');
  let ticking = false;
  const updateParallax = () => {
    const rect = hero.getBoundingClientRect();
    const maxShift = rect.height * 0.09;
    const offset = Math.max(-maxShift, Math.min(maxShift, rect.top * -0.15));
    heroImg.style.transform = `translateY(${offset}px) scale(1.22)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; } }, { passive: true });
  updateParallax();
}

// Nearby: pinned scroll section — the block stays in view while scrolling reveals one
// activity at a time; once the last one has shown, the page continues to the next section.
const nearbyScroller = $('#nearby-scroller');
if (nearbyScroller) {
  const nearbySlides = $$('.nearby-pin-slide');
  const nearbyListItems = $$('#nearby-pin-list > article');
  const nearbyDots = $$('#nearby-pin-progress > i');
  const nearbyTotal = nearbyItems.length;
  const nearbyHeaderOffset = 76;
  let nearbyActive = 0;

  const setNearbyActive = (index) => {
    if (index === nearbyActive) return;
    nearbyActive = index;
    nearbySlides.forEach(el => el.classList.toggle('active', Number(el.dataset.index) === index));
    nearbyListItems.forEach(el => el.classList.toggle('active', Number(el.dataset.index) === index));
    nearbyDots.forEach((el, i) => el.classList.toggle('active', i === index));
  };

  let nearbyTicking = false;
  const updateNearbyScroll = () => {
    const rect = nearbyScroller.getBoundingClientRect();
    const scrollable = Math.max(rect.height - window.innerHeight + nearbyHeaderOffset, 1);
    const progressed = Math.min(Math.max(-rect.top + nearbyHeaderOffset, 0), scrollable);
    const ratio = progressed / scrollable;
    const index = Math.min(nearbyTotal - 1, Math.floor(ratio * nearbyTotal));
    setNearbyActive(index);
    nearbyTicking = false;
  };
  window.addEventListener('scroll', () => { if (!nearbyTicking) { requestAnimationFrame(updateNearbyScroll); nearbyTicking = true; } }, { passive: true });
  updateNearbyScroll();
}

// Scroll reveal: titles, copy and card groups fade + rise into place as they enter the viewport
$$('.amenities-grid, .review-cards, .accordion').forEach(group => group.classList.add('reveal-group'));
const revealEls = $$([
  '.hero h1', '.hero-intro', '.hero .text-link',
  '.eyebrow', '.section h2', '.intro-copy > p:not(.eyebrow)',
  '.amenities-grid > .amenity',
  '.host-copy blockquote', '.host-copy > p:not(.eyebrow)', '.host-portrait-wrap',
  '.plan-heading > *:not(.eyebrow)',
  '.reviews-stats', '.review-cards > article',
  '.faq-intro', '.accordion > details',
  '.final-copy > *:not(.eyebrow)'
].join(', '));
if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('reveal', 'in-view'));
} else {
  revealEls.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
}
