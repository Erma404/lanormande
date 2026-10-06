// ---------------------------------------------------------------------------
// i18n content. Every visible string lives here, split fr/en. Data that isn't
// language-dependent (image paths, css classes, grid sizes, icon keys) stays
// out of this object and is shared by both languages further down.
// ---------------------------------------------------------------------------
export const content = {
  fr: {
    lang: 'fr',
    meta: { title: 'Maison à louer pour 8 près de Deauville · Villa Normande', description: 'Maison à colombages pour 8 à Danestal, au cœur du pays d’Auge : 4 chambres, jacuzzi, cheminée, jardin de 8 000 m², plages à 18 min. Réservez en direct.' },
    nav: { cadre: 'Le cadre', equipements: 'Équipements', chambres: 'Chambres', plan: 'Plan', avis: 'Avis', tarifs: 'Tarifs', faq: 'FAQ', guide: 'Guide' },
    brandAria: 'Villa Normande, accueil',
    headerCta: 'Je réserve',
    menuAria: 'Ouvrir le menu',
    langToggleLabel: 'EN',
    langToggleAria: 'Switch to English',
    hero: {
      eyebrow: 'Maison à louer pour 8 · Danestal, pays d’Auge',
      titleLine1: 'La Normandie,', titleEm: 'en famille.',
      imageAlt: 'Villa Normande, maison à colombages au cœur du jardin',
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
      reserve: 'Réserver', fromPrice: 'à partir de 185 € / nuit', note: 'Vous ne serez pas débité·e maintenant.',
      adultWord: (n) => `adulte${n > 1 ? 's' : ''}`, childWord: (n) => `enfant${n > 1 ? 's' : ''}`
    },
    cadre: {
      photoOneAlt: 'La pièce de vie de la maison', photoOneCaption: 'La pièce de vie, ouverte sur le jardin',
      photoTwoAlt: 'La terrasse et le jardin de la maison', photoTwoCaption: 'Le jardin, côté terrasse',
      overallRating: '4,9', reviewsVerified: '267 avis sur Airbnb',
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
      imageAltSuffix: (title) => `${title} de la Villa Normande`,
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
      portraitAlt: 'Christophe, votre hôte', name: 'Christophe', languages: 'Français, Anglais',
      years: 'Hôte depuis 6 ans',
      eyebrow: 'Bienvenue chez nous',
      quote: '“J’ai imaginé cette maison comme un lieu où l’on pose les valises, et où le temps veut bien ralentir.”',
      bio: 'Avec sa fille Claire, Christophe veille sur cette maison normande depuis six ans. Il vous partage volontiers son marché préféré, la meilleure route pour rejoindre la plage et les coins secrets du pays d’Auge.',
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
    nearbySection: { eyebrow: 'Autour de Danestal', h2: 'Des échappées,<br>juste <em>à côté.</em>', cta: 'Préparer votre séjour', guide: 'Notre guide du pays d’Auge', guideUrl: '/normandie-pays-d-auge#trajets' },
    nearbyItems: [
      ['Balades du pays d’Auge', 'Tout près', 'Des chemins creux entre pommiers et manoirs.', '/images/randonnee-pays-dauge.webp'],
      ['La route du cidre', '12 min', 'Calvados, vergers et rencontres de producteurs.', '/images/route-du-cidre.jpg'],
      ['Les plages de Cabourg', 'À 18 min', 'Le sable fin, les cabines rayées et le front de mer de la Belle Époque.', '/images/plage-cabourg.webp'],
      ['Deauville', '25 min', 'Flâner sur les planches et dîner sur le port.', '/images/deauville.webp']
    ],
    reviewsSection: {
      eyebrow: 'Des séjours qui restent', h2: 'Ils en parlent<br><em>mieux que nous.</em>',
      count: '267', countLabel: 'Avis sur Airbnb', overallRating: '4,9'
    },
    // Rubriques d'Airbnb ; une note vide est masquée sur le site (à renseigner dans l'admin).
    ratingCategories: [['Propreté', '4,8'], ['Précision', ''], ['Communication', ''], ['Emplacement', '4,8'], ['Arrivée', ''], ['Qualité-prix', '4,8']],
    // Avis réels publiés sur Airbnb (extraits fidèles, raccourcis si besoin).
    reviews: [
      ['C', 'Chris', 'Septembre 2026', 'Une maison fabuleuse et de caractère, parfaitement située pour découvrir les nombreux attraits de la Normandie. Prendre le petit déjeuner sur la terrasse ensoleillée tout en profitant de la vue sur le magnifique parc a été un plaisir tout particulier.'],
      ['FJ', 'Felicity Jane', 'Août 2026', 'Quelle maison merveilleuse ! La maison était extrêmement accueillante, et nous avons passé beaucoup de temps dans le magnifique jardin. Nos filles ont passé un moment formidable à explorer le terrain et tout semblait très sûr.'],
      ['M', 'Mark', 'Mai 2026', 'Logement confortable proche de la côte et des plages du D-Day. La communication avec Christophe a été excellente. Le jardin était vraiment magnifique ! Nous avons fait des barbecues plusieurs soirées.'],
      ['R', 'Reda', 'Mai 2026', 'Nous avons passé un séjour exceptionnel dans cette maison en Normandie. L’espace est immense, très confortable, niché dans un coin de verdure isolé, ultra calme. Les hôtes sont adorables, vraiment attentifs et bienveillants.'],
      ['T', 'Thomas', 'Décembre 2025', 'Superbe séjour passé en hiver. Hôte très réactif et généreux en bois. Le petit panier garni est une attention sympathique. La literie est confortable et soignée. Je recommande chaudement ce logement.']
    ],
    pricing: {
      eyebrow: 'Tarifs', h2: 'Plus vous restez,<br><em>moins vous payez.</em>',
      intro: 'Réservation en direct, sans frais de plateforme.',
      current: 'Saison actuelle', perNight: 'nuit', approx: '≈ ',
      seasons: [
        { id: 'basse', name: 'Basse saison', months: 'Janvier, février, mars, octobre et novembre', monthNumbers: [1, 2, 3, 10, 11],
          rows: [['Week-end · 2 nuits', '500 €', '250 €'], ['Week-end · 3 nuits', '700 €', '233 €'], ['4 à 6 nuits', '', '220 €'], ['Semaine · 7 nuits', '1 400 €', '200 €'], ['Plus de 7 nuits', '', '185 €']] },
        { id: 'haute', name: 'Haute saison', months: 'D’avril à septembre et en décembre', monthNumbers: [4, 5, 6, 7, 8, 9, 12],
          rows: [['Week-end · 2 nuits', '600 €', '300 €'], ['Week-end · 3 nuits', '800 €', '267 €'], ['4 à 6 nuits', '', '250 €'], ['Semaine · 7 nuits', '1 680 €', '240 €'], ['Plus de 7 nuits', '', '225 €']] }
      ],
      included: ['Maison entière, jusqu’à 8 voyageurs', 'Linge de maison fourni', 'Ménage de fin de séjour inclus', 'Rien n’est débité à la demande'],
      cta: 'Vérifier mes dates', note: 'Nous vous confirmons le prix exact de votre séjour sous 48 h.'
    },
    faqSection: { eyebrow: 'Bon à savoir', h2: 'Tout ce qu’il faut<br>pour vous <em>projeter.</em>', intro: 'Une question avant de réserver ? Vous pouvez aussi écrire directement à Christophe.', contact: 'Contacter Christophe' },
    faq: [
      ['Quels sont les horaires d’arrivée et de départ ?', 'Les arrivées se font à partir de 16h et les départs avant 11h. Une arrivée autonome peut être organisée sur demande.'],
      ['Combien de voyageurs la maison peut-elle accueillir ?', 'La maison accueille confortablement jusqu’à 8 voyageurs, avec quatre chambres, sept lits et trois salles de bain.'],
      ['Le linge et le ménage sont-ils inclus ?', 'Oui : draps, serviettes et savon sont fournis, et le ménage de fin de séjour est inclus. Un lave-linge et un sèche-linge sont à votre disposition, et un passage de ménage supplémentaire peut être réservé.'],
      ['La maison est-elle adaptée aux enfants et aux bébés ?', 'Oui : lit bébé, chaise haute, jeux de société et table de ping-pong vous attendent, dans un terrain clos et arboré de 8 000 m².'],
      ['Les animaux sont-ils acceptés ?', 'Vos compagnons sont les bienvenus sur demande préalable, afin de préparer au mieux leur arrivée.'],
      ['Où se trouve la maison et comment y venir ?', 'À Danestal, au cœur du pays d’Auge : les plages de Cabourg sont à 18 minutes, Deauville à 25 minutes et Paris à environ 2 h 15 par l’A13. Le parking est gratuit sur place. Notre guide du pays d’Auge détaille toutes les sorties.']
    ],
    finalCta: {
      eyebrow: 'Danestal, Pays d’Auge', h2: 'Et si votre prochain<br>souvenir commençait <em>ici ?</em>',
      imageAlt: 'Vue aérienne de la maison et de ses alentours', button: 'Je réserve', note: 'Réponse rapide via WhatsApp'
    },
    footer: { tagline: 'Une maison de famille, à Danestal.', linkHouse: 'La maison', linkFaq: 'Questions fréquentes', linkGuide: 'Guide du pays d’Auge', linkContact: 'Contact', copyright: '© 2026 Villa Normande', bottomNote: 'Réservation directe & sécurisée' },
    reserveModal: {
      picker: { choose: 'Ajouter une date', title: 'Sélectionnez les dates', subtitle: 'Ajoutez vos dates de voyage pour connaître le prix exact', arrival: 'Choisissez votre date d’arrivée', departure: 'Choisissez votre date de départ', clear: 'Effacer les dates', done: 'Fermer', back: 'Retour au formulaire', loading: 'Chargement des disponibilités…', prev: 'Mois précédent', next: 'Mois suivant', booked: 'Déjà réservé' },
      estimate: { total: 'Total estimé', night: (n) => `${n} nuit${n > 1 ? 's' : ''}`, perNight: 'nuit', approx: '≈ ', seasons: { basse: 'Basse saison', haute: 'Haute saison', both: 'Basse et haute saison' }, oneNight: 'Tarif sur demande pour une nuit', locale: 'fr-FR' },
      title: 'Je réserve', intro: 'Envoyez votre demande : Christophe vous répond par email ou par téléphone sous 48 h maximum. Rien n’est débité à cette étape.',
      name: 'Votre nom', namePlaceholder: 'Prénom et nom', email: 'Email', emailPlaceholder: 'vous@exemple.fr', phone: 'Téléphone (facultatif)', phonePlaceholder: '06 12 34 56 78',
      arrival: 'Arrivée', departure: 'Départ', guests: 'Voyageurs',
      message: 'Message (facultatif)', messagePlaceholder: 'Une précision à ajouter ?', submit: 'Envoyer ma demande', sending: 'Envoi…',
      whatsapp: 'Vous préférez WhatsApp ? Écrire à Christophe',
      successTitle: 'Demande envoyée', successText: 'Merci ! Christophe a bien reçu votre demande et vous répond sous 48 h maximum. Un email de confirmation vient de vous être envoyé.', successClose: 'Fermer',
      errors: {
        invalid_name: 'Indiquez votre nom.', invalid_email: 'Cette adresse email ne semble pas valide.', invalid_phone: 'Ce numéro de téléphone ne semble pas valide.',
        invalid_range: 'Choisissez une date d’arrivée à venir et une date de départ après l’arrivée.', too_long: 'Pour un séjour de plus de 60 nuits, écrivez directement à Christophe.',
        invalid_guests: 'La maison accueille de 1 à 8 voyageurs.', unavailable: 'Ces dates ne sont plus disponibles. Choisissez une autre période.',
        too_many_requests: 'Plusieurs demandes ont déjà été envoyées. Réessayez dans une heure ou écrivez sur WhatsApp.', network: 'Connexion impossible. Vérifiez votre réseau et réessayez.',
        server_error: 'Une erreur est survenue. Réessayez ou écrivez sur WhatsApp.'
      }
    },
    toast: { conflict: 'Séjour impossible : une nuit déjà réservée se trouve dans cette période.' },
    whatsapp: (name, arrival, departure, guestCount) => `Bonjour Christophe, je souhaite réserver la Villa Normande du ${arrival} au ${departure} pour ${guestCount} voyageur${guestCount > 1 ? 's' : ''}. Mon nom : ${name}.`,
    days: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    formatShort: (day, monthAbbr) => `${day} ${monthAbbr}.`,
    formatFull: (day, month, year) => `${day} ${month} ${year}`
  },
  en: {
    lang: 'en',
    meta: { title: 'Normandy holiday home for 8 near Deauville · Villa Normande', description: 'Half-timbered house for 8 in Danestal, Pays d’Auge: 4 bedrooms, hot tub, fireplace, 8,000 m² garden, beaches 18 min away. Book direct with the host.' },
    nav: { cadre: 'The House', equipements: 'Amenities', chambres: 'Rooms', plan: 'Floor Plan', avis: 'Reviews', tarifs: 'Rates', faq: 'FAQ', guide: 'Guide' },
    brandAria: 'Villa Normande, home',
    headerCta: 'Book now',
    menuAria: 'Open menu',
    langToggleLabel: 'FR',
    langToggleAria: 'Passer en français',
    hero: {
      eyebrow: 'Holiday home for 8 · Danestal, Normandy',
      titleLine1: 'Normandy,', titleEm: 'as a family.',
      imageAlt: 'Villa Normande, a half-timbered house at the heart of the garden',
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
      reserve: 'Book', fromPrice: 'from €185 / night', note: 'You won’t be charged yet.',
      adultWord: (n) => `adult${n > 1 ? 's' : ''}`, childWord: (n) => n > 1 ? 'children' : 'child'
    },
    cadre: {
      photoOneAlt: 'The living room of the house', photoOneCaption: 'The living room, open to the garden',
      photoTwoAlt: 'The terrace and garden of the house', photoTwoCaption: 'The garden, terrace side',
      overallRating: '4.9', reviewsVerified: '267 Airbnb reviews',
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
      imageAltSuffix: (title) => `${title} at Villa Normande`,
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
      portraitAlt: 'Christophe, your host', name: 'Christophe', languages: 'French, English',
      years: 'Hosting for 6 years',
      eyebrow: 'Welcome to our home',
      quote: '“I imagined this house as a place to set down your bags, where time slows down a little.”',
      bio: 'Christophe, together with his daughter Claire, has looked after this Normandy house for six years. He’s always happy to share his favourite market, the best route to the beach, and the hidden corners of the Pays d’Auge.',
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
    nearbySection: { eyebrow: 'Around Danestal', h2: 'Getaways,<br>just <em>next door.</em>', cta: 'Plan your stay', guide: 'Our Pays d’Auge guide', guideUrl: '/en/normandy-guide#trajets' },
    nearbyItems: [
      ['Walks through the Pays d’Auge', 'Right nearby', 'Sunken lanes winding between apple orchards and manor houses.', '/images/randonnee-pays-dauge.webp'],
      ['The Cider Route', '12 min', 'Calvados, orchards, and visits with local producers.', '/images/route-du-cidre.jpg'],
      ['The beaches of Cabourg', '18 min away', 'Fine sand, striped beach huts, and a Belle Époque seafront.', '/images/plage-cabourg.webp'],
      ['Deauville', '25 min', 'Stroll the boardwalk and dine by the marina.', '/images/deauville.webp']
    ],
    reviewsSection: {
      eyebrow: 'Stays worth remembering', h2: 'They say it<br><em>better than we do.</em>',
      count: '267', countLabel: 'Airbnb reviews', overallRating: '4.9'
    },
    ratingCategories: [['Cleanliness', '4.8'], ['Accuracy', ''], ['Communication', ''], ['Location', '4.8'], ['Check-in', ''], ['Value', '4.8']],
    // Genuine reviews published on Airbnb (faithful excerpts, translated).
    reviews: [
      ['C', 'Chris', 'September 2026', 'A fabulous house full of character, perfectly located to discover the many attractions of Normandy. Having breakfast on the sunny terrace while enjoying the view over the beautiful grounds was a particular pleasure.'],
      ['FJ', 'Felicity Jane', 'August 2026', 'What a wonderful house! It was extremely welcoming, and we spent a lot of time in the beautiful garden. Our girls had a fantastic time exploring the grounds and everything felt very safe.'],
      ['M', 'Mark', 'May 2026', 'Comfortable home close to the coast and the D-Day beaches. Communication with Christophe was excellent. The garden was truly beautiful! We had barbecues on several evenings.'],
      ['R', 'Reda', 'May 2026', 'We had an exceptional stay in this house in Normandy. The space is huge and very comfortable, tucked away in a secluded green corner, very quiet. The hosts are lovely, truly attentive and kind.'],
      ['T', 'Thomas', 'December 2025', 'A superb winter stay. A very responsive host, generous with firewood. The little welcome basket is a lovely touch. The beds are comfortable and well kept. I warmly recommend this place.']
    ],
    pricing: {
      eyebrow: 'Rates', h2: 'The longer you stay,<br><em>the less you pay.</em>',
      intro: 'Book direct, with no platform fees.',
      current: 'Current season', perNight: 'night', approx: '≈ ',
      seasons: [
        { id: 'basse', name: 'Low season', months: 'January, February, March, October and November', monthNumbers: [1, 2, 3, 10, 11],
          rows: [['Weekend · 2 nights', '€500', '€250'], ['Weekend · 3 nights', '€700', '€233'], ['4 to 6 nights', '', '€220'], ['Week · 7 nights', '€1,400', '€200'], ['More than 7 nights', '', '€185']] },
        { id: 'haute', name: 'High season', months: 'April to September and December', monthNumbers: [4, 5, 6, 7, 8, 9, 12],
          rows: [['Weekend · 2 nights', '€600', '€300'], ['Weekend · 3 nights', '€800', '€267'], ['4 to 6 nights', '', '€250'], ['Week · 7 nights', '€1,680', '€240'], ['More than 7 nights', '', '€225']] }
      ],
      included: ['The whole house, up to 8 guests', 'Bed linen provided', 'End-of-stay cleaning included', 'Nothing is charged when you ask'],
      cta: 'Check my dates', note: 'We confirm the exact price of your stay within 48 hours.'
    },
    faqSection: { eyebrow: 'Good to know', h2: 'Everything you need<br>to <em>picture it.</em>', intro: 'A question before booking? You can also write directly to Christophe.', contact: 'Contact Christophe' },
    faq: [
      ['What are the check-in and check-out times?', 'Check-in is from 4pm and check-out before 11am. Self check-in can be arranged on request.'],
      ['How many guests can the house accommodate?', 'The house comfortably sleeps up to 8 guests, with four bedrooms, seven beds and three bathrooms.'],
      ['Are linen and cleaning included?', 'Yes: sheets, towels and soap are provided, and end-of-stay cleaning is included. A washing machine and tumble dryer are available, and an extra cleaning visit can be booked.'],
      ['Is the house suitable for children and babies?', 'Yes: a cot, a high chair, board games and a ping-pong table await you, in an enclosed, tree-lined 8,000 m² garden.'],
      ['Are pets allowed?', 'Your pets are welcome with advance notice, so we can prepare properly for their arrival.'],
      ['Where is the house and how do I get there?', 'In Danestal, in the heart of the Pays d’Auge: the beaches of Cabourg are 18 minutes away, Deauville 25 minutes and Paris about 2 h 15 via the A13. Free parking on site. Our Pays d’Auge guide covers every outing.']
    ],
    finalCta: {
      eyebrow: 'Danestal, Normandy', h2: 'What if your next<br>memory started <em>here?</em>',
      imageAlt: 'Aerial view of the house and surrounding countryside', button: 'Book now', note: 'Quick reply via WhatsApp'
    },
    footer: { tagline: 'A family home, in Danestal.', linkHouse: 'The house', linkFaq: 'FAQ', linkGuide: 'Pays d’Auge guide', linkContact: 'Contact', copyright: '© 2026 Villa Normande', bottomNote: 'Direct & secure booking' },
    reserveModal: {
      picker: { choose: 'Add date', title: 'Select dates', subtitle: 'Add your travel dates for exact pricing', arrival: 'Choose your arrival date', departure: 'Choose your departure date', clear: 'Clear dates', done: 'Close', back: 'Back to the form', loading: 'Loading availability…', prev: 'Previous month', next: 'Next month', booked: 'Already booked' },
      estimate: { total: 'Estimated total', night: (n) => `${n} night${n > 1 ? 's' : ''}`, perNight: 'night', approx: '≈ ', seasons: { basse: 'Low season', haute: 'High season', both: 'Low and high season' }, oneNight: 'Price on request for one night', locale: 'en-GB' },
      title: 'Book now', intro: 'Send your request: Christophe will get back to you by email or phone within 48 hours at most. Nothing is charged at this stage.',
      name: 'Your name', namePlaceholder: 'First and last name', email: 'Email', emailPlaceholder: 'you@example.com', phone: 'Phone (optional)', phonePlaceholder: '+44 7700 900123',
      arrival: 'Check-in', departure: 'Check-out', guests: 'Guests',
      message: 'Message (optional)', messagePlaceholder: 'Anything else to add?', submit: 'Send my request', sending: 'Sending…',
      whatsapp: 'Prefer WhatsApp? Message Christophe',
      successTitle: 'Request sent', successText: 'Thank you! Christophe has received your request and will reply within 48 hours at most. A confirmation email is on its way to you.', successClose: 'Close',
      errors: {
        invalid_name: 'Please enter your name.', invalid_email: 'This email address doesn’t look valid.', invalid_phone: 'This phone number doesn’t look valid.',
        invalid_range: 'Choose an upcoming check-in date and a check-out date after it.', too_long: 'For stays over 60 nights, please contact Christophe directly.',
        invalid_guests: 'The house sleeps 1 to 8 guests.', unavailable: 'These dates are no longer available. Please choose another period.',
        too_many_requests: 'Several requests have already been sent. Try again in an hour or use WhatsApp.', network: 'Connection failed. Check your network and try again.',
        server_error: 'Something went wrong. Try again or use WhatsApp.'
      }
    },
    toast: { conflict: 'Stay not available: a night already booked falls within this period.' },
    whatsapp: (name, arrival, departure, guestCount) => `Hello Christophe, I would like to book Villa Normande from ${arrival} to ${departure} for ${guestCount} guest${guestCount > 1 ? 's' : ''}. My name: ${name}.`,
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    formatShort: (day, monthAbbr) => `${monthAbbr} ${day}`,
    formatFull: (day, month, year) => `${month} ${day}, ${year}`
  }
};
