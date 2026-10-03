// Guide du pays d'Auge (FR / EN) : page pré-générée au build, pensée pour les visiteurs qui
// préparent un séjour en Normandie (SEO), pour être cité par les moteurs IA (GEO) et pour
// répondre directement aux questions (AEO). Temps de trajet indicatifs, en voiture, depuis Danestal.
import { SITE_URL } from './site.js';

export const GUIDE_PATHS = { fr: '/normandie-pays-d-auge', en: '/en/normandy-guide' };
const HOME = { fr: '/', en: '/en' };

export const guide = {
  fr: {
    meta: {
      title: 'Que faire dans le pays d’Auge et en Normandie ? Guide 2026',
      description: 'Deauville, Honfleur, Cabourg, route du cidre, Mémorial de Caen, plages du Débarquement, Bayeux : nos idées de sorties autour de Danestal, avec les temps de trajet.'
    },
    nav: { home: 'La maison', book: 'Je réserve', lang: 'EN', langAria: 'English version', breadcrumb: 'Guide du pays d’Auge' },
    eyebrow: 'Guide de voyage · Calvados, Normandie',
    h1: 'Que faire dans le pays d’Auge et en Normandie ?',
    intro: 'Plages de la côte Fleurie, villages à colombages, route du cidre, plages du Débarquement : depuis la Villa Normande, à Danestal, l’essentiel de la Normandie se rejoint en moins d’une heure et demie. Voici nos idées de sorties, classées par envie, avec les temps de trajet en voiture.',
    where: {
      h2: 'Où se trouve Danestal ?',
      text: 'Danestal est un village du pays d’Auge, dans le Calvados, entre Pont-l’Évêque et Dozulé. Il se trouve à environ 18 minutes des plages de Cabourg, 25 minutes de Deauville, 40 minutes de Caen et 2 h 15 de Paris. C’est un point de départ idéal pour visiter la côte Fleurie, la campagne normande et les plages du Débarquement.'
    },
    sections: [
      {
        id: 'cote-fleurie', h2: 'Quelles plages visiter près de Danestal ?',
        lead: 'La côte Fleurie, entre Cabourg et Honfleur, aligne les plages de sable fin et les stations Belle Époque. Les plus proches de la maison sont Cabourg et Houlgate, à moins de 20 minutes.',
        places: [
          ['Cabourg', '18 min', 'Longue plage de sable fin, promenade Marcel-Proust et Grand Hôtel : la station Belle Époque par excellence, parfaite avec des enfants.'],
          ['Houlgate', '20 min', 'Villas Belle Époque, plage familiale et falaises des Vaches Noires, connues pour leurs fossiles.'],
          ['Deauville et Trouville', '25 min', 'Les planches et les parasols colorés de Deauville, puis le marché aux poissons et les ruelles de Trouville, de l’autre côté de la Touques.'],
          ['Honfleur', '40 min', 'Le Vieux Bassin, l’église Sainte-Catherine tout en bois et les galeries d’un port qui a inspiré les peintres impressionnistes.']
        ]
      },
      {
        id: 'pays-d-auge', h2: 'Que voir dans la campagne du pays d’Auge ?',
        lead: 'Le pays d’Auge, c’est la Normandie des vergers, des manoirs à colombages et des fromages. La route du cidre passe à quelques minutes de la maison.',
        places: [
          ['La route du cidre', '12 min', 'Un circuit fléché d’une quarantaine de kilomètres entre Cambremer et Beuvron-en-Auge, ponctué de producteurs de cidre, de pommeau et de calvados.'],
          ['Beuvron-en-Auge', '20 min', 'Classé parmi les Plus Beaux Villages de France : maisons à pans de bois, halles et fête du cidre à l’automne.'],
          ['Pont-l’Évêque', '15 min', 'Capitale du fromage du même nom, avec son marché du lundi matin et ses rues anciennes.'],
          ['Lisieux', '30 min', 'La basilique Sainte-Thérèse, l’un des plus grands édifices religieux du XXe siècle et un haut lieu de pèlerinage.'],
          ['Balades autour de Danestal', 'Sur place', 'Chemins creux entre pommiers, haies et prés où paissent les vaches normandes.']
        ]
      },
      {
        id: 'debarquement', h2: 'Comment visiter les plages du Débarquement depuis le pays d’Auge ?',
        lead: 'Les sites du Débarquement du 6 juin 1944 se trouvent entre 30 minutes et 1 h 20 de Danestal. En partant tôt, on peut enchaîner le Mémorial de Caen, Pegasus Bridge, Arromanches et le cimetière américain dans la même journée.',
        places: [
          ['Pegasus Bridge', '30 min', 'Le pont de Bénouville, premier lieu libéré dans la nuit du 5 au 6 juin 1944 par les parachutistes britanniques, et son musée Mémorial Pegasus.'],
          ['Mémorial de Caen', '40 min', 'Musée majeur pour comprendre la Seconde Guerre mondiale, le Débarquement et la bataille de Normandie. Comptez une demi-journée.'],
          ['Sword et Juno Beach', '35 à 50 min', 'Les plages des débarquements britannique et canadien, autour de Ouistreham et Courseulles-sur-Mer, où se trouve le Centre Juno Beach.'],
          ['Arromanches et Gold Beach', '1 h', 'Les vestiges du port artificiel construit par les Alliés, visibles depuis la plage et les falaises.'],
          ['Bayeux', '55 min', 'La célèbre tapisserie du XIe siècle, la cathédrale Notre-Dame et une vieille ville préservée, l’une des premières libérées en 1944.'],
          ['Cimetière américain de Colleville-sur-Mer', '1 h 10', 'Plus de 9 000 tombes blanches face à Omaha Beach : l’un des lieux les plus émouvants de Normandie.'],
          ['Omaha Beach et la pointe du Hoc', '1 h 10 à 1 h 20', 'La plage du débarquement américain et les falaises escaladées par les Rangers, encore marquées par les cratères des bombardements.']
        ]
      },
      {
        id: 'plus-loin', h2: 'Quelles excursions faire à la journée ?',
        lead: 'Pour une grande journée, deux incontournables de la Normandie sont accessibles en voiture : les falaises d’Étretat et le Mont-Saint-Michel.',
        places: [
          ['Étretat', '1 h 10', 'Les falaises de craie, l’Aiguille et la porte d’Aval, par le pont de Normandie.'],
          ['Le Mont-Saint-Michel', 'environ 2 h', 'L’abbaye et la baie classées au patrimoine mondial de l’Unesco. Partez tôt pour profiter du site avant l’affluence.']
        ]
      }
    ],
    table: { h2: 'Combien de temps pour aller de Danestal aux principaux sites ?', caption: 'Temps indicatifs en voiture depuis la Villa Normande, hors trafic.', cols: ['Lieu', 'Trajet', 'Idéal pour'],
      rows: [
        ['Route du cidre', '12 min', 'Dégustations, vergers'], ['Pont-l’Évêque', '15 min', 'Marché, fromages'], ['Cabourg', '18 min', 'Plage en famille'],
        ['Beuvron-en-Auge', '20 min', 'Village de caractère'], ['Deauville et Trouville', '25 min', 'Plage, balade, restaurants'], ['Lisieux', '30 min', 'Basilique'],
        ['Pegasus Bridge', '30 min', 'Histoire du Débarquement'], ['Honfleur', '40 min', 'Port, peintres, galeries'], ['Mémorial de Caen', '40 min', 'Comprendre 1944'],
        ['Bayeux', '55 min', 'Tapisserie, vieille ville'], ['Arromanches', '1 h', 'Port artificiel'], ['Cimetière américain', '1 h 10', 'Mémoire, Omaha Beach'],
        ['Étretat', '1 h 10', 'Falaises'], ['Mont-Saint-Michel', 'environ 2 h', 'Excursion à la journée'], ['Paris', '2 h 15', 'Accès en voiture (A13)']
      ] },
    seasons: { h2: 'Quand venir dans le pays d’Auge ?', items: [
      ['Au printemps', 'Les pommiers sont en fleurs de fin avril à mai : la meilleure saison pour les balades et les photos.'],
      ['En été', 'Plages de la côte Fleurie, marchés et soirées au jardin. Réservez tôt pour juillet et août.'],
      ['En septembre et octobre', 'Festival du cinéma américain de Deauville début septembre, puis récolte des pommes et fêtes du cidre.'],
      ['En hiver', 'Feux de cheminée, jacuzzi et plages désertes : la Normandie au calme, idéale pour un week-end.']
    ] },
    access: { h2: 'Comment venir à Danestal ?', items: [
      ['En voiture', 'Environ 2 h 15 depuis Paris par l’autoroute A13. Parking gratuit sur place.'],
      ['En train', 'Paris-Saint-Lazare dessert Lisieux et Deauville-Trouville en 2 h environ, puis environ 30 minutes de voiture.'],
      ['Sur place', 'Une voiture est indispensable pour profiter de la région.']
    ] },
    faq: { h2: 'Questions fréquentes sur la région', items: [
      ['Quelle est la plage la plus proche de Danestal ?', 'Les plages de Cabourg et de Houlgate sont les plus proches, à environ 18 à 20 minutes en voiture.'],
      ['Peut-on visiter les plages du Débarquement depuis le pays d’Auge ?', 'Oui. Pegasus Bridge est à 30 minutes, le Mémorial de Caen à 40 minutes et le cimetière américain de Colleville-sur-Mer à environ 1 h 10 : une journée suffit pour voir l’essentiel.'],
      ['Combien de temps faut-il pour voir la tapisserie de Bayeux ?', 'Comptez environ 1 h 30 pour la tapisserie et son musée, et une demi-journée avec la cathédrale et la vieille ville. Bayeux est à 55 minutes de Danestal.'],
      ['Que faire en Normandie avec des enfants ?', 'Plages de Cabourg et Houlgate, fossiles des Vaches Noires, fermes et vergers de la route du cidre, Pegasus Bridge pour les plus grands, et le jardin de 8 000 m² de la maison.'],
      ['Que faire dans le pays d’Auge quand il pleut ?', 'Le Mémorial de Caen, la tapisserie de Bayeux, les caves de cidre et de calvados, la basilique de Lisieux et les galeries d’Honfleur.'],
      ['Quelle est la meilleure période pour visiter le pays d’Auge ?', 'Le printemps pour les pommiers en fleurs, l’été pour les plages, l’automne pour le cidre et l’hiver pour le calme et les feux de cheminée.']
    ] },
    cta: { h2: 'Séjourner au cœur du pays d’Auge', text: 'La Villa Normande accueille jusqu’à 8 voyageurs dans une maison à colombages avec jacuzzi, cheminée et jardin de 8 000 m², à Danestal.', button: 'Voir la maison et réserver' },
    footer: { tagline: 'Une maison de famille, à Danestal.', home: 'La maison', faq: 'Questions fréquentes', contact: 'Contact' },
    updated: 'Mis à jour en octobre 2026'
  },

  en: {
    meta: {
      title: 'Things to do in the Pays d’Auge and Normandy: 2026 guide',
      description: 'Deauville, Honfleur, Cabourg, the Cider Route, Caen Memorial, D-Day beaches, Bayeux: day-trip ideas around Danestal, with driving times.'
    },
    nav: { home: 'The house', book: 'Book now', lang: 'FR', langAria: 'Version française', breadcrumb: 'Pays d’Auge guide' },
    eyebrow: 'Travel guide · Calvados, Normandy',
    h1: 'What to do in the Pays d’Auge and Normandy?',
    intro: 'Côte Fleurie beaches, half-timbered villages, the Cider Route, the D-Day beaches: from Villa Normande in Danestal, the best of Normandy is less than an hour and a half away. Here are our outing ideas, grouped by mood, with driving times.',
    where: {
      h2: 'Where is Danestal?',
      text: 'Danestal is a village in the Pays d’Auge, in the Calvados department of Normandy, between Pont-l’Évêque and Dozulé. It is about 18 minutes from the beaches of Cabourg, 25 minutes from Deauville, 40 minutes from Caen and 2 h 15 from Paris: an ideal base for the Côte Fleurie, the Normandy countryside and the D-Day beaches.'
    },
    sections: [
      {
        id: 'cote-fleurie', h2: 'Which beaches are near Danestal?',
        lead: 'The Côte Fleurie, between Cabourg and Honfleur, is a string of sandy beaches and Belle Époque resorts. The closest to the house are Cabourg and Houlgate, under 20 minutes away.',
        places: [
          ['Cabourg', '18 min', 'A long sandy beach, the Marcel Proust promenade and the Grand Hôtel: the classic Belle Époque resort, perfect with children.'],
          ['Houlgate', '20 min', 'Belle Époque villas, a family beach and the Vaches Noires cliffs, known for their fossils.'],
          ['Deauville and Trouville', '25 min', 'Deauville’s boardwalk and colourful parasols, then Trouville’s fish market and lanes across the Touques river.'],
          ['Honfleur', '40 min', 'The Vieux Bassin harbour, the wooden Sainte-Catherine church and the galleries of a port that inspired the Impressionists.']
        ]
      },
      {
        id: 'pays-d-auge', h2: 'What to see in the Pays d’Auge countryside?',
        lead: 'The Pays d’Auge is the Normandy of orchards, half-timbered manors and cheese. The Cider Route runs a few minutes from the house.',
        places: [
          ['The Cider Route', '12 min', 'A signposted loop of about 40 km between Cambremer and Beuvron-en-Auge, dotted with cider, pommeau and calvados producers.'],
          ['Beuvron-en-Auge', '20 min', 'Listed among the Most Beautiful Villages of France: timber-framed houses, covered market and an autumn cider festival.'],
          ['Pont-l’Évêque', '15 min', 'Home of the cheese of the same name, with a Monday morning market and old streets.'],
          ['Lisieux', '30 min', 'The Basilica of Saint Thérèse, one of the largest religious buildings of the 20th century and a major pilgrimage site.'],
          ['Walks around Danestal', 'On site', 'Sunken lanes between apple trees, hedgerows and meadows grazed by Normandy cows.']
        ]
      },
      {
        id: 'debarquement', h2: 'How to visit the D-Day beaches from the Pays d’Auge?',
        lead: 'The sites of the 6 June 1944 landings are between 30 minutes and 1 h 20 from Danestal. With an early start, you can see the Caen Memorial, Pegasus Bridge, Arromanches and the American Cemetery in a single day.',
        places: [
          ['Pegasus Bridge', '30 min', 'The Bénouville bridge, the first place liberated on the night of 5 to 6 June 1944 by British paratroopers, and its Pegasus Memorial museum.'],
          ['Caen Memorial', '40 min', 'A major museum on the Second World War, D-Day and the Battle of Normandy. Allow half a day.'],
          ['Sword and Juno Beach', '35 to 50 min', 'The British and Canadian landing beaches around Ouistreham and Courseulles-sur-Mer, home to the Juno Beach Centre.'],
          ['Arromanches and Gold Beach', '1 h', 'The remains of the artificial harbour built by the Allies, visible from the beach and the cliffs.'],
          ['Bayeux', '55 min', 'The famous 11th-century tapestry, Notre-Dame cathedral and a preserved old town, one of the first liberated in 1944.'],
          ['Normandy American Cemetery, Colleville-sur-Mer', '1 h 10', 'More than 9,000 white headstones overlooking Omaha Beach: one of the most moving places in Normandy.'],
          ['Omaha Beach and Pointe du Hoc', '1 h 10 to 1 h 20', 'The American landing beach and the cliffs scaled by the Rangers, still marked by bomb craters.']
        ]
      },
      {
        id: 'plus-loin', h2: 'Which day trips are worth it?',
        lead: 'For a big day out, two Normandy icons are within driving distance: the cliffs of Étretat and Mont-Saint-Michel.',
        places: [
          ['Étretat', '1 h 10', 'Chalk cliffs, the Needle and the Porte d’Aval arch, via the Pont de Normandie.'],
          ['Mont-Saint-Michel', 'about 2 h', 'The abbey and bay, a UNESCO World Heritage site. Leave early to enjoy it before the crowds.']
        ]
      }
    ],
    table: { h2: 'How long does it take to get from Danestal to the main sights?', caption: 'Approximate driving times from Villa Normande, without traffic.', cols: ['Place', 'Drive', 'Best for'],
      rows: [
        ['Cider Route', '12 min', 'Tastings, orchards'], ['Pont-l’Évêque', '15 min', 'Market, cheese'], ['Cabourg', '18 min', 'Family beach'],
        ['Beuvron-en-Auge', '20 min', 'Historic village'], ['Deauville and Trouville', '25 min', 'Beach, strolls, restaurants'], ['Lisieux', '30 min', 'Basilica'],
        ['Pegasus Bridge', '30 min', 'D-Day history'], ['Honfleur', '40 min', 'Harbour, painters, galleries'], ['Caen Memorial', '40 min', 'Understanding 1944'],
        ['Bayeux', '55 min', 'Tapestry, old town'], ['Arromanches', '1 h', 'Artificial harbour'], ['American Cemetery', '1 h 10', 'Remembrance, Omaha Beach'],
        ['Étretat', '1 h 10', 'Cliffs'], ['Mont-Saint-Michel', 'about 2 h', 'Day trip'], ['Paris', '2 h 15', 'By car (A13)']
      ] },
    seasons: { h2: 'When is the best time to visit the Pays d’Auge?', items: [
      ['Spring', 'Apple trees blossom from late April to May: the best season for walks and photos.'],
      ['Summer', 'Côte Fleurie beaches, markets and evenings in the garden. Book early for July and August.'],
      ['September and October', 'The Deauville American Film Festival in early September, then the apple harvest and cider festivals.'],
      ['Winter', 'Log fires, the hot tub and empty beaches: Normandy at its calmest, ideal for a weekend.']
    ] },
    access: { h2: 'How to get to Danestal?', items: [
      ['By car', 'About 2 h 15 from Paris on the A13 motorway. Free parking on site.'],
      ['By train', 'Paris-Saint-Lazare serves Lisieux and Deauville-Trouville in about 2 hours, then about 30 minutes by car.'],
      ['Getting around', 'A car is essential to make the most of the region.']
    ] },
    faq: { h2: 'Frequently asked questions about the area', items: [
      ['What is the closest beach to Danestal?', 'The beaches of Cabourg and Houlgate are the closest, about 18 to 20 minutes away by car.'],
      ['Can you visit the D-Day beaches from the Pays d’Auge?', 'Yes. Pegasus Bridge is 30 minutes away, the Caen Memorial 40 minutes and the American Cemetery at Colleville-sur-Mer about 1 h 10: one day is enough to see the essentials.'],
      ['How long does it take to see the Bayeux Tapestry?', 'Allow about 1 h 30 for the tapestry and its museum, and half a day with the cathedral and old town. Bayeux is 55 minutes from Danestal.'],
      ['What to do in Normandy with children?', 'The beaches of Cabourg and Houlgate, the Vaches Noires fossils, farms and orchards on the Cider Route, Pegasus Bridge for older children, and the house’s 8,000 m² garden.'],
      ['What to do in the Pays d’Auge when it rains?', 'The Caen Memorial, the Bayeux Tapestry, cider and calvados cellars, the Lisieux basilica and the galleries of Honfleur.'],
      ['When is the best time to visit the Pays d’Auge?', 'Spring for apple blossom, summer for the beaches, autumn for cider and winter for peace and log fires.']
    ] },
    cta: { h2: 'Stay in the heart of the Pays d’Auge', text: 'Villa Normande welcomes up to 8 guests in a half-timbered house with a hot tub, fireplace and 8,000 m² garden, in Danestal.', button: 'See the house and book' },
    footer: { tagline: 'A family home, in Danestal.', home: 'The house', faq: 'FAQ', contact: 'Contact' },
    updated: 'Updated October 2026'
  }
};

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
const arrow = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

