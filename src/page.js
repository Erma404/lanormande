// Gabarit HTML de la page d'accueil : fonction pure, utilisée par le navigateur
// et au moment du build pour générer le HTML complet (SEO, affichage immédiat).

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

// t : textes de la langue ; s : état affiché (dates, voyageurs, étage du plan).
export const renderPage = (t, s) => `
  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="${t.brandAria}"><span class="brand-mark"><i></i><i></i></span><span>Villa<br><em>Normande</em></span></a>
    <nav class="nav-links" aria-label="Navigation principale">
      <a href="#cadre">${t.nav.cadre}</a><a href="#equipements">${t.nav.equipements}</a><a href="#chambres">${t.nav.chambres}</a><a href="#plan">${t.nav.plan}</a><a href="#avis">${t.nav.avis}</a><a href="#faq">${t.nav.faq}</a>
    </nav>
    <button class="header-cta booking-trigger">${t.headerCta} <span>${icon('arrow', 15)}</span></button>
    <button class="lang-toggle" id="lang-toggle" aria-label="${t.langToggleAria}">${t.langToggleLabel}</button>
    <button class="menu-toggle" aria-label="${t.menuAria}"><i class="menu-toggle-bars"><span></span><span></span><span></span></i><i class="menu-toggle-x">${icon('close', 20)}</i></button>
  </header>

  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-image image-placeholder"><img src="/images/la-maison.jpeg" alt="${t.hero.imageAlt}" fetchpriority="high" decoding="async" /></div>
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
        <div class="space-image image-placeholder" id="space-image" role="button" tabindex="0" aria-label="${t.spacesSection.imageAria}"><img src="${t.spaces[0][2]}" alt="${t.spacesSection.imageAltSuffix(t.spaces[0][0])}" loading="lazy" /></div>
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
        <div class="host-portrait image-placeholder"><img src="/images/christophe.jpg" alt="${t.host.portraitAlt}" loading="lazy" /></div>
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
        <div class="section-top"><div><p class="eyebrow"><span></span>${t.nearbySection.eyebrow}</p><h2>${t.nearbySection.h2}</h2></div><a class="text-link booking-trigger" href="#booking">${t.nearbySection.cta} ${icon('arrow', 17)}</a></div>
        <div class="nearby-pin-body">
          <div class="nearby-pin-image" id="nearby-pin-image">${t.nearbyItems.map(([, , , img], i) => `<div class="nearby-pin-slide ${i === 0 ? 'active' : ''}" data-index="${i}" style="background-image:url('${img}')"></div>`).join('')}</div>
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
        <div class="stat-bars">${t.ratingCategories.map(([label, score]) => `<div class="stat-bar-row"><span>${label}</span><span class="stat-bar"><i style="width:${Number(score.replace(',', '.')) / 5 * 100}%"></i></span><b>${score}</b></div>`).join('')}</div>
      </div>
      <div class="review-scroll-wrap">
        <div class="review-cards" id="review-cards">${t.reviews.concat(t.reviews).map(([initials, name, date, text], i) => `<article class="${i % t.reviews.length === 1 ? 'highlight' : ''}" aria-hidden="${i >= t.reviews.length ? 'true' : 'false'}"><div class="review-top"><span class="initials">${initials}</span><div><b>${name}</b><small>${date}</small></div><span class="stars">★★★★★</span></div><p>“${text}”</p></article>`).join('')}</div>
      </div>
    </section>

    <section class="faq section" id="faq"><div class="shell faq-grid"><div><p class="eyebrow"><span></span>${t.faqSection.eyebrow}</p><h2>${t.faqSection.h2}</h2><p class="faq-intro">${t.faqSection.intro}</p><a class="outline-button small" href="mailto:bonjour@lamaisonnormande.fr">${t.faqSection.contact} ${icon('arrow', 16)}</a></div><div class="accordion">${t.faq.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q} <span>${icon('plus',18)}</span></summary><p>${a}</p></details>`).join('')}</div></div></section>

    <section class="final-cta"><div class="final-image image-placeholder"><img src="/images/les-alentours.jpeg" alt="${t.finalCta.imageAlt}" loading="lazy" /></div><div class="final-wash"></div><div class="shell final-copy"><p class="eyebrow light"><span></span>${t.finalCta.eyebrow}</p><h2>${t.finalCta.h2}</h2><button class="reserve-button booking-trigger">${t.finalCta.button}</button><p class="final-note">${t.finalCta.note}</p></div></section>
  </main>
  <footer><div class="shell footer-row"><a class="brand footer-brand" href="#top"><span class="brand-mark"><i></i><i></i></span><span>Villa<br><em>Normande</em></span></a><p>${t.footer.tagline}</p><div><a href="#cadre">${t.footer.linkHouse}</a><a href="#faq">${t.footer.linkFaq}</a><a href="mailto:bonjour@lamaisonnormande.fr">${t.footer.linkContact}</a></div></div><div class="shell footer-bottom"><span>${t.footer.copyright}</span><span>${t.footer.bottomNote}</span></div></footer>
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
        <label>${t.reserveModal.guests}<input type="number" id="rf-guests" name="guests" min="1" max="8" value="${s.adults + s.children}" required /></label>
        <label>${t.reserveModal.message}<textarea id="rf-message" name="message" rows="2" placeholder="${t.reserveModal.messagePlaceholder}"></textarea></label>
        <button type="submit" class="reserve-button">${t.reserveModal.submit} ${icon('arrow', 16)}</button>
      </form>
    </div>
  </div>
`;
