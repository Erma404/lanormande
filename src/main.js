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

// ---------------------------------------------------------------------------
// i18n content. Every visible string lives here, split fr/en. Data that isn't
// language-dependent (image paths, css classes, grid sizes, icon keys) stays
// out of this object and is shared by both languages further down.
// ---------------------------------------------------------------------------
const content = {
  fr: {
    meta: { title: 'La Maison Normande — Danestal', description: 'La Maison Normande — une maison de famille à Danestal, au cœur du pays d’Auge.' },
    nav: { cadre: 'Le cadre', equipements: 'Équipements', chambres: 'Chambres', plan: 'Plan', avis: 'Avis', faq: 'FAQ' },
    brandAria: 'La Maison Normande, accueil',
    headerCta: 'Je réserve',
    menuAria: 'Ouvrir le menu',
    langToggleLabel: 'EN',
    langToggleAria: 'Switch to English',
    hero: {
      eyebrow: 'Danestal, Pays d’Auge',
      titleLine1: 'La Normandie,', titleEm: 'en famille.',
      imageAlt: 'La Maison Normande, maison à colombages au cœur du jardin',
      intro: 'Une maison à colombages, un jardin qui s’étire jusqu’au ruisseau et assez de place pour être ensemble.',
      discover: 'Découvrir la maison',
      travelers: '08 voyageurs max.',
      specs: '4 chambres · 7 lits · 3 salles de bain'
    },
    booking: {
      aria: 'Réserver votre séjour', label: 'Votre séjour', title: 'Choisir vos dates', status: 'Disponible',
      prevAria: 'Mois précédent', nextAria: 'Mois suivant',
      arrival: 'Arrivée', departure: 'Départ', select: 'Sélectionner',
      travelers: 'Voyageurs', adults: 'Adultes', adultsSub: '13 ans et plus', children: 'Enfants', childrenSub: '2 à 12 ans',
      reserve: 'Réserver', fromPrice: 'à partir de 325 € / nuit', note: 'Vous ne serez pas débité·e maintenant.',
      adultWord: (n) => `adulte${n > 1 ? 's' : ''}`, childWord: (n) => `enfant${n > 1 ? 's' : ''}`
    },
    cadre: {
      photoOneAlt: 'La pièce de vie de la maison', photoOneCaption: 'La pièce de vie, ouverte sur le jardin',
      photoTwoAlt: 'La terrasse et le jardin de la maison', photoTwoCaption: 'Le jardin, côté terrasse',
      overallRating: '4,89', reviewsVerified: '264 avis vérifiés',
      eyebrow: 'Une maison qui rassemble',
      h2: 'Les bonheurs simples<br>ont leur <em>adresse.</em>',
      p1: 'Cette maison de famille à colombages est nichée à Danestal, entre les vergers du pays d’Auge et les plages de la Côte Fleurie. Ici, les journées commencent dans la rosée et finissent près du feu.',
      p2: 'Le terrain clos et arboré de 8 000 m² laisse à chacun son espace, tandis que le ruisseau dessine doucement la lisière du jardin.',
      link: 'Découvrir la maison'
    },
    amenitiesSection: {
      eyebrow: 'Tout ce qu’il faut', h2: 'Le confort, avec <em>l’âme</em> en plus.',
      seeAll: 'Voir tous les équipements', modalTitle: 'Tout ce qui est inclus dans votre séjour', closeAria: 'Fermer'
    },
    amenities: [
      ['wifi', 'Wifi haut débit'], ['spark', 'Jacuzzi privé'], ['fire', 'Cheminée à bois'],
      ['utensils', 'Cuisine équipée'], ['parking', 'Parking gratuit'], ['broom', 'Ménage disponible']
    ],
    amenityCategories: [
      ['Extérieur', ['Jacuzzi privé toute l’année', 'Barbecue & ustensiles', 'Mobilier extérieur, chaises longues', 'Terrain clos et arboré de 8 000 m²']],
      ['Cuisine & repas', ['Cuisine américaine tout équipée', 'Réfrigérateur, congélateur, lave-vaisselle', 'Cafetière Nespresso & manuelle', 'Table à manger, grille-pain, blender']],
      ['Chambres & linge', ['Draps, serviettes et savon fournis', 'Lave-linge et sèche-linge gratuits', 'Fer à repasser, étendoir', 'Oreillers et couvertures supplémentaires']],
      ['Salle de bain', ['3 salles de bain', 'Sèche-cheveux', 'Eau chaude, gel douche, shampoing', 'Baignoire']],
      ['Divertissement & famille', ['TV HD 42" avec câble', 'Wifi haut débit', 'Table de ping-pong, livres', 'Lit bébé, chaise haute, jeux de société']],
      ['Chauffage & sécurité', ['Cheminée à bois', 'Pompe à chaleur', 'Détecteurs fumée & monoxyde de carbone', 'Trousse de premiers secours']],
      ['Services', ['Ménage disponible pendant le séjour', 'Arrivée autonome (boîte à clé)', 'Parking gratuit sur place', 'Animaux bienvenus sur demande']]
    ],
    spacesSection: {
      eyebrow: 'La maison, pièce par pièce', h2: 'Des espaces pour<br><em>vivre longtemps.</em>',
      prevAria: 'Précédent', nextAria: 'Suivant', imageAria: 'Agrandir la photo', seeAllPhotos: 'Voir toutes les photos',
      imageAltSuffix: (title) => `${title} de La Maison Normande`,
      galleryCloseAria: 'Fermer la galerie', galleryPrevAria: 'Photo précédente', galleryNextAria: 'Photo suivante'
    },
    spaces: [
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
    ],
    host: {
      portraitAlt: 'Claire, votre hôte', name: 'Claire', languages: 'Français, Anglais',
      lives: 'Vit à Danestal, pays d’Auge', years: 'Hôte depuis 6 ans',
      eyebrow: 'Bienvenue chez nous',
      quote: '“J’ai imaginé cette maison comme un lieu où l’on pose les valises, et où le temps veut bien ralentir.”',
      bio: 'Avec son père Christophe, Claire veille sur cette maison normande depuis six ans. Elle vous partage volontiers son marché préféré, la meilleure route pour rejoindre la plage et les coins secrets du pays d’Auge.',
      cta: 'Réserver maintenant'
    },
    floorPlan: {
      eyebrow: 'Visiter avant d’arriver', h2: 'Découvrez chaque<br>recoin de la <em>maison.</em>',
      p: 'Une maison à plusieurs rythmes : ceux qui lisent au salon, ceux qui préparent le dîner, ceux qui prennent l’air.',
      tabs: { ground: 'Rez-de-chaussée', first: '1er étage', second: '2ème étage' },
      roomDetailsAria: (name) => `Voir les détails : ${name}`,
      guestsWord: (n) => `${n} pers.`
    },
    roomNames: {
      entry: 'Entrée', living: 'Salon & cheminée', kitchen: 'Cuisine', dining: 'Salle à manger', bed1: 'Chambre olive',
      bath0: 'Salle de bain', terrace: 'Terrasse & jardin', veranda: 'Véranda', firepit: 'Coin du feu', pingpong: 'Ping-pong',
      bed2: 'Chambre lin', bed3: 'Chambre brique', bath: 'Salle de bain', bed4: 'Chambre ruisseau', bath2: 'Salle de bain'
    },
    nearbySection: { eyebrow: 'Autour de Danestal', h2: 'Des échappées,<br>juste <em>à côté.</em>', cta: 'Préparer votre séjour' },
    nearbyItems: [
      ['Balades du pays d’Auge', 'Tout près', 'Des chemins creux entre pommiers et manoirs.', '/images/randonnee-pays-dauge.webp'],
      ['La route du cidre', '12 min', 'Calvados, vergers et rencontres de producteurs.', '/images/route-du-cidre.jpg'],
      ['Les plages de Cabourg', 'À 18 min', 'Le sable fin, les cabines rayées et le front de mer de la Belle Époque.', '/images/plage-cabourg.webp'],
      ['Deauville', '25 min', 'Flâner sur les planches et dîner sur le port.', '/images/deauville.webp']
    ],
    reviewsSection: {
      eyebrow: 'Des séjours qui restent', h2: 'Ils en parlent<br><em>mieux que nous.</em>',
      count: '264', countLabel: 'Avis', overallRating: '4,89'
    },
    ratingCategories: [['Propreté', '4,8'], ['Emplacement', '4,8'], ['Qualité-prix', '4,8']],
    reviews: [
      ['ML', 'Marie L.', 'Août 2026', 'Un havre de paix pour notre tribu. Le jardin est immense, la maison a une âme et Claire est d’une attention rare.'],
      ['JD', 'Julien D.', 'Juillet 2026', 'Nos enfants ont adopté le ruisseau, nous avons adopté les apéros sous les pommiers. On reviendra, c’est sûr.'],
      ['AS', 'Anna S.', 'Mai 2026', 'La beauté des poutres, le feu de cheminée, le calme absolu. C’était exactement ce que nous cherchions.'],
      ['SR', 'Sophie R.', 'Juin 2026', 'Un accueil chaleureux du début à la fin. La maison est encore plus belle qu’en photo, et si bien équipée.'],
      ['TB', 'Thomas B.', 'Septembre 2025', 'L’extérieur est un vrai bonheur pour les enfants comme pour les adultes. On s’est sentis chez nous immédiatement.']
    ],
    faqSection: { eyebrow: 'Bon à savoir', h2: 'Tout ce qu’il faut<br>pour vous <em>projeter.</em>', intro: 'Une question avant de réserver ? Vous pouvez aussi écrire directement à Claire.', contact: 'Contacter Claire' },
    faq: [
      ['Quels sont les horaires d’arrivée et de départ ?', 'Les arrivées se font à partir de 16h et les départs avant 11h. Une arrivée autonome peut être organisée sur demande.'],
      ['Combien de voyageurs la maison peut-elle accueillir ?', 'La maison accueille confortablement jusqu’à 8 voyageurs, avec quatre chambres, sept lits et trois salles de bain.'],
      ['Le ménage est-il inclus dans le séjour ?', 'Le ménage de fin de séjour est inclus. Un passage supplémentaire peut être réservé pendant votre séjour.'],
      ['Les animaux sont-ils acceptés ?', 'Vos compagnons sont les bienvenus sur demande préalable, afin de préparer au mieux leur arrivée.']
    ],
    finalCta: {
      eyebrow: 'Danestal, Pays d’Auge', h2: 'Et si votre prochain<br>souvenir commençait <em>ici ?</em>',
      imageAlt: 'Vue aérienne de la maison et de ses alentours', button: 'Je réserve', note: 'Réponse rapide via WhatsApp'
    },
    footer: { tagline: 'Une maison de famille, à Danestal.', linkHouse: 'La maison', linkFaq: 'Questions fréquentes', linkContact: 'Contact', copyright: '© 2026 La Maison Normande', bottomNote: 'Réservation directe & sécurisée' },
    reserveModal: {
      title: 'Je réserve', intro: 'Un court message pré-rempli s’ouvrira dans WhatsApp — vous n’avez plus qu’à l’envoyer à Claire.',
      name: 'Votre nom', namePlaceholder: 'Prénom et nom', arrival: 'Arrivée', departure: 'Départ', guests: 'Voyageurs',
      message: 'Message (facultatif)', messagePlaceholder: 'Une précision à ajouter ?', submit: 'Envoyer sur WhatsApp'
    },
    toast: { conflict: 'Séjour impossible : une nuit déjà réservée se trouve dans cette période.' },
    whatsapp: (name, arrival, departure, guestCount) => `Bonjour Claire, je souhaite réserver La Maison Normande du ${arrival} au ${departure} pour ${guestCount} voyageur${guestCount > 1 ? 's' : ''}. Mon nom : ${name}.`,
    days: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    formatShort: (day, monthAbbr) => `${day} ${monthAbbr}.`,
    formatFull: (day, month, year) => `${day} ${month} ${year}`
  },
  en: {
    meta: { title: 'La Maison Normande — Danestal, Normandy', description: 'La Maison Normande — a family house in Danestal, in the heart of the Pays d’Auge, Normandy.' },
    nav: { cadre: 'The House', equipements: 'Amenities', chambres: 'Rooms', plan: 'Floor Plan', avis: 'Reviews', faq: 'FAQ' },
    brandAria: 'La Maison Normande, home',
    headerCta: 'Book now',
    menuAria: 'Open menu',
    langToggleLabel: 'FR',
    langToggleAria: 'Passer en français',
    hero: {
      eyebrow: 'Danestal, Normandy',
      titleLine1: 'Normandy,', titleEm: 'as a family.',
      imageAlt: 'La Maison Normande, a half-timbered house at the heart of the garden',
      intro: 'A half-timbered farmhouse, a garden that stretches down to the stream, and room enough for everyone.',
      discover: 'Discover the house',
      travelers: 'Up to 8 guests',
      specs: '4 bedrooms · 7 beds · 3 bathrooms'
    },
    booking: {
      aria: 'Book your stay', label: 'Your stay', title: 'Choose your dates', status: 'Available',
      prevAria: 'Previous month', nextAria: 'Next month',
      arrival: 'Check-in', departure: 'Check-out', select: 'Select',
      travelers: 'Guests', adults: 'Adults', adultsSub: 'Ages 13+', children: 'Children', childrenSub: 'Ages 2–12',
      reserve: 'Book', fromPrice: 'from €325 / night', note: 'You won’t be charged yet.',
      adultWord: (n) => `adult${n > 1 ? 's' : ''}`, childWord: (n) => n > 1 ? 'children' : 'child'
    },
    cadre: {
      photoOneAlt: 'The living room of the house', photoOneCaption: 'The living room, open to the garden',
      photoTwoAlt: 'The terrace and garden of the house', photoTwoCaption: 'The garden, terrace side',
      overallRating: '4.89', reviewsVerified: '264 verified reviews',
      eyebrow: 'A house that brings people together',
      h2: 'Simple joys<br>have their <em>home.</em>',
      p1: 'This half-timbered family house is tucked away in Danestal, between the orchards of the Pays d’Auge and the beaches of the Côte Fleurie. Here, days begin in the morning dew and end by the fire.',
      p2: 'The enclosed, tree-lined 8,000 m² grounds give everyone their own space, while a gentle stream traces the edge of the garden.',
      link: 'Discover the house'
    },
    amenitiesSection: {
      eyebrow: 'Everything you need', h2: 'All the comforts, with <em>character</em> too.',
      seeAll: 'See all amenities', modalTitle: 'Everything included in your stay', closeAria: 'Close'
    },
    amenities: [
      ['wifi', 'High-speed wifi'], ['spark', 'Private hot tub'], ['fire', 'Wood fireplace'],
      ['utensils', 'Fully equipped kitchen'], ['parking', 'Free parking'], ['broom', 'Housekeeping available']
    ],
    amenityCategories: [
      ['Outdoors', ['Private hot tub, year-round', 'Barbecue & grilling utensils', 'Outdoor furniture & loungers', 'Enclosed, tree-lined 8,000 m² grounds']],
      ['Kitchen & dining', ['Fully equipped open kitchen', 'Fridge, freezer, dishwasher', 'Nespresso & filter coffee makers', 'Dining table, toaster, blender']],
      ['Bedrooms & linen', ['Linens, towels and soap provided', 'Free washer and dryer', 'Iron & drying rack', 'Extra pillows and blankets']],
      ['Bathrooms', ['3 bathrooms', 'Hair dryer', 'Hot water, shower gel, shampoo', 'Bathtub']],
      ['Entertainment & family', ['42" HD TV with cable', 'High-speed wifi', 'Ping-pong table, books', 'Travel crib, high chair, board games']],
      ['Heating & safety', ['Wood fireplace', 'Heat pump', 'Smoke & carbon monoxide detectors', 'First aid kit']],
      ['Services', ['Housekeeping available during your stay', 'Self check-in (lock box)', 'Free on-site parking', 'Pets welcome on request']]
    ],
    spacesSection: {
      eyebrow: 'The house, room by room', h2: 'Spaces made to<br><em>settle into.</em>',
      prevAria: 'Previous', nextAria: 'Next', imageAria: 'Enlarge photo', seeAllPhotos: 'See all photos',
      imageAltSuffix: (title) => `${title} at La Maison Normande`,
      galleryCloseAria: 'Close gallery', galleryPrevAria: 'Previous photo', galleryNextAria: 'Next photo'
    },
    spaces: [
      ['Living Room', 'The long dinner table, a crackling fire, and the garden stretching beyond.', '/images/piece-de-vie.jpeg'],
      ['Kitchen', 'A fully equipped country kitchen, ready for big family meals.', '/images/cuisine-2.avif'],
      ['Olive Room', 'A soft, quiet room upstairs, tucked beneath the beams.', '/images/chambre-1.avif'],
      ['Linen Room', 'A bright retreat, made for resting after a day exploring Normandy.', '/images/chambre-2.avif'],
      ['Brick Room', 'A room full of character, where you can just about hear the garden breathe.', '/images/chambre-3.avif'],
      ['Stream Room', 'The Stream Room extends the house’s comfort to the whole family.', '/images/chambre-4.avif'],
      ['Veranda', 'A light-filled summer lounge, open to the garden in every season.', '/images/veranda.avif'],
      ['Fire Pit', 'A fire pit and deep armchairs for lingering on warm evenings.', '/images/coin-du-feu.avif'],
      ['Ping-Pong', 'A game of table tennis facing the house — fun for all ages.', '/images/ping-pong.avif'],
      ['Terrace', 'Sun loungers and an open view of the garden, perfect for lazing in the sun.', '/images/terrasse-transats.avif'],
      ['The Pastures', 'The house is surrounded by pastures where Normandy cows graze.', '/images/paturages.avif']
    ],
    host: {
      portraitAlt: 'Claire, your host', name: 'Claire', languages: 'French, English',
      lives: 'Lives in Danestal, Pays d’Auge', years: 'Hosting for 6 years',
      eyebrow: 'Welcome to our home',
      quote: '“I imagined this house as a place to set down your bags, where time slows down a little.”',
      bio: 'Claire, together with her father Christophe, has looked after this Normandy house for six years. She’s always happy to share her favourite market, the best route to the beach, and the hidden corners of the Pays d’Auge.',
      cta: 'Book now'
    },
    floorPlan: {
      eyebrow: 'Take a look before you arrive', h2: 'Explore every<br>corner of the <em>house.</em>',
      p: 'A house with room for every rhythm: those reading in the living room, those cooking dinner, those out getting some air.',
      tabs: { ground: 'Ground floor', first: '1st floor', second: '2nd floor' },
      roomDetailsAria: (name) => `View details: ${name}`,
      guestsWord: (n) => `${n} guest${n > 1 ? 's' : ''}`
    },
    roomNames: {
      entry: 'Entrance', living: 'Living room & fireplace', kitchen: 'Kitchen', dining: 'Dining room', bed1: 'Olive Room',
      bath0: 'Bathroom', terrace: 'Terrace & garden', veranda: 'Veranda', firepit: 'Fire pit', pingpong: 'Ping-pong',
      bed2: 'Linen Room', bed3: 'Brick Room', bath: 'Bathroom', bed4: 'Stream Room', bath2: 'Bathroom'
    },
    nearbySection: { eyebrow: 'Around Danestal', h2: 'Getaways,<br>just <em>next door.</em>', cta: 'Plan your stay' },
    nearbyItems: [
      ['Walks through the Pays d’Auge', 'Right nearby', 'Sunken lanes winding between apple orchards and manor houses.', '/images/randonnee-pays-dauge.webp'],
      ['The Cider Route', '12 min', 'Calvados, orchards, and visits with local producers.', '/images/route-du-cidre.jpg'],
      ['The beaches of Cabourg', '18 min away', 'Fine sand, striped beach huts, and a Belle Époque seafront.', '/images/plage-cabourg.webp'],
      ['Deauville', '25 min', 'Stroll the boardwalk and dine by the marina.', '/images/deauville.webp']
    ],
    reviewsSection: {
      eyebrow: 'Stays worth remembering', h2: 'They say it<br><em>better than we do.</em>',
      count: '264', countLabel: 'Reviews', overallRating: '4.89'
    },
    ratingCategories: [['Cleanliness', '4.8'], ['Location', '4.8'], ['Value', '4.8']],
    reviews: [
      ['ML', 'Marie L.', 'August 2026', 'A haven of peace for our whole tribe. The garden is huge, the house has real soul, and Claire’s attentiveness is rare.'],
      ['JD', 'Julien D.', 'July 2026', 'Our kids adopted the stream, we adopted evening drinks under the apple trees. We’ll definitely be back.'],
      ['AS', 'Anna S.', 'May 2026', 'The beauty of the beams, the crackling fireplace, the absolute quiet. Exactly what we were looking for.'],
      ['SR', 'Sophie R.', 'June 2026', 'A warm welcome from start to finish. The house is even more beautiful in person, and so well equipped.'],
      ['TB', 'Thomas B.', 'September 2025', 'The grounds are a real joy for kids and adults alike. We felt right at home from the moment we arrived.']
    ],
    faqSection: { eyebrow: 'Good to know', h2: 'Everything you need<br>to <em>picture it.</em>', intro: 'A question before booking? You can also write directly to Claire.', contact: 'Contact Claire' },
    faq: [
      ['What are the check-in and check-out times?', 'Check-in is from 4pm and check-out before 11am. Self check-in can be arranged on request.'],
      ['How many guests can the house accommodate?', 'The house comfortably sleeps up to 8 guests, with four bedrooms, seven beds and three bathrooms.'],
      ['Is housekeeping included in the stay?', 'End-of-stay cleaning is included. An extra cleaning visit can be booked during your stay.'],
      ['Are pets allowed?', 'Your pets are welcome with advance notice, so we can prepare properly for their arrival.']
    ],
    finalCta: {
      eyebrow: 'Danestal, Normandy', h2: 'What if your next<br>memory started <em>here?</em>',
      imageAlt: 'Aerial view of the house and surrounding countryside', button: 'Book now', note: 'Quick reply via WhatsApp'
    },
    footer: { tagline: 'A family home, in Danestal.', linkHouse: 'The house', linkFaq: 'FAQ', linkContact: 'Contact', copyright: '© 2026 La Maison Normande', bottomNote: 'Direct & secure booking' },
    reserveModal: {
      title: 'Book now', intro: 'A short pre-filled message will open in WhatsApp — all you need to do is send it to Claire.',
      name: 'Your name', namePlaceholder: 'First and last name', arrival: 'Check-in', departure: 'Check-out', guests: 'Guests',
      message: 'Message (optional)', messagePlaceholder: 'Anything else to add?', submit: 'Send via WhatsApp'
    },
    toast: { conflict: 'Stay not available: a night already booked falls within this period.' },
    whatsapp: (name, arrival, departure, guestCount) => `Hello Claire, I would like to book La Maison Normande from ${arrival} to ${departure} for ${guestCount} guest${guestCount > 1 ? 's' : ''}. My name: ${name}.`,
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    formatShort: (day, monthAbbr) => `${monthAbbr} ${day}`,
    formatFull: (day, month, year) => `${month} ${day}, ${year}`
  }
};

