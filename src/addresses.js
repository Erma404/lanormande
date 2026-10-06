// Bonnes adresses de Christophe (FR / EN) : boulangeries, restaurants, marchés et producteurs
// autour de Danestal. Page hors menu, ouverte surtout depuis le QR code affiché dans la maison :
// pensée d'abord pour le téléphone. Temps de trajet en voiture depuis Danestal (calcul OSRM).
import { SITE_URL } from './site.js';
import { siteFooter } from './footer.js';
import { imgAttrs, sized, srcset } from './images.js';
import { HOUSE_COORDS, GUIDE_PATHS } from './guide.js';

export const ADDRESSES_PATHS = { fr: '/bonnes-adresses', en: '/en/local-favourites' };
const HOME = { fr: '/', en: '/en' };
const HERO = '/images/route-du-cidre.jpg';

const text = {
  fr: {
    meta: {
      title: 'Bonnes adresses autour de Danestal : boulangeries, restaurants, marchés',
      description: 'Les boulangeries, restaurants, marchés et producteurs que Christophe conseille à ses voyageurs autour de Villa Normande, à Danestal : pays d’Auge et côte Fleurie.'
    },
    nav: { home: 'La maison', guide: 'Guide', book: 'Je réserve', lang: 'EN', langAria: 'English version', breadcrumb: 'Bonnes adresses' },
    eyebrow: 'Autour de la maison · Pays d’Auge',
    h1: 'Les bonnes adresses de', h1Em: 'Christophe',
    intro: 'Pain du matin, tables du soir, marchés et cidre : nos adresses préférées, la plupart à moins de 20 minutes de la maison.',
    host: { name: 'Christophe', role: 'Votre hôte', quote: 'Une question ou une envie particulière ? Écrivez-moi sur WhatsApp, je vous oriente avec plaisir.' },
    all: 'Tout',
    groups: { boulangeries: 'Boulangeries', restaurants: 'Restaurants', marches: 'Marchés et producteurs', courses: 'Courses' },
    leads: {
      boulangeries: 'Pour le petit-déjeuner et le goûter.',
      restaurants: 'Du déjeuner sans façon au dîner d’exception, à la campagne ou face à la mer.',
      marches: 'Fromages, cidre, calvados et produits frais, en direct.',
      courses: 'Pour remplir le frigo en arrivant.'
    },
    showOnMap: 'Sur la carte',
    directions: 'Itinéraire',
    mapTitle: 'Toutes les adresses sur la carte',
    loading: 'Chargement de la carte…',
    house: 'Villa Normande', houseText: 'La maison, à Danestal.',
    note: 'Horaires et jours d’ouverture donnés à titre indicatif : un coup de fil avant de partir évite les mauvaises surprises.',
    cta: { h2: 'Envie d’aller plus loin ?', text: 'Plages, villages, route du cidre, plages du Débarquement : toutes nos idées de sorties dans le guide du pays d’Auge.', button: 'Ouvrir le guide', secondary: 'Retour à la maison' },
    footer: { tagline: 'Une maison de famille, à Danestal.', home: 'La maison', faq: 'FAQ' },
    updated: 'Mis à jour en octobre 2026'
  },
  en: {
    meta: {
      title: 'Local favourites near Danestal: bakeries, restaurants, markets',
      description: 'The bakeries, restaurants, markets and producers Christophe recommends to his guests, around Villa Normande in Danestal: Pays d’Auge and the Côte Fleurie, Normandy.'
    },
    nav: { home: 'The house', guide: 'Guide', book: 'Book', lang: 'FR', langAria: 'Version française', breadcrumb: 'Local favourites' },
    eyebrow: 'Around the house · Pays d’Auge',
    h1: 'Christophe’s', h1Em: 'local favourites',
    intro: 'Morning bread, dinner tables, markets and cider: our favourite places, most of them within 20 minutes of the house.',
    host: { name: 'Christophe', role: 'Your host', quote: 'A question or something special in mind? Message me on WhatsApp and I’ll gladly point you in the right direction.' },
    all: 'All',
    groups: { boulangeries: 'Bakeries', restaurants: 'Restaurants', marches: 'Markets and producers', courses: 'Groceries' },
    leads: {
      boulangeries: 'For breakfast and afternoon treats.',
      restaurants: 'From a relaxed lunch to a special dinner, in the countryside or by the sea.',
      marches: 'Cheese, cider, calvados and fresh produce, straight from the source.',
      courses: 'To stock the fridge when you arrive.'
    },
    showOnMap: 'On the map',
    directions: 'Directions',
    mapTitle: 'All the places on the map',
    loading: 'Loading the map…',
    house: 'Villa Normande', houseText: 'The house, in Danestal.',
    note: 'Opening days and hours are a guide only: a quick call before you set off avoids disappointment.',
    cta: { h2: 'Want to explore further?', text: 'Beaches, villages, the Cider Route, D-Day sites: all our day-out ideas are in the Pays d’Auge guide.', button: 'Open the guide', secondary: 'Back to the house' },
    footer: { tagline: 'A family home, in Danestal.', home: 'The house', faq: 'FAQ' },
    updated: 'Updated October 2026'
  }
};