export function guideHead(lang) {
  const g = guide[lang];
  const other = lang === 'fr' ? 'en' : 'fr';
  const url = SITE_URL + GUIDE_PATHS[lang];
  const image = `${SITE_URL}/images/les-alentours.jpeg`;
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Villa Normande', item: SITE_URL + HOME[lang] },
    { '@type': 'ListItem', position: 2, name: g.nav.breadcrumb, item: url }
  ] };
  const article = { '@context': 'https://schema.org', '@type': 'Article', headline: g.h1, description: g.meta.description, inLanguage: lang,
    url, image, dateModified: '2026-10-03', author: { '@type': 'Person', name: 'Christophe', url: SITE_URL + HOME[lang] },
    publisher: { '@id': `${SITE_URL}/#maison` },
    about: { '@type': 'Place', name: 'Pays d’Auge', containedInPlace: { '@type': 'AdministrativeArea', name: 'Calvados, Normandie' } },
    mentions: g.sections.flatMap((section) => section.places.map(([name, , text]) => ({ '@type': 'TouristAttraction', name, description: text }))) };
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: lang,
    mainEntity: [[g.where.h2, g.where.text], ...g.faq.items].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  return [
    `<title>${esc(g.meta.title)}</title>`,
    `<meta name="description" content="${esc(g.meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="fr" href="${SITE_URL}${GUIDE_PATHS.fr}" />`,
    `<link rel="alternate" hreflang="en" href="${SITE_URL}${GUIDE_PATHS.en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${GUIDE_PATHS.fr}" />`,
    '<meta name="robots" content="index, follow, max-image-preview:large" />',
    '<meta property="og:type" content="article" />',
    '<meta property="og:site_name" content="Villa Normande" />',
    `<meta property="og:locale" content="${lang === 'fr' ? 'fr_FR' : 'en_GB'}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(g.meta.title)}" />`,
    `<meta property="og:description" content="${esc(g.meta.description)}" />`,
    `<meta property="og:image" content="${SITE_URL}/og-image.jpg" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    jsonLd(breadcrumb), jsonLd(article), jsonLd(faq)
  ].join('\n    ');
}

export function renderGuide(lang) {
  const g = guide[lang];
  const other = lang === 'fr' ? 'en' : 'fr';
  const home = HOME[lang];
  const places = (section) => section.places.map(([name, time, text]) => `
          <article class="guide-place"><div class="guide-place-head"><h3>${esc(name)}</h3><span class="guide-time">${esc(time)}</span></div><p>${esc(text)}</p></article>`).join('');
  return `
  <header class="site-header guide-header">
    <a class="brand" href="${home}" aria-label="Villa Normande"><span class="brand-mark"><i></i><i></i></span><span>Villa<br><em>Normande</em></span></a>
    <nav class="guide-nav" aria-label="${esc(g.nav.breadcrumb)}">
      <a href="${home}">${esc(g.nav.home)}</a>
      <a class="guide-lang" href="${GUIDE_PATHS[other]}" hreflang="${other}" aria-label="${esc(g.nav.langAria)}">${g.nav.lang}</a>
      <a class="header-cta" href="${home}#booking">${esc(g.nav.book)} ${arrow}</a>
    </nav>
  </header>
  <main class="guide">
    <section class="guide-hero" style="--image:url('/images/les-alentours.jpeg')">
      <div class="guide-hero-wash"></div>
      <div class="shell guide-hero-copy">
        <nav class="guide-breadcrumb" aria-label="Fil d’Ariane"><a href="${home}">Villa Normande</a> <span aria-hidden="true">/</span> <span>${esc(g.nav.breadcrumb)}</span></nav>
        <p class="eyebrow light"><span></span>${esc(g.eyebrow)}</p>
        <h1>${esc(g.h1)}</h1>
        <p class="guide-intro">${esc(g.intro)}</p>
        <p class="guide-updated">${esc(g.updated)}</p>
      </div>
    </section>

    <div class="shell guide-body">
      <nav class="guide-toc" aria-label="Sommaire">
        ${g.sections.map((section) => `<a href="#${section.id}">${esc(section.h2)}</a>`).join('')}
        <a href="#trajets">${esc(g.table.h2)}</a>
      </nav>

      <section class="guide-section guide-where">
        <h2>${esc(g.where.h2)}</h2>
        <p class="guide-answer">${esc(g.where.text)}</p>
      </section>

      ${g.sections.map((section) => `
      <section class="guide-section" id="${section.id}">
        <h2>${esc(section.h2)}</h2>
        <p class="guide-answer">${esc(section.lead)}</p>
        <div class="guide-places">${places(section)}
        </div>
      </section>`).join('')}

      <section class="guide-section" id="trajets">
        <h2>${esc(g.table.h2)}</h2>
        <div class="guide-table-wrap"><table class="guide-table">
          <caption>${esc(g.table.caption)}</caption>
          <thead><tr>${g.table.cols.map((col) => `<th scope="col">${esc(col)}</th>`).join('')}</tr></thead>
          <tbody>${g.table.rows.map(([place, time, best]) => `<tr><th scope="row">${esc(place)}</th><td>${esc(time)}</td><td>${esc(best)}</td></tr>`).join('')}</tbody>
        </table></div>
      </section>

      <div class="guide-two">
        <section class="guide-section">
          <h2>${esc(g.seasons.h2)}</h2>
          <ul class="guide-list">${g.seasons.items.map(([title, text]) => `<li><strong>${esc(title)}</strong> ${esc(text)}</li>`).join('')}</ul>
        </section>
        <section class="guide-section">
          <h2>${esc(g.access.h2)}</h2>
          <ul class="guide-list">${g.access.items.map(([title, text]) => `<li><strong>${esc(title)}</strong> ${esc(text)}</li>`).join('')}</ul>
        </section>
      </div>

      <section class="guide-section guide-faq">
        <h2>${esc(g.faq.h2)}</h2>
        ${g.faq.items.map(([q, a]) => `<details><summary>${esc(q)}<span aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join('')}
      </section>

      <section class="guide-cta">
        <div><h2>${esc(g.cta.h2)}</h2><p>${esc(g.cta.text)}</p></div>
        <a class="reserve-button guide-cta-button" href="${home}">${esc(g.cta.button)} ${arrow}</a>
      </section>
    </div>
  </main>
  <footer><div class="shell footer-row"><a class="brand footer-brand" href="${home}"><span class="brand-mark"><i></i><i></i></span><span>Villa<br><em>Normande</em></span></a><p>${esc(g.footer.tagline)}</p><div><a href="${home}">${esc(g.footer.home)}</a><a href="${home}#faq">${esc(g.footer.faq)}</a><a href="mailto:contact@villanormande.com">${esc(g.footer.contact)}</a></div></div><div class="shell footer-bottom"><span>© 2026 Villa Normande</span><span>Danestal, Calvados, Normandie</span></div></footer>`;
}