// Floor-plan room data: language-independent (image, class, grid size, area,
// capacity number). Only the room name and "N guests" wording are translated,
// via content[lang].roomNames[cls] and content[lang].floorPlan.guestsWord().
const floorData = {
  ground: [
    ['01', 'entry', 'sm', '/images/maison-exterieur-jardin.avif', '8 m²', null],
    ['02', 'living', 'lg', '/images/piece-de-vie.jpeg', '38 m²', 8],
    ['03', 'kitchen', 'wd', '/images/cuisine-1.avif', '18 m²', 6],
    ['04', 'dining', 'wd', '/images/piece-de-vie.jpeg', '20 m²', 10],
    ['05', 'bed1', 'wd', '/images/chambre-1.avif', '18 m²', 2],
    ['06', 'bath0', 'sm', '/images/salle-de-bain.avif', '6 m²', null],
    ['07', 'terrace', 'lg', '/images/jardin-terrasse.avif', '8 000 m²', 20],
    ['08', 'veranda', 'wd', '/images/veranda.avif', '16 m²', 8],
    ['09', 'firepit', 'sm', '/images/coin-du-feu.avif', '—', 6],
    ['10', 'pingpong', 'sm', '/images/ping-pong.avif', '—', 4]
  ],
  first: [
    ['01', 'bed2', 'wd', '/images/chambre-2.avif', '16 m²', 2],
    ['02', 'bed3', 'wd', '/images/chambre-3.avif', '20 m²', 2],
    ['03', 'bath', 'sm', '/images/salle-de-bain.avif', '6 m²', null]
  ],
  second: [
    ['01', 'bed4', 'lg', '/images/chambre-4.avif', '15 m²', 2],
    ['02', 'bath2', 'sm', '/images/salle-de-bain.avif', '5 m²', null]
  ]
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const LANG_KEY = 'lmn-lang';
const detectLang = () => {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'fr' || saved === 'en') return saved;
  return navigator.language && navigator.language.toLowerCase().startsWith('en') ? 'en' : 'fr';
};
let lang = detectLang();

