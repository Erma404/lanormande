// Balises <head> générées au build pour chaque langue : SEO, aperçus de partage, données structurées.
import { SITE_URL } from './site.js';

const PATHS = { fr: '/', en: '/en' };
const LOCALES = { fr: 'fr_FR', en: 'en_GB' };
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const text = (html) => String(html).replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const attr = (value) => text(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// Empêche toute sortie du bloc <script> JSON-LD.
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export function headTags(lang, t) {
  const url = SITE_URL + PATHS[lang];
  const other = lang === 'fr' ? 'en' : 'fr';

  const lodging = {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    '@id': `${SITE_URL}/#maison`,
    name: 'Villa Normande',
    description: text(t.meta.description),
    url,
    image: [OG_IMAGE, `${SITE_URL}/images/la-maison.jpeg`, `${SITE_URL}/images/piece-de-vie.jpeg`, `${SITE_URL}/images/les-alentours.jpeg`],
    telephone: '+33603830585',
    priceRange: text(t.booking.fromPrice),
    address: { '@type': 'PostalAddress', addressLocality: 'Danestal', postalCode: '14430', addressRegion: 'Calvados, Normandie', addressCountry: 'FR' },
    geo: { '@type': 'GeoCoordinates', latitude: 49.2503, longitude: 0.0198 },
    containedInPlace: { '@type': 'Place', name: 'Pays d’Auge, Calvados, Normandie' },
    // Annonce Airbnb de la même maison : relie l'entité au reste du web.
    sameAs: ['https://www.airbnb.fr/rooms/43267561'],
    containsPlace: {
      '@type': 'Accommodation',
      additionalType: 'House',
      occupancy: { '@type': 'QuantitativeValue', maxValue: 8 },
      numberOfBedrooms: 4,
      numberOfBathroomsTotal: 3,
      petsAllowed: true
    },
    subjectOf: { '@type': 'Article', url: `${SITE_URL}${lang === 'en' ? '/en/normandy-guide' : '/normandie-pays-d-auge'}` },
    checkinTime: '16:00',
    checkoutTime: '11:00',
    numberOfRooms: 4,
    amenityFeature: t.amenities.map(([, label]) => ({ '@type': 'LocationFeatureSpecification', name: text(label), value: true })),
    inLanguage: lang
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: t.faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: text(question),
      acceptedAnswer: { '@type': 'Answer', text: text(answer) }
    }))
  };

  return [
    `<title>${attr(t.meta.title)}</title>`,
    `<meta name="description" content="${attr(t.meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="fr" href="${SITE_URL}${PATHS.fr}" />`,
    `<link rel="alternate" hreflang="en" href="${SITE_URL}${PATHS.en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${PATHS.fr}" />`,
    '<meta name="robots" content="index, follow, max-image-preview:large" />',
    '<meta name="theme-color" content="#201b17" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Villa Normande" />',
    `<meta property="og:locale" content="${LOCALES[lang]}" />`,
    `<meta property="og:locale:alternate" content="${LOCALES[other]}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${attr(t.meta.title)}" />`,
    `<meta property="og:description" content="${attr(t.meta.description)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${attr(t.finalCta.imageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${attr(t.meta.title)}" />`,
    `<meta name="twitter:description" content="${attr(t.meta.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    '<link rel="preload" as="image" href="/images/la-maison.jpeg" fetchpriority="high" />',
    jsonLd(lodging),
    jsonLd(faq)
  ].join('\n    ');
}
