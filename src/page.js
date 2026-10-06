// Gabarit HTML de la page d'accueil : fonction pure, utilisée par le navigateur
// et au moment du build pour générer le HTML complet (SEO, affichage immédiat).
import { footerBottom } from './footer.js';
import { icon } from './icons.js';
import { imgAttrs, sized } from './images.js';
import { reserveModalHtml } from './reserve-modal-html.js';

export { icon };

// t : textes de la langue ; s : état affiché (dates, voyageurs, étage du plan).
export const renderPage = (t, s) => `
  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="${t.brandAria}"><span class="brand-mark"><i></i><i></i></span><span>Villa<br><em>Normande</em></span></a>
    <nav class="nav-links" aria-label="Navigation principale">
      <a href="#cadre">${t.nav.cadre}</a><a href="#equipements">${t.nav.equipements}</a><a href="#chambres">${t.nav.chambres}</a><a href="#plan">${t.nav.plan}</a><a href="#avis">${t.nav.avis}</a><a href="#tarifs">${t.nav.tarifs}</a><a href="#faq">${t.nav.faq}</a><a href="${t.nearbySection.guideUrl.split('#')[0]}">${t.nav.guide}</a>
    </nav>
    <button class="header-cta booking-trigger">${t.headerCta} <span>${icon('arrow', 15)}</span></button>
    <button class="lang-toggle" id="lang-toggle" aria-label="${t.langToggleAria}">${t.langToggleLabel}</button>
    <button class="menu-toggle" aria-label="${t.menuAria}"><i class="menu-toggle-bars"><span></span><span></span><span></span></i><i class="menu-toggle-x">${icon('close', 20)}</i></button>
  </header>

  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-image image-placeholder"><img ${imgAttrs('/images/la-maison.jpeg', '100vw')} alt="${t.hero.imageAlt}" fetchpriority="high" decoding="async" /></div>
      <div class="hero-wash"></div>
      <div class="hero-copy shell">
        <a class="hero-rating" href="#avis">${icon('star', 15)}<span><strong>${t.cadre.overallRating} / 5</strong> · ${t.cadre.reviewsVerified}</span></a>
        <h1 id="hero-title"><span class="eyebrow light"><span></span>${t.hero.eyebrow}</span> ${t.hero.titleLine1}<br><em>${t.hero.titleEm}</em></h1>
        <p class="hero-intro">${t.hero.intro}</p>
        <a href="#cadre" class="text-link light-link">${t.hero.discover} ${icon('arrow', 17)}</a>
      </div>
      <aside class="booking-card" id="booking" aria-label="${t.booking.aria}">
        <div class="booking-top"><div><p class="booking-label">${t.booking.label}</p><h2>${t.booking.title}</h2></div><span class="booking-status"><i></i>${t.booking.status}</span></div>
        <div class="calendar-header"><button id="cal-prev" aria-label="${t.booking.prevAria}">‹</button><strong id="cal-month"></strong><button id="cal-next" aria-label="${t.booking.nextAria}">›</button></div>
        <div class="weekdays">${t.days.map(d => `<span>${d}</span>`).join('')}</div>
        <div class="calendar-grid loading" id="calendar-grid" aria-busy="true">${'<span class="cal-skel"></span>'.repeat(35)}</div>
        <div class="date-fields"><button><span>${t.booking.arrival}</span><strong id="arrival-value">${s.arrivalText}</strong></button><button><span>${t.booking.departure}</span><strong id="departure-value">${s.departureText}</strong></button></div>
        <div class="guest-line"><span>${icon('users', 17)} ${t.booking.travelers}</span><button class="guest-toggle"><strong id="guest-summary">${s.guestSummary}</strong>${icon('chevron', 15)}</button></div>
        <div class="guest-panel" hidden>
          <div><span>${t.booking.adults} <small>${t.booking.adultsSub}</small></span><p class="stepper"><button data-type="adults" data-change="-1">−</button><b id="adult-count">${s.adults}</b><button data-type="adults" data-change="1">+</button></p></div>
          <div><span>${t.booking.children} <small>${t.booking.childrenSub}</small></span><p class="stepper"><button data-type="children" data-change="-1">−</button><b id="child-count">${s.children}</b><button data-type="children" data-change="1">+</button></p></div>
        </div>
        <button class="reserve-button" id="reserve">${t.booking.reserve} <span>${t.booking.fromPrice}</span></button>
        <p class="booking-note">${t.booking.note}</p>
      </aside>
      <div class="hero-bottom"><span>${t.hero.travelers}</span><span>${t.hero.specs}</span></div>
    </section>

    <section class="intro section shell" id="cadre">
      <div class="intro-collage" aria-label="Aperçus de la maison">
        <figure class="intro-photo one image-placeholder"><img ${imgAttrs('/images/piece-de-vie.jpeg', '(max-width: 720px) 75vw, 40vw')} alt="${t.cadre.photoOneAlt}" loading="lazy" /><figcaption>${t.cadre.photoOneCaption}</figcaption></figure>
        <figure class="intro-photo two image-placeholder"><img ${imgAttrs('/images/jardin-table.avif', '(max-width: 720px) 50vw, 25vw')} alt="${t.cadre.photoTwoAlt}" loading="lazy" /><figcaption>${t.cadre.photoTwoCaption}</figcaption></figure>
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
        <div class="space-image image-placeholder" id="space-image" role="button" tabindex="0" aria-label="${t.spacesSection.imageAria}"><img ${imgAttrs(t.spaces[0][2], '(max-width: 720px) 100vw, 60vw')} alt="${t.spacesSection.imageAltSuffix(t.spaces[0][0])}" loading="lazy" /></div>
        <article class="space-caption"><p class="eyebrow"><span></span><span id="space-count">01 — ${String(t.spaces.length).padStart(2, '0')}</span></p><h3 id="space-title">${t.spaces[0][0]}</h3><p id="space-text">${t.spaces[0][1]}</p><button class="text-link" id="open-gallery">${t.spacesSection.seeAllPhotos} ${icon('arrow', 17)}</button></article>
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
        <div class="host-portrait image-placeholder"><img ${imgAttrs('/images/christophe.jpg', '300px')} alt="${t.host.portraitAlt}" loading="lazy" /></div>
        <div class="host-card">
          <strong>${t.host.name}</strong>
          <div class="host-fact">${icon('globe', 16)}<span>${t.host.languages}</span></div>
          <div class="host-fact">${icon('badge', 16)}<span>${t.host.years}</span></div>
        </div>
      </div>
      <div class="host-copy"><p class="eyebrow"><span></span>${t.host.eyebrow}</p><blockquote>${t.host.quote}</blockquote><p>${t.host.bio}</p><a href="#booking" class="text-link booking-trigger">${t.host.cta} ${icon('arrow', 17)}</a></div>
    </div></section>

    <section class="floor-plan section" id="plan"><div class="shell">
      <div class="plan-heading"><p class="eyebrow light"><span></span>${t.floorPlan.eyebrow}</p><h2>${t.floorPlan.h2}</h2><p>${t.floorPlan.p}</p></div>
      <div class="plan-tabs" role="tablist"><button class="${s.activeFloor === 'ground' ? 'active' : ''}" data-floor="ground">${t.floorPlan.tabs.ground}</button><button class="${s.activeFloor === 'first' ? 'active' : ''}" data-floor="first">${t.floorPlan.tabs.first}</button><button class="${s.activeFloor === 'second' ? 'active' : ''}" data-floor="second">${t.floorPlan.tabs.second}</button></div>
      <div class="house-plan" id="house-plan"></div>
      <div class="plan-key" id="plan-key"></div>
    </div></section>

    <section class="nearby section" id="nearby">
      <div class="shell">
        <div class="section-top"><div><p class="eyebrow"><span></span>${t.nearbySection.eyebrow}</p><h2>${t.nearbySection.h2}</h2></div><a class="text-link nearby-guide-link" href="${t.nearbySection.guideUrl}">${t.nearbySection.cta} ${icon('arrow', 17)}</a></div>
        <div class="nearby-pin-body">
          <div class="nearby-pin-image" id="nearby-pin-image">${t.nearbyItems.map(([, , , img], i) => `<div class="nearby-pin-slide ${i === 0 ? 'active' : ''}" data-index="${i}" style="background-image:url('${sized(img, 960)}')"></div>`).join('')}</div>
          <div class="nearby-pin-list" id="nearby-pin-list">${t.nearbyItems.map(([title, time, text], i) => `<article class="${i === 0 ? 'active' : ''}" data-index="${i}" role="button" tabindex="0" aria-label="${title}"><span class="nearby-no">0${i + 1}</span><div><h3>${title}</h3><p>${text}</p></div><span>${time}</span></article>`).join('')}</div>
        </div>
        <div class="nearby-pin-progress" id="nearby-pin-progress">${t.nearbyItems.map((_, i) => `<i class="${i === 0 ? 'active' : ''}"></i>`).join('')}</div>
      </div>
    </section>

    <section class="reviews section" id="avis">
      <div class="shell reviews-lead"><p class="eyebrow"><span></span>${t.reviewsSection.eyebrow}</p><h2>${t.reviewsSection.h2}</h2></div>
      <div class="shell reviews-stats">
        <div class="stat-block"><strong>${t.reviewsSection.count}</strong><span>${t.reviewsSection.countLabel}</span></div>
        <div class="stat-block"><strong>${t.reviewsSection.overallRating}</strong><span class="stars">★★★★★</span></div>
        <div class="stat-bars">${t.ratingCategories.filter(([, score]) => String(score).trim()).map(([label, score]) => `<div class="stat-bar-row"><span>${label}</span><span class="stat-bar"><i style="width:${Number(score.replace(',', '.')) / 5 * 100}%"></i></span><b>${score}</b></div>`).join('')}</div>
      </div>
      <div class="review-scroll-wrap">
        <div class="review-cards" id="review-cards">${t.reviews.concat(t.reviews).map(([initials, name, date, text], i) => `<article class="${i % t.reviews.length === 1 ? 'highlight' : ''}" aria-hidden="${i >= t.reviews.length ? 'true' : 'false'}"><div class="review-top"><span class="initials">${initials}</span><div><b>${name}</b><small>${date}</small></div><span class="stars">★★★★★</span></div><p>“${text}”</p></article>`).join('')}</div>
      </div>
    </section>

    <section class="pricing section" id="tarifs"><div class="shell">
      <div class="pricing-head"><p class="eyebrow"><span></span>${t.pricing.eyebrow}</p><h2>${t.pricing.h2}</h2></div>
      <div class="pricing-body">
        <div class="pricing-panel">
          <div class="pricing-toggle" role="tablist" aria-label="${t.pricing.eyebrow}">${t.pricing.seasons.map((season, i) => `<button type="button" role="tab" id="tab-${season.id}" aria-controls="season-${season.id}" aria-selected="${i === 0}" data-season="${season.id}" class="${i === 0 ? 'active' : ''}">${season.name}</button>`).join('')}</div>
          ${t.pricing.seasons.map((season, i) => `
          <article class="pricing-card" id="season-${season.id}" role="tabpanel" aria-labelledby="tab-${season.id}" data-months="${season.monthNumbers.join(',')}" ${i === 0 ? '' : 'hidden'}>
            <header><p class="pricing-now">${t.pricing.current}</p><h3>${season.name}</h3></header>
            <ul class="pricing-rows">${season.rows.map(([label, total, night], j) => `
              <li><span class="pricing-label"><strong>${label}</strong>${total ? `<small>${j === 1 ? t.pricing.approx : ''}${night} / ${t.pricing.perNight}</small>` : ''}</span>
                <span class="pricing-price">${total || `${night}<small> / ${t.pricing.perNight}</small>`}</span></li>`).join('')}
            </ul>
          </article>`).join('')}
        </div>
        <div class="pricing-side">
          <p class="pricing-intro">${t.pricing.intro}</p>
          <ul class="pricing-included">${t.pricing.included.map((item) => `<li>${icon('check', 15)}<span>${item}</span></li>`).join('')}</ul>
          <div class="pricing-action"><button class="reserve-button booking-trigger pricing-cta">${t.pricing.cta} ${icon('arrow', 16)}</button><p class="pricing-note">${t.pricing.note}</p></div>
        </div>
      </div>
    </div></section>

    <section class="faq section" id="faq"><div class="shell faq-grid"><div><p class="eyebrow"><span></span>${t.faqSection.eyebrow}</p><h2>${t.faqSection.h2}</h2><p class="faq-intro">${t.faqSection.intro}</p><a class="outline-button small" href="mailto:contact@villanormande.com">${t.faqSection.contact} ${icon('arrow', 16)}</a></div><div class="accordion">${t.faq.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q} <span>${icon('plus',18)}</span></summary><p>${a}</p></details>`).join('')}</div></div></section>

    <section class="final-cta"><div class="final-image image-placeholder"><img ${imgAttrs('/images/les-alentours.jpeg', '100vw')} alt="${t.finalCta.imageAlt}" loading="lazy" /></div><div class="final-wash"></div><div class="shell final-copy"><p class="eyebrow light"><span></span>${t.finalCta.eyebrow}</p><h2>${t.finalCta.h2}</h2><button class="reserve-button booking-trigger">${t.finalCta.button}</button><p class="final-note">${t.finalCta.note}</p></div></section>
  </main>
  <footer><div class="shell footer-row"><a class="brand footer-brand" href="#top"><span class="brand-mark"><i></i><i></i></span><span>Villa<br><em>Normande</em></span></a><p>${t.footer.tagline}</p><div><a href="#cadre">${t.footer.linkHouse}</a><a href="#faq">${t.footer.linkFaq}</a><a href="${t.nearbySection.guideUrl.split('#')[0]}">${t.footer.linkGuide}</a><a href="mailto:contact@villanormande.com">${t.footer.linkContact}</a></div></div>${footerBottom(t.lang, t.footer.bottomNote)}</footer>
  <div class="toast" role="status" aria-live="polite"></div>

${reserveModalHtml(t, s.adults + s.children)}
`;