// Persistent app state — survives a language switch (re-mount), so a visitor
// who already picked dates / guests / a room doesn't lose their place.
const today = new Date(); today.setHours(0, 0, 0, 0);
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let selected = [];
let guests = { adults: 2, children: 0 };
let activeSpace = 0;
let activeFloor = 'ground';

const guestSummaryText = () => {
  const t = content[lang].booking;
  const parts = [`${guests.adults} ${t.adultWord(guests.adults)}`];
  if (guests.children) parts.push(`${guests.children} ${t.childWord(guests.children)}`);
  return parts.join(', ');
};
const formatShort = (iso) => {
  const t = content[lang];
  const [, m, d] = iso.split('-').map(Number);
  return t.formatShort(d, t.monthNames[m - 1].slice(0, 3));
};
const formatFull = (iso) => {
  if (!iso) return '—';
  const t = content[lang];
  const [y, m, d] = iso.split('-').map(Number);
  return t.formatFull(d, t.monthNames[m - 1], y);
};

let mountController = null;
let revealObserver = null;

function mount() {
  if (mountController) mountController.abort();
  mountController = new AbortController();
  const { signal } = mountController;
  if (revealObserver) revealObserver.disconnect();

  const t = content[lang];
  document.documentElement.lang = lang;
  document.title = t.meta.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t.meta.description);

  document.querySelector('#app').innerHTML = `
  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="${t.brandAria}"><span class="brand-mark"><i></i><i></i></span><span>La Maison<br><em>Normande</em></span></a>
    <nav class="nav-links" aria-label="Navigation principale">
      <a href="#cadre">${t.nav.cadre}</a><a href="#equipements">${t.nav.equipements}</a><a href="#chambres">${t.nav.chambres}</a><a href="#plan">${t.nav.plan}</a><a href="#avis">${t.nav.avis}</a><a href="#faq">${t.nav.faq}</a>
    </nav>
    <button class="header-cta booking-trigger">${t.headerCta} <span>${icon('arrow', 15)}</span></button>
    <button class="lang-toggle" id="lang-toggle" aria-label="${t.langToggleAria}">${t.langToggleLabel}</button>
    <button class="menu-toggle" aria-label="${t.menuAria}"><span></span><span></span><span></span></button>
  </header>

  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-image image-placeholder"><img src="/images/la-maison.jpeg" alt="${t.hero.imageAlt}" /></div>
      <div class="hero-wash"></div>
      <div class="hero-copy shell">
        <p class="eyebrow light"><span></span>${t.hero.eyebrow}</p>
        <h1 id="hero-title">${t.hero.titleLine1}<br><em>${t.hero.titleEm}</em></h1>
        <p class="hero-intro">${t.hero.intro}</p>
        <a href="#cadre" class="text-link light-link">${t.hero.discover} ${icon('arrow', 17)}</a>
      </div>
      <aside class="booking-card" id="booking" aria-label="${t.booking.aria}">
        <div class="booking-top"><div><p class="booking-label">${t.booking.label}</p><h2>${t.booking.title}</h2></div><span class="booking-status"><i></i>${t.booking.status}</span></div>
        <div class="calendar-header"><button id="cal-prev" aria-label="${t.booking.prevAria}">‹</button><strong id="cal-month"></strong><button id="cal-next" aria-label="${t.booking.nextAria}">›</button></div>
        <div class="weekdays">${t.days.map(d => `<span>${d}</span>`).join('')}</div>
        <div class="calendar-grid" id="calendar-grid"></div>
        <div class="date-fields"><button><span>${t.booking.arrival}</span><strong id="arrival-value">${selected[0] ? formatShort(selected[0]) : t.booking.select}</strong></button><button><span>${t.booking.departure}</span><strong id="departure-value">${selected[1] ? formatShort(selected[1]) : t.booking.select}</strong></button></div>
        <div class="guest-line"><span>${icon('users', 17)} ${t.booking.travelers}</span><button class="guest-toggle"><strong id="guest-summary">${guestSummaryText()}</strong>${icon('chevron', 15)}</button></div>
        <div class="guest-panel" hidden>
          <div><span>${t.booking.adults} <small>${t.booking.adultsSub}</small></span><p class="stepper"><button data-type="adults" data-change="-1">−</button><b id="adult-count">${guests.adults}</b><button data-type="adults" data-change="1">+</button></p></div>
          <div><span>${t.booking.children} <small>${t.booking.childrenSub}</small></span><p class="stepper"><button data-type="children" data-change="-1">−</button><b id="child-count">${guests.children}</b><button data-type="children" data-change="1">+</button></p></div>
        </div>
        <button class="reserve-button" id="reserve">${t.booking.reserve} <span>${t.booking.fromPrice}</span></button>
        <p class="booking-note">${t.booking.note}</p>
      </aside>
      <div class="hero-bottom"><span>${t.hero.travelers}</span><span>${t.hero.specs}</span></div>
    </section>

    <section class="intro section shell" id="cadre">
      <div class="intro-collage" aria-label="Aperçus de la maison">
        <figure class="intro-photo one image-placeholder"><img src="/images/piece-de-vie.jpeg" alt="${t.cadre.photoOneAlt}" loading="lazy" /><figcaption>${t.cadre.photoOneCaption}</figcaption></figure>
        <figure class="intro-photo two image-placeholder"><img src="/images/jardin-table.avif" alt="${t.cadre.photoTwoAlt}" loading="lazy" /><figcaption>${t.cadre.photoTwoCaption}</figcaption></figure>
        <div class="review-stamp"><strong>${t.cadre.overallRating}<small>/5</small></strong><span>${icon('star', 13)} ${t.cadre.reviewsVerified}</span></div>
      </div>
      <div class="intro-copy">
        <p class="eyebrow"><span></span>${t.cadre.eyebrow}</p>
        <h2>${t.cadre.h2}</h2>
        <p>${t.cadre.p1}</p>
        <p>${t.cadre.p2}</p>
        <a href="#chambres" class="text-link">${t.cadre.link} ${icon('arrow', 17)}</a>
      </div>
    </section>

    <section class="amenities section" id="equipements"><div class="shell">
      <div class="centered-heading"><p class="eyebrow"><span></span>${t.amenitiesSection.eyebrow}</p><h2>${t.amenitiesSection.h2}</h2></div>
      <div class="amenities-grid">${t.amenities.map(([i, label]) => `<div class="amenity"><span class="amenity-icon">${icon(i, 17)}</span><strong>${label}</strong></div>`).join('')}</div>
      <button class="outline-button" id="amenities-button" aria-haspopup="dialog">${t.amenitiesSection.seeAll} ${icon('arrow', 16)}</button>
    </div></section>

    <div class="modal-backdrop" id="amenities-modal" hidden>
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-head"><h3 id="modal-title">${t.amenitiesSection.modalTitle}</h3><button class="modal-close" id="modal-close" aria-label="${t.amenitiesSection.closeAria}">${icon('close', 18)}</button></div>
        <div class="modal-body">${t.amenityCategories.map(([category, items]) => `
          <section class="modal-category"><h4>${category}</h4>${items.map(item => `<div class="modal-item">${icon('check', 15)}<span>${item}</span></div>`).join('')}</section>
        `).join('')}</div>
      </div>
    </div>

    <section class="spaces section" id="chambres"><div class="shell">
      <div class="section-top"><div><p class="eyebrow"><span></span>${t.spacesSection.eyebrow}</p><h2>${t.spacesSection.h2}</h2></div><div class="carousel-controls"><button class="carousel-prev" aria-label="${t.spacesSection.prevAria}">←</button><span><b id="slide-index">01</b> <i></i> ${String(t.spaces.length).padStart(2,'0')}</span><button class="carousel-next" aria-label="${t.spacesSection.nextAria}">→</button></div></div>
      <div class="space-stage">
        <div class="space-image image-placeholder" id="space-image" role="button" tabindex="0" aria-label="${t.spacesSection.imageAria}"></div>
        <article class="space-caption"><p class="eyebrow"><span></span><span id="space-count"></span></p><h3 id="space-title"></h3><p id="space-text"></p><button class="text-link" id="open-gallery">${t.spacesSection.seeAllPhotos} ${icon('arrow', 17)}</button></article>
      </div>
      <div class="space-thumbnails" id="space-thumbnails"></div>
    </div></section>

    <div class="modal-backdrop gallery-backdrop" id="gallery-modal" hidden>
      <button class="gallery-close" id="gallery-close" aria-label="${t.spacesSection.galleryCloseAria}">${icon('close', 20)}</button>
      <button class="gallery-nav prev" id="gallery-prev" aria-label="${t.spacesSection.galleryPrevAria}">${icon('arrow', 20)}</button>
      <figure class="gallery-figure">
        <img id="gallery-image" src="" alt="" />
        <figcaption><strong id="gallery-title"></strong><span id="gallery-count"></span></figcaption>
      </figure>
      <button class="gallery-nav next" id="gallery-next" aria-label="${t.spacesSection.galleryNextAria}">${icon('arrow', 20)}</button>
    </div>

    <section class="host section"><div class="shell host-grid">
      <div class="host-portrait-wrap">
        <div class="host-portrait image-placeholder"><img src="/images/claire.avif" alt="${t.host.portraitAlt}" loading="lazy" /></div>
        <div class="host-card">
          <strong>${t.host.name}</strong>
          <div class="host-fact">${icon('globe', 16)}<span>${t.host.languages}</span></div>
          <div class="host-fact">${icon('pin', 16)}<span>${t.host.lives}</span></div>
          <div class="host-fact">${icon('badge', 16)}<span>${t.host.years}</span></div>
        </div>
      </div>
      <div class="host-copy"><p class="eyebrow"><span></span>${t.host.eyebrow}</p><blockquote>${t.host.quote}</blockquote><p>${t.host.bio}</p><a href="#booking" class="text-link booking-trigger">${t.host.cta} ${icon('arrow', 17)}</a></div>
    </div></section>

    <section class="floor-plan section" id="plan"><div class="shell">
      <div class="plan-heading"><p class="eyebrow light"><span></span>${t.floorPlan.eyebrow}</p><h2>${t.floorPlan.h2}</h2><p>${t.floorPlan.p}</p></div>
      <div class="plan-tabs" role="tablist"><button class="${activeFloor === 'ground' ? 'active' : ''}" data-floor="ground">${t.floorPlan.tabs.ground}</button><button class="${activeFloor === 'first' ? 'active' : ''}" data-floor="first">${t.floorPlan.tabs.first}</button><button class="${activeFloor === 'second' ? 'active' : ''}" data-floor="second">${t.floorPlan.tabs.second}</button></div>
      <div class="house-plan" id="house-plan"></div>
      <div class="plan-key" id="plan-key"></div>
    </div></section>

    <section class="nearby section" id="nearby">
      <div class="nearby-scroller" id="nearby-scroller" style="height: calc(${t.nearbyItems.length} * 85vh)">
        <div class="nearby-sticky">
          <div class="shell">
            <div class="section-top"><div><p class="eyebrow"><span></span>${t.nearbySection.eyebrow}</p><h2>${t.nearbySection.h2}</h2></div><a class="text-link booking-trigger" href="#booking">${t.nearbySection.cta} ${icon('arrow', 17)}</a></div>
            <div class="nearby-pin-body">
              <div class="nearby-pin-image" id="nearby-pin-image">${t.nearbyItems.map(([, , , img], i) => `<div class="nearby-pin-slide ${i === 0 ? 'active' : ''}" data-index="${i}" style="background-image:url('${img}')"></div>`).join('')}</div>
              <div class="nearby-pin-list" id="nearby-pin-list">${t.nearbyItems.map(([title, time, text], i) => `<article class="${i === 0 ? 'active' : ''}" data-index="${i}"><span class="nearby-no">0${i + 1}</span><div><h3>${title}</h3><p>${text}</p></div><span>${time}</span></article>`).join('')}</div>
            </div>
            <div class="nearby-pin-progress" id="nearby-pin-progress">${t.nearbyItems.map((_, i) => `<i class="${i === 0 ? 'active' : ''}"></i>`).join('')}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="reviews section" id="avis">
      <div class="shell reviews-lead"><p class="eyebrow"><span></span>${t.reviewsSection.eyebrow}</p><h2>${t.reviewsSection.h2}</h2></div>
      <div class="shell reviews-stats">
        <div class="stat-block"><strong>${t.reviewsSection.count}</strong><span>${t.reviewsSection.countLabel}</span></div>
        <div class="stat-block"><strong>${t.reviewsSection.overallRating}</strong><span class="stars">★★★★★</span></div>
        <div class="stat-bars">${t.ratingCategories.map(([label, score]) => `<div class="stat-bar-row"><span>${label}</span><span class="stat-bar"><i style="width:${Number(score.replace(',', '.')) / 5 * 100}%"></i></span><b>${score}</b></div>`).join('')}</div>
      </div>
      <div class="review-scroll-wrap">
        <div class="review-cards" id="review-cards">${t.reviews.concat(t.reviews).map(([initials, name, date, text], i) => `<article class="${i % t.reviews.length === 1 ? 'highlight' : ''}" aria-hidden="${i >= t.reviews.length ? 'true' : 'false'}"><div class="review-top"><span class="initials">${initials}</span><div><b>${name}</b><small>${date}</small></div><span class="stars">★★★★★</span></div><p>“${text}”</p></article>`).join('')}</div>
      </div>
    </section>

    <section class="faq section" id="faq"><div class="shell faq-grid"><div><p class="eyebrow"><span></span>${t.faqSection.eyebrow}</p><h2>${t.faqSection.h2}</h2><p class="faq-intro">${t.faqSection.intro}</p><a class="outline-button small" href="mailto:bonjour@lamaisonnormande.fr">${t.faqSection.contact} ${icon('arrow', 16)}</a></div><div class="accordion">${t.faq.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q} <span>${icon('plus',18)}</span></summary><p>${a}</p></details>`).join('')}</div></div></section>

    <section class="final-cta"><div class="final-image image-placeholder"><img src="/images/les-alentours.jpeg" alt="${t.finalCta.imageAlt}" loading="lazy" /></div><div class="final-wash"></div><div class="shell final-copy"><p class="eyebrow light"><span></span>${t.finalCta.eyebrow}</p><h2>${t.finalCta.h2}</h2><button class="reserve-button booking-trigger">${t.finalCta.button}</button><p class="final-note">${t.finalCta.note}</p></div></section>
  </main>
  <footer><div class="shell footer-row"><a class="brand footer-brand" href="#top"><span class="brand-mark"><i></i><i></i></span><span>La Maison<br><em>Normande</em></span></a><p>${t.footer.tagline}</p><div><a href="#cadre">${t.footer.linkHouse}</a><a href="#faq">${t.footer.linkFaq}</a><a href="mailto:bonjour@lamaisonnormande.fr">${t.footer.linkContact}</a></div></div><div class="shell footer-bottom"><span>${t.footer.copyright}</span><span>${t.footer.bottomNote}</span></div></footer>
  <div class="toast" role="status" aria-live="polite"></div>

  <div class="modal-backdrop" id="reserve-modal" hidden>
    <div class="modal-card reserve-card" role="dialog" aria-modal="true" aria-labelledby="reserve-modal-title">
      <div class="modal-head"><h3 id="reserve-modal-title">${t.reserveModal.title}</h3><button class="modal-close" id="reserve-modal-close" aria-label="${t.amenitiesSection.closeAria}">${icon('close', 18)}</button></div>
      <form class="reserve-form" id="reserve-form">
        <p class="reserve-form-intro">${t.reserveModal.intro}</p>
        <label>${t.reserveModal.name}<input type="text" id="rf-name" name="name" required placeholder="${t.reserveModal.namePlaceholder}" /></label>
        <div class="reserve-form-row">
          <label>${t.reserveModal.arrival}<input type="date" id="rf-arrival" name="arrival" required /></label>
          <label>${t.reserveModal.departure}<input type="date" id="rf-departure" name="departure" required /></label>
        </div>
        <label>${t.reserveModal.guests}<input type="number" id="rf-guests" name="guests" min="1" max="8" value="${guests.adults + guests.children}" required /></label>
        <label>${t.reserveModal.message}<textarea id="rf-message" name="message" rows="2" placeholder="${t.reserveModal.messagePlaceholder}"></textarea></label>
        <button type="submit" class="reserve-button">${t.reserveModal.submit} ${icon('arrow', 16)}</button>
      </form>
    </div>
  </div>