// Adresses, dans l'ordre d'affichage. Coordonnées relevées une fois (OpenStreetMap).
// dest = recherche envoyée à Google Maps pour l'itinéraire. schema = type schema.org.
const PLACES = [
  { key: 'maison-conan', group: 'boulangeries', schema: 'Bakery', town: 'Dozulé', time: '6 min', coords: [49.2311, -0.0446], dest: 'Boulangerie Maison Conan, Dozulé',
    fr: { name: 'Maison Conan', kind: 'Boulangerie-pâtisserie artisanale', tip: 'La boulangerie la plus proche de la maison : pain frais et viennoiseries pour le petit-déjeuner.', info: 'Fermée le lundi' },
    en: { name: 'Maison Conan', kind: 'Artisan bakery and patisserie', tip: 'The closest bakery to the house: fresh bread and pastries for breakfast.', info: 'Closed on Mondays' } },
  { key: 'epi-d-or', group: 'boulangeries', schema: 'Bakery', town: 'Pont-l’Évêque', time: '15 min', coords: [49.2868, 0.1867], dest: 'L’Épi d’Or, 1 place Jean Bureau, Pont-l’Évêque',
    fr: { name: 'L’Épi d’Or', kind: 'Boulangerie-pâtisserie', tip: 'Réputée pour ses pâtisseries et ses croissants. À combiner avec une balade dans Pont-l’Évêque.', info: '1 place Jean Bureau' },
    en: { name: 'L’Épi d’Or', kind: 'Bakery and patisserie', tip: 'Known for its pastries and croissants. Pair it with a stroll around Pont-l’Évêque.', info: '1 place Jean Bureau' } },

  { key: 'cafe-des-arts', group: 'restaurants', schema: 'Restaurant', town: 'Beaumont-en-Auge', time: '9 min', coords: [49.2789, 0.1093], dest: 'Le Café des Arts, place de Verdun, Beaumont-en-Auge',
    fr: { name: 'Le Café des Arts', kind: 'Café-restaurant', tip: 'Terrasse couverte avec vue sur la vallée de la Touques, et la mer par temps clair. Le camembert rôti au calvados est un classique.', info: 'Place de Verdun · 02 31 64 81 70' },
    en: { name: 'Le Café des Arts', kind: 'Café-restaurant', tip: 'A covered terrace overlooking the Touques valley, with a glimpse of the sea on clear days. Try the camembert roasted with calvados.', info: 'Place de Verdun · +33 2 31 64 81 70' } },
  { key: 'auberge-abbaye', group: 'restaurants', schema: 'Restaurant', town: 'Beaumont-en-Auge', time: '9 min', coords: [49.2784, 0.1097], dest: 'Auberge de l’Abbaye, 2 rue de la Libération, Beaumont-en-Auge',
    fr: { name: 'Auberge de l’Abbaye', kind: 'Cuisine gastronomique', tip: 'Une institution du pays d’Auge, pour un dîner à deux ou une belle occasion.', info: 'Fermée mardi et mercredi · réservation conseillée' },
    en: { name: 'Auberge de l’Abbaye', kind: 'Fine dining', tip: 'A Pays d’Auge institution, for a dinner for two or a special occasion.', info: 'Closed Tuesday and Wednesday · booking advised' } },
  { key: 'auberge-touques', group: 'restaurants', schema: 'Restaurant', town: 'Pont-l’Évêque', time: '15 min', coords: [49.2863, 0.1851], dest: 'Auberge de la Touques, place de l’Église, Pont-l’Évêque',
    fr: { name: 'Auberge de la Touques', kind: 'Cuisine normande', tip: 'Poulet vallée d’Auge et spécialités du pays, au bord de la Touques.', info: 'Place de l’Église' },
    en: { name: 'Auberge de la Touques', kind: 'Norman cuisine', tip: 'Vallée d’Auge chicken and local specialities, on the banks of the Touques.', info: 'Place de l’Église' } },
  { key: 'vaucelles', group: 'restaurants', schema: 'Restaurant', town: 'Pont-l’Évêque', time: '15 min', coords: [49.2838, 0.1812], dest: 'Le Vaucelles, 39 rue de Vaucelles, Pont-l’Évêque',
    fr: { name: 'Le Vaucelles', kind: 'Cuisine traditionnelle', tip: 'Cuisine de tradition, poissons et sauces normandes, avec des menus à prix doux.', info: '39 rue de Vaucelles' },
    en: { name: 'Le Vaucelles', kind: 'Traditional cuisine', tip: 'Classic cooking, fish and Norman sauces, with good-value set menus.', info: '39 rue de Vaucelles' } },
  { key: 'hotellerie-normande', group: 'restaurants', schema: 'Restaurant', town: 'Dozulé', time: '6 min', coords: [49.2314, -0.0439], dest: 'Hôtellerie Normande, Dozulé',
    fr: { name: 'Hôtellerie Normande', kind: 'Cuisine familiale', tip: 'Cuisine généreuse au cœur de Dozulé, avec couscous et tajine maison en spécialités.', info: 'Centre de Dozulé' },
    en: { name: 'Hôtellerie Normande', kind: 'Family cooking', tip: 'Generous home cooking in the heart of Dozulé, with home-made couscous and tagine as specialities.', info: 'Dozulé town centre' } },
  { key: 'pave-d-auge', group: 'restaurants', schema: 'Restaurant', town: 'Beuvron-en-Auge', time: '14 min', coords: [49.1879, -0.046], dest: 'Le Pavé d’Auge, Beuvron-en-Auge',
    fr: { name: 'Le Pavé d’Auge', kind: 'Table gastronomique', tip: 'Sous les anciennes halles d’un des Plus Beaux Villages de France : cuisine de saison avec les producteurs du coin.', info: 'Réservation conseillée' },
    en: { name: 'Le Pavé d’Auge', kind: 'Fine dining', tip: 'In the old market hall of one of France’s Most Beautiful Villages: seasonal cooking with local producers.', info: 'Booking advised' } },
  { key: 'colomb-auge', group: 'restaurants', schema: 'Restaurant', town: 'Beuvron-en-Auge', time: '14 min', coords: [49.1883, -0.0452], dest: 'La Colomb’Auge, Beuvron-en-Auge',
    fr: { name: 'La Colomb’Auge', kind: 'Crêperie', tip: 'Galettes et crêpes après une balade dans le village. Une bonne adresse avec les enfants.', info: 'Beuvron-en-Auge' },
    en: { name: 'La Colomb’Auge', kind: 'Crêperie', tip: 'Galettes and crêpes after a wander round the village. A good choice with children.', info: 'Beuvron-en-Auge' } },

  { key: 'royalty', group: 'restaurants', schema: 'Restaurant', town: 'Houlgate', time: '17 min', coords: [49.3043, -0.0748], dest: 'Le Royalty, rue des Bains, Houlgate',
    fr: { name: 'Le Royalty', kind: 'Brasserie face à la mer', tip: 'La brasserie emblématique de Houlgate, face à la plage : moules marinières et plateaux de fruits de mer.', info: 'Bord de mer · rue des Bains' },
    en: { name: 'Le Royalty', kind: 'Seafront brasserie', tip: 'Houlgate’s landmark brasserie, facing the beach: moules marinières and seafood platters.', info: 'Seafront · rue des Bains' } },
  { key: 'baligan', group: 'restaurants', schema: 'Restaurant', town: 'Cabourg', time: '19 min', coords: [49.2906, -0.114], dest: 'Le Baligan, 8 avenue Alfred Piat, Cabourg',
    fr: { name: 'Le Baligan', kind: 'Poissons et fruits de mer', tip: 'À deux pas de la plage : on choisit son poisson du jour dans le panier présenté à table, cuisiné à la demande.', info: '8 avenue Alfred-Piat · 02 31 24 10 92' },
    en: { name: 'Le Baligan', kind: 'Fish and seafood', tip: 'A stone’s throw from the beach: pick your catch of the day from the basket brought to the table, cooked to order.', info: '8 avenue Alfred-Piat · +33 2 31 24 10 92' } },
  { key: 'vapeurs', group: 'restaurants', schema: 'Restaurant', town: 'Trouville-sur-Mer', time: '21 min', coords: [49.3654, 0.0818], dest: 'Les Vapeurs, 160 boulevard Fernand Moureaux, Trouville-sur-Mer',
    fr: { name: 'Les Vapeurs', kind: 'Brasserie de la mer', tip: 'Une institution depuis 1927, face au marché aux poissons : moules, crevettes grises et plateaux de fruits de mer.', info: 'Sur le port · service continu' },
    en: { name: 'Les Vapeurs', kind: 'Seafood brasserie', tip: 'An institution since 1927, opposite the fish market: mussels, brown shrimp and seafood platters.', info: 'On the harbour · open all day' } },

  { key: 'marche-dozule', group: 'marches', schema: 'Place', town: 'Dozulé', time: '6 min', coords: [49.2309, -0.0452], dest: 'Dozulé, Calvados',
    fr: { name: 'Marché de Dozulé', kind: 'Marché', tip: 'Le marché le plus proche, pour faire le plein de produits frais en début de semaine.', info: 'Mardi matin' },
    en: { name: 'Dozulé market', kind: 'Market', tip: 'The nearest market, to stock up on fresh produce early in the week.', info: 'Tuesday morning' } },
  { key: 'marche-dives', group: 'marches', schema: 'Place', town: 'Dives-sur-Mer', time: '15 min', coords: [49.2861, -0.0971], dest: 'Halles médiévales, rue Paul Canta, Dives-sur-Mer',
    fr: { name: 'Marché de Dives-sur-Mer', kind: 'Marché sous les halles', tip: 'Sous une charpente du XVe siècle : fromages, pain, poissons, charcuterie. L’un des plus beaux marchés de la côte.', info: 'Samedi, 8 h – 13 h' },
    en: { name: 'Dives-sur-Mer market', kind: 'Covered market', tip: 'Under a 15th-century timber hall: cheese, bread, fish and charcuterie. One of the finest markets on the coast.', info: 'Saturday, 8 am – 1 pm' } },
  { key: 'christian-drouin', group: 'marches', schema: 'Winery', town: 'Coudray-Rabut', time: '16 min', coords: [49.3048, 0.1657], dest: 'Calvados Christian Drouin, 1895 route de Trouville, Coudray-Rabut',
    fr: { name: 'Calvados Christian Drouin', kind: 'Cidre et calvados', tip: 'Distillerie familiale près de Pont-l’Évêque : visite d’une heure et dégustation de cidre, pommeau et calvados.', info: '1895 route de Trouville' },
    en: { name: 'Calvados Christian Drouin', kind: 'Cider and calvados', tip: 'A family distillery near Pont-l’Évêque: one-hour tour and tasting of cider, pommeau and calvados.', info: '1895 route de Trouville' } },
  { key: 'annabelle', group: 'marches', schema: 'Store', town: 'Pont-l’Évêque', time: '14 min', coords: [49.2873, 0.1874], dest: 'La Fromagerie d’Annabelle, 11 rue Hamelin, Pont-l’Évêque',
    fr: { name: 'La Fromagerie d’Annabelle', kind: 'Fromagerie', tip: 'Environ 150 fromages, dont un pont-l’évêque bien affiné, dans la ville qui lui a donné son nom.', info: '11 rue Hamelin · 02 31 65 54 37' },
    en: { name: 'La Fromagerie d’Annabelle', kind: 'Cheese shop', tip: 'Around 150 cheeses, including a well-aged pont-l’évêque, in the town that gave it its name.', info: '11 rue Hamelin · +33 2 31 65 54 37' } },
  { key: 'graindorge', group: 'marches', schema: 'TouristAttraction', town: 'Livarot', time: '40 min', coords: [49.001, 0.1521], dest: 'Le Village Fromager, Fromagerie Graindorge, 42 rue du Général Leclerc, Livarot',
    fr: { name: 'Le Village Fromager Graindorge', kind: 'Visite de fromagerie', tip: 'On suit la fabrication du livarot et du pont-l’évêque derrière des vitres, puis dégustation gratuite. Le matin pour voir la production.', info: 'Fermé le dimanche hors été · visite gratuite' },
    en: { name: 'Le Village Fromager Graindorge', kind: 'Cheese dairy tour', tip: 'Watch livarot and pont-l’évêque being made through glass galleries, then a free tasting. Go in the morning to see production.', info: 'Closed Sundays outside summer · free visit' } },
  { key: 'dupont', group: 'marches', schema: 'Winery', town: 'Victot-Pontfol', time: '18 min', coords: [49.1747, 0.0077], dest: 'Domaine Dupont, La Vigannerie, Victot-Pontfol',
    fr: { name: 'Domaine Dupont', kind: 'Cidre et calvados', tip: 'Domaine familial en bio, l’un des plus réputés du pays d’Auge : vergers, pressoir et chais, puis dégustation de cidre, pommeau et calvados.', info: 'Boutique du lundi au samedi, 10 h – 18 h · visites à 11 h et 15 h' },
    en: { name: 'Domaine Dupont', kind: 'Cider and calvados', tip: 'An organic family estate, one of the best known in the Pays d’Auge: orchards, press and cellars, then a cider, pommeau and calvados tasting.', info: 'Shop Monday to Saturday, 10 am – 6 pm · tours at 11 am and 3 pm' } },
  { key: 'pierre-huet', group: 'marches', schema: 'Winery', town: 'Cambremer', time: '22 min', coords: [49.148, 0.0465], dest: 'Calvados Pierre Huet, 5 avenue des Tilleuls, Cambremer',
    fr: { name: 'Calvados Pierre Huet', kind: 'Cidre et calvados', tip: 'Producteurs depuis 1865 sur la route du cidre : vergers, fûts centenaires et dégustation, avec du jus de pomme pour les enfants.', info: 'Lundi au samedi, 9 h – 12 h 30 et 14 h – 18 h' },
    en: { name: 'Calvados Pierre Huet', kind: 'Cider and calvados', tip: 'Producers since 1865 on the Cider Route: orchards, century-old casks and a tasting, with apple juice for the children.', info: 'Monday to Saturday, 9 am – 12.30 pm and 2 – 6 pm' } },

  { key: 'super-u', group: 'courses', schema: 'GroceryStore', town: 'Dozulé', time: '6 min', coords: [49.2326, -0.0382], dest: 'Super U, 20 Grande Rue, Dozulé',
    fr: { name: 'Super U Dozulé', kind: 'Supermarché', tip: 'Le supermarché le plus proche de la maison, pour les courses de la semaine.', info: 'Lundi au samedi dès 8 h 30 · dimanche matin' },
    en: { name: 'Super U Dozulé', kind: 'Supermarket', tip: 'The nearest supermarket to the house, for the weekly shop.', info: 'Monday to Saturday from 8.30 am · Sunday morning' } }
];
const GROUPS = ['boulangeries', 'restaurants', 'marches', 'courses'];
// Photos : Wikimedia Commons (licences libres, crédit affiché sur la photo), en attendant celles de Christophe.
// Exceptions demandées par l'utilisatrice (droits non vérifiés) : Café des Arts (Tripadvisor), Auberge de l'Abbaye (son site),
// Auberge de la Touques (explore-calvados.com), Le Vaucelles (sa page Facebook),
// Le Pavé d'Auge (son site), Hôtellerie Normande (Hotels.com),
// marché de Dozulé (jours-de-marche.fr, photo d'illustration, pas Dozulé),
// marché de Dives (office de tourisme Normandie Cabourg Pays d'Auge, photo Éric Larrayadieu),
// Calvados Christian Drouin (Terre d'Auge Tourisme), Le Royalty (Tripadvisor, plaque floutée).
// Pour les commerces, c'est le plus souvent le village ou la rue qui est montré, pas l'établissement.
const PHOTOS = {
  'maison-conan': { src: '/images/adresses/maison-conan.webp', credit: "Raysonho", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:APileOfCroissants.jpg" },
  'epi-d-or': { src: '/images/adresses/epi-d-or.webp', credit: "N i c o l a", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Baguette_001.jpg" },
  'cafe-des-arts': { src: '/images/adresses/cafe-des-arts.webp', credit: 'Tripadvisor', license: '', url: 'https://www.tripadvisor.fr/LocationPhotoDirectLink-g1932291-d2210493-i338619799-Le_Cafe_des_Arts-Beaumont_en_Auge_Calvados_Basse_Normandie_Normandy.html' },
  'auberge-abbaye': { src: '/images/adresses/auberge-abbaye.webp', credit: 'Auberge de l’Abbaye', license: '', url: 'https://auberge-abbaye-beaumont.fr/' },
  'auberge-touques': { src: '/images/adresses/auberge-touques.webp', credit: 'Calvados Attractivité', license: '', url: 'https://www.explore-calvados.com/restaurant/auberge-de-la-touques/' },
  'vaucelles': { src: '/images/adresses/vaucelles.webp', credit: 'Restaurant Le Vaucelles', license: '', url: 'https://www.facebook.com/p/Restaurant-Le-vaucelles-100063538905128/' },
  'hotellerie-normande': { src: '/images/adresses/hotellerie-normande.webp', credit: 'Hotels.com', license: '', url: 'https://fr.hotels.com/ho1346131552/hotellerie-normande-dozule-france/' },
  'pave-d-auge': { src: '/images/adresses/pave-d-auge.webp', credit: 'Le Pavé d’Auge', license: '', url: 'https://www.pavedauge.com/' },
  'colomb-auge': { src: '/images/adresses/colomb-auge.webp', credit: "Renhour48", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Beuvron-en-Auge_-_Vue_D.jpg" },
  'marche-dozule': { src: '/images/adresses/marche-dozule.webp', credit: 'Jours-de-marché.fr', license: '', url: 'https://www.jours-de-marche.fr/producteur-local/14430-dozule/' },
  'marche-dives': { src: '/images/adresses/marche-dives.webp', credit: 'Éric Larrayadieu, office de tourisme', license: '', url: 'https://www.normandie-cabourg-paysdauge-tourisme.fr/a-faire/culture/guillaume-le-conquerant/les-halles-medievales/' },
  'christian-drouin': { src: '/images/adresses/christian-drouin.webp', credit: 'Terre d’Auge Tourisme', license: '', url: 'https://www.terredauge-tourisme.fr/fr/preparer/a-voir-a-faire/cidre-a-la-ferme-distilleries/calvados-christian-drouin-sas' },
  'graindorge': { src: '/images/adresses/graindorge.webp', credit: "Derbrauni", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:E._Graindorge_Fromagerie.jpg" },
  'dupont': { src: '/images/adresses/dupont.webp', credit: 'Terre d’Auge Tourisme', license: '', url: 'https://www.terredauge-tourisme.fr/fr/preparer/a-voir-a-faire/cidre-a-la-ferme-distilleries/domaine-dupont' },
  'annabelle': { src: '/images/adresses/annabelle.webp', credit: 'Terre d’Auge Tourisme', license: '', url: 'https://www.terredauge-tourisme.fr/fr/preparer/shopping-services/alimentation/la-fromagerie-d-annabelle' },
  'vapeurs': { src: '/images/adresses/vapeurs.webp', credit: 'actu.fr', license: '', url: 'https://actu.fr/', position: 'center 20%' },
  'super-u': { src: '/images/adresses/super-u.webp', credit: "Julie de Coop Atlantique", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Super_U_Cozes.jpg" },
  royalty: { src: '/images/adresses/royalty.webp', credit: 'Tripadvisor', license: '', url: 'https://www.tripadvisor.fr/' },
  baligan: { src: '/images/adresses/baligan.webp', credit: 'Le Baligan', license: '', url: 'https://lebaligan.fr/' },
  'pierre-huet': { src: '/images/adresses/pierre-huet.webp', credit: 'Calvados Pierre Huet', license: '', url: 'https://www.calvados-huet.com/' }
};


const directionsUrl = (place) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('Danestal, 14430, France')}&destination=${encodeURIComponent(place.dest)}&travelmode=driving`;
const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
const arrow = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const pinIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
const routeIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11 21 3l-8 18-2-8-8-2z"/></svg>';

export function addressesHead(lang) {
  const t = text[lang];
  const url = SITE_URL + ADDRESSES_PATHS[lang];
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Villa Normande', item: SITE_URL + HOME[lang] },
    { '@type': 'ListItem', position: 2, name: t.nav.breadcrumb, item: url }
  ] };
  const list = { '@context': 'https://schema.org', '@type': 'ItemList', name: t.meta.title, inLanguage: lang, url,
    itemListElement: PLACES.map((place, index) => ({ '@type': 'ListItem', position: index + 1, item: {
      '@type': place.schema, name: place[lang].name, description: place[lang].tip,
      ...(PHOTOS[place.key] ? { image: SITE_URL + PHOTOS[place.key].src } : {}),
      address: { '@type': 'PostalAddress', addressLocality: place.town, addressRegion: 'Calvados', addressCountry: 'FR' },
      geo: { '@type': 'GeoCoordinates', latitude: place.coords[0], longitude: place.coords[1] }
    } })) };
  return [
    `<title>${esc(t.meta.title)}</title>`,
    `<meta name="description" content="${esc(t.meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="fr" href="${SITE_URL}${ADDRESSES_PATHS.fr}" />`,
    `<link rel="alternate" hreflang="en" href="${SITE_URL}${ADDRESSES_PATHS.en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${ADDRESSES_PATHS.fr}" />`,
    '<meta name="robots" content="index, follow, max-image-preview:large" />',
    '<meta name="format-detection" content="telephone=no, address=no, email=no" />',
    '<meta name="theme-color" content="#1f2a24" />',
    '<meta property="og:type" content="article" />',
    '<meta property="og:site_name" content="Villa Normande" />',
    `<meta property="og:locale" content="${lang === 'fr' ? 'fr_FR' : 'en_GB'}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(t.meta.title)}" />`,
    `<meta property="og:description" content="${esc(t.meta.description)}" />`,
    `<meta property="og:image" content="${SITE_URL}/og-villa-normande.jpg" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:image" content="${SITE_URL}/og-villa-normande.jpg" />`,
    `<link rel="preload" as="image" href="${HERO}" imagesrcset="${srcset(HERO)}" imagesizes="100vw" fetchpriority="high" />`,
    jsonLd(breadcrumb), jsonLd(list)
  ].join('\n    ');
}

export function renderAddresses(lang) {
  const t = text[lang];
  const other = lang === 'fr' ? 'en' : 'fr';
  const home = HOME[lang];
  // Numéros communs à la carte et aux fiches (guide-map.js numérote dans l'ordre des lieux).
  const mapPlaces = PLACES.map((place) => ({ key: place.key, name: place[lang].name, time: place.time, text: place[lang].tip,
    category: place.group, photo: PHOTOS[place.key] ? sized(PHOTOS[place.key].src, 480) : '', coords: place.coords, directions: directionsUrl(place) }));
  const figure = (place) => {
    const photo = PHOTOS[place.key];
    if (!photo) return '';
    return `<figure class="guide-photo addr-photo"><img ${imgAttrs(photo.src, '(max-width: 720px) 92vw, 560px')} alt="${esc(place[lang].name)}, ${esc(place.town)}" width="1200" height="800"${photo.position ? ` style="object-position: ${photo.position}"` : ''} loading="lazy" decoding="async" />${photo.credit
      ? `<figcaption><a href="${photo.url}" target="_blank" rel="noopener license">Photo : ${esc(photo.credit)}${photo.license ? `, ${esc(photo.license)}` : ''}</a></figcaption>` : ''}</figure>`;
  };
  const card = (place) => {
    const p = place[lang];
    const no = PLACES.indexOf(place) + 1;
    return `
          <li class="addr-card" data-key="${place.key}" data-category="${place.group}">${figure(place)}
            <div class="addr-card-head">
              <span class="map-item-no" aria-hidden="true">${no}</span>
              <div class="addr-card-title"><h3>${esc(p.name)}</h3><p>${esc(p.kind)} · ${esc(place.town)}</p></div>
              <span class="guide-time">${esc(place.time)}</span>
            </div>
            <p class="addr-tip">${esc(p.tip)}</p>
            ${p.info ? `<p class="addr-info">${esc(p.info)}</p>` : ''}
            <div class="addr-actions">
              <button type="button" class="addr-btn">${pinIcon}${esc(t.showOnMap)}</button>
              <a class="addr-btn addr-btn-primary" href="${directionsUrl(place)}" target="_blank" rel="noopener">${routeIcon}${esc(t.directions)}</a>
            </div>
          </li>`;
  };
  return `
  <header class="site-header guide-header">
    <a class="brand" href="${home}" aria-label="Villa Normande"><span class="brand-mark"><i></i><i></i></span><span>Villa<br><em>Normande</em></span></a>
    <nav class="guide-nav" aria-label="${esc(t.nav.breadcrumb)}">
      <a href="${home}">${esc(t.nav.home)}</a>
      <a class="addr-nav-guide" href="${GUIDE_PATHS[lang]}">${esc(t.nav.guide)}</a>
      <a class="guide-lang" href="${ADDRESSES_PATHS[other]}" hreflang="${other}" aria-label="${esc(t.nav.langAria)}">${t.nav.lang}</a>
      <a class="header-cta" href="${home}#reserver" data-reserve>${esc(t.nav.book)} ${arrow}</a>
    </nav>
  </header>
  <main class="guide addr">
    <section class="guide-hero addr-hero">
      <img class="guide-hero-img" ${imgAttrs(HERO, '100vw')} alt="" fetchpriority="high" decoding="async" />
      <div class="guide-hero-wash"></div>
      <div class="shell guide-hero-copy">
        <nav class="guide-breadcrumb" aria-label="${lang === 'fr' ? 'Fil d’Ariane' : 'Breadcrumb'}"><a href="${home}">Villa Normande</a> <span aria-hidden="true">/</span> <span>${esc(t.nav.breadcrumb)}</span></nav>
        <p class="eyebrow light"><span></span>${esc(t.eyebrow)}</p>
        <h1>${esc(t.h1)} <em>${esc(t.h1Em)}</em></h1>
        <p class="guide-intro">${esc(t.intro)}</p>
      </div>
    </section>

    <div class="shell addr-body">
      <aside class="addr-host">
        <img src="${sized('/images/christophe.jpg', 480)}" alt="${esc(t.host.name)}" width="56" height="56" loading="lazy" decoding="async" />
        <div><p class="addr-host-name"><strong>${esc(t.host.name)}</strong> · ${esc(t.host.role)}</p><p>${esc(t.host.quote)}</p></div>
      </aside>

      <div class="map-filters addr-filters" role="group" aria-label="${esc(t.mapTitle)}">
        <button type="button" class="active" data-filter="all" aria-pressed="true">${esc(t.all)}</button>
        ${GROUPS.map((id) => `<button type="button" data-filter="${id}" aria-pressed="false">${esc(t.groups[id])}</button>`).join('')}
      </div>

      <section class="addr-map" aria-label="${esc(t.mapTitle)}">
        <div class="map-canvas" id="guide-map"><p class="map-loading">${esc(t.loading)}</p></div>
        <script type="application/json" id="map-data">${JSON.stringify({ lang, house: { name: t.house, text: t.houseText, coords: HOUSE_COORDS }, places: mapPlaces, fit: 'all' }).replace(/</g, '\\u003c')}</script>
      </section>

      <div id="map-list" class="addr-groups">
        ${GROUPS.map((group) => `
        <section class="addr-group" id="${group}" data-group="${group}">
          <h2>${esc(t.groups[group])}</h2>
          <p class="addr-lead">${esc(t.leads[group])}</p>
          <ol class="addr-list">${PLACES.filter((place) => place.group === group).map(card).join('')}
          </ol>
        </section>`).join('')}
      </div>

      <p class="addr-note">${esc(t.note)} <span>${esc(t.updated)}</span></p>

      <section class="guide-cta">
        <div><h2>${esc(t.cta.h2)}</h2><p>${esc(t.cta.text)}</p></div>
        <div class="guide-cta-actions"><a class="reserve-button guide-cta-button" href="${GUIDE_PATHS[lang]}">${esc(t.cta.button)} ${arrow}</a><a class="guide-cta-secondary" href="${home}">${esc(t.cta.secondary)}</a></div>
      </section>
    </div>
  </main>
  ${siteFooter(lang, { home, faqHref: `${home}#faq`, tagline: esc(t.footer.tagline), homeLabel: esc(t.footer.home), faqLabel: esc(t.footer.faq) })}`;
}