`;

  // ---- language toggle -----------------------------------------------------
  $('#lang-toggle').addEventListener('click', () => {
    lang = lang === 'fr' ? 'en' : 'fr';
    localStorage.setItem(LANG_KEY, lang);
    mount();
  });

  // ---- booking widget: real calendar (past dates locked, month navigation) -
  const isUnavailableDate = () => false;
  const showToast = (message) => { const toast = $('.toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3500); };

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

    $('#cal-month').textContent = `${t.monthNames[viewMonth]} ${viewYear}`;
    $('#cal-prev').disabled = viewYear === today.getFullYear() && viewMonth === today.getMonth();

    $('#calendar-grid').innerHTML = cells.map(day => {
      if (!day) return '<span></span>';
      const cellDate = new Date(viewYear, viewMonth, day);
      const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
          showToast(t.toast.conflict);
          selected = [iso];
          $('#arrival-value').textContent = formatShort(iso);
          $('#departure-value').textContent = t.booking.select;
        } else {
          $('#arrival-value').textContent = formatShort(selected[0]);
          $('#departure-value').textContent = formatShort(selected[1]);
        }
      } else {
        $('#arrival-value').textContent = formatShort(iso);
        $('#departure-value').textContent = t.booking.select;
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

  $('.guest-toggle').addEventListener('click', () => { const panel = $('.guest-panel'); panel.hidden = !panel.hidden; });
  $$('.stepper button').forEach(button => button.addEventListener('click', () => {
    const type = button.dataset.type; const next = guests[type] + Number(button.dataset.change);
    if (next < 0 || (type === 'adults' && next < 1) || guests.adults + guests.children + (next - guests[type]) > 8) return;
    guests[type] = next; $(`#${type === 'adults' ? 'adult' : 'child'}-count`).textContent = next;
    $('#guest-summary').textContent = guestSummaryText();
  }));

  // ---- reservation modal: every "book now" CTA hands off to WhatsApp -------
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
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !reserveModal.hidden) closeReserveModal(); }, { signal });

  $('#reserve-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('#rf-name').value.trim();
    const arrival = $('#rf-arrival').value;
    const departure = $('#rf-departure').value;
    const guestCount = $('#rf-guests').value;
    const extra = $('#rf-message').value.trim();
    let message = t.whatsapp(name, formatFull(arrival), formatFull(departure), guestCount);
    if (extra) message += ` ${extra}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    closeReserveModal();
  });

  // ---- spaces carousel ------------------------------------------------------
  const spacesTotal = String(t.spaces.length).padStart(2,'0');
  const galleryModal = $('#gallery-modal');
  function renderSpace() {
    const [title, text, image] = t.spaces[activeSpace];
    $('#space-image').innerHTML = `<img src="${image}" alt="${t.spacesSection.imageAltSuffix(title)}" loading="lazy" />`; $('#space-title').textContent = title; $('#space-text').textContent = text;
    $('#space-count').textContent = `${String(activeSpace + 1).padStart(2,'0')} — ${spacesTotal}`; $('#slide-index').textContent = String(activeSpace + 1).padStart(2,'0');
    $('#space-thumbnails').innerHTML = t.spaces.map(([title,,image], i) => `<button class="space-thumb ${i===activeSpace?'active':''}" data-space="${i}" aria-label="${title}"><img src="${image}" alt="" /><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');
    $$('.space-thumb').forEach(button => button.addEventListener('click', () => { activeSpace = Number(button.dataset.space); renderSpace(); if (!galleryModal.hidden) renderGallery(); }));
    if (galleryModal && !galleryModal.hidden) renderGallery();
  }
  $('.carousel-prev').addEventListener('click', () => { activeSpace = (activeSpace + t.spaces.length - 1) % t.spaces.length; renderSpace(); });
  $('.carousel-next').addEventListener('click', () => { activeSpace = (activeSpace + 1) % t.spaces.length; renderSpace(); });
  renderSpace();

  // ---- photo gallery ---------------------------------------------------------
  function renderGallery() {
    const [title, , image] = t.spaces[activeSpace];
    $('#gallery-image').src = image; $('#gallery-image').alt = t.spacesSection.imageAltSuffix(title);
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
  $('#gallery-prev').addEventListener('click', () => { activeSpace = (activeSpace + t.spaces.length - 1) % t.spaces.length; renderGallery(); renderSpace(); });
  $('#gallery-next').addEventListener('click', () => { activeSpace = (activeSpace + 1) % t.spaces.length; renderGallery(); renderSpace(); });
  document.addEventListener('keydown', (event) => {
    if (galleryModal.hidden) return;
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowLeft') $('#gallery-prev').click();
    if (event.key === 'ArrowRight') $('#gallery-next').click();
  }, { signal });

  // ---- floor plan -------------------------------------------------------------
  function renderFloor(floor = 'ground') {
    activeFloor = floor;
    const rooms = floorData[floor];
    $('#house-plan').innerHTML = rooms.map(([n, cls, gridSize, img, area, capacityNum]) => {
      const name = t.roomNames[cls];
      const capacity = capacityNum == null ? '—' : t.floorPlan.guestsWord(capacityNum);
      return `
    <div class="room ${cls} size-${gridSize}" tabindex="0" role="button" aria-expanded="false" aria-label="${t.floorPlan.roomDetailsAria(name)}">
      <span class="room-dot" aria-hidden="true"></span>
      <span class="room-label"><b aria-hidden="true">${n}</b><strong>${name}</strong></span>
      <div class="room-card" aria-hidden="true">
        <div class="room-card-image image-placeholder"><img src="${img}" alt="" loading="lazy" /></div>
        <div class="room-card-body"><strong>${name}</strong><div class="room-card-meta"><span>${icon('ruler', 13)} ${area}</span><span>${icon('users', 13)} ${capacity}</span></div></div>
      </div>
    </div>`;
    }).join('');
    $('#plan-key').innerHTML = rooms.map(([n, cls]) => `<span><b>${n}</b>${t.roomNames[cls]}</span>`).join('');
    $$('.room').forEach(room => {
      const toggle = () => { const open = room.classList.toggle('open'); room.setAttribute('aria-expanded', String(open)); };
      room.addEventListener('click', toggle);
      room.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } });
    });
  }
  $$('.plan-tabs button').forEach(button => button.addEventListener('click', () => { $$('.plan-tabs button').forEach(b => b.classList.toggle('active', b === button)); renderFloor(button.dataset.floor); }));
  renderFloor(activeFloor);

  // ---- amenities modal ----------------------------------------------------
  const modal = $('#amenities-modal');
  const openModal = () => { modal.hidden = false; document.body.style.overflow = 'hidden'; $('#modal-close').focus(); };
  const closeModal = () => { modal.hidden = true; document.body.style.overflow = ''; $('#amenities-button').focus(); };
  $('#amenities-button').addEventListener('click', openModal);
  $('#modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); }, { signal });

  $('.menu-toggle').addEventListener('click', () => { $('.nav-links').classList.toggle('open'); $('.menu-toggle').classList.toggle('open'); });
  $$('.nav-links a').forEach(link => link.addEventListener('click', () => $('.nav-links').classList.remove('open')));

  // ---- hero parallax --------------------------------------------------------
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
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; } }, { passive: true, signal });
    updateParallax();
  }

  // ---- nearby: pinned scroll section ----------------------------------------
  const nearbyScroller = $('#nearby-scroller');
  if (nearbyScroller) {
    const nearbySlides = $$('.nearby-pin-slide');
    const nearbyListItems = $$('#nearby-pin-list > article');
    const nearbyDots = $$('#nearby-pin-progress > i');
    const nearbyTotal = t.nearbyItems.length;
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
    window.addEventListener('scroll', () => { if (!nearbyTicking) { requestAnimationFrame(updateNearbyScroll); nearbyTicking = true; } }, { passive: true, signal });
    updateNearbyScroll();
  }

  // ---- scroll reveal ----------------------------------------------------------
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
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }
}

mount();
