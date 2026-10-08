// Onglet Demandes : demandes de réservation envoyées depuis le site, à accepter ou refuser.

const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
const receivedFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const formatDate = (iso) => dateFormat.format(new Date(`${iso}T00:00:00`));
const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const nights = (start, end) => Math.round((new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000);
const plural = (count, word) => `${count} ${word}${count > 1 ? 's' : ''}`;

const filters = [
  ['new', 'À traiter'],
  ['accepted', 'Acceptées'],
  ['declined', 'Refusées'],
  ['all', 'Toutes']
];
const statusLabels = { new: 'À traiter', accepted: 'Acceptée', declined: 'Refusée' };

const errors = {
  unavailable: 'Impossible d’accepter : ces dates sont déjà prises (Airbnb ou blocage). Refusez la demande ou proposez d’autres dates au voyageur.',
  not_found: 'Cette demande n’existe plus. La liste a été rechargée.',
  unauthenticated: 'Votre session a expiré. Rechargez la page pour vous reconnecter.',
  invalid_amount: 'Montant invalide : saisissez un nombre d’euros, sans centimes.'
};

// Numéro au format international pour WhatsApp ; un 0 initial est considéré comme français.
function whatsappNumber(phone) {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits.slice(1);
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0')) return `33${digits.slice(1)}`;
  return digits;
}

// Brouillon de réponse dans la langue du voyageur, à relire avant envoi.
function replyLink(request, kind) {
  const en = request.lang === 'en';
  const longDate = (iso) => new Intl.DateTimeFormat(en ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${iso}T00:00:00`));
  const from = longDate(request.arrival);
  const to = longDate(request.departure);
  const texts = en ? {
    accepted: ['Your stay at Villa Normande is confirmed', `Hello ${request.name},\n\nGood news: your stay at Villa Normande from ${from} to ${to} is confirmed.\n\nI will be in touch shortly with the practical details (payment, arrival, keys).\n\nBest regards,\nChristophe`],
    declined: ['Your request for Villa Normande', `Hello ${request.name},\n\nThank you for your interest in Villa Normande. Unfortunately the house is not available from ${from} to ${to}.\n\nDo not hesitate to send a request for other dates.\n\nBest regards,\nChristophe`]
  } : {
    accepted: ['Votre séjour à la Villa Normande est confirmé', `Bonjour ${request.name},\n\nBonne nouvelle : votre séjour à la Villa Normande du ${from} au ${to} est confirmé.\n\nJe reviens vers vous très vite avec les détails pratiques (règlement, arrivée, clés).\n\nBien cordialement,\nChristophe`],
    declined: ['Votre demande pour la Villa Normande', `Bonjour ${request.name},\n\nMerci pour votre intérêt pour la Villa Normande. Malheureusement, la maison n’est pas disponible du ${from} au ${to}.\n\nN’hésitez pas à faire une demande pour d’autres dates.\n\nBien cordialement,\nChristophe`]
  };
  const [subject, body] = texts[kind];
  return `mailto:${encodeURIComponent(request.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function renderRequests(container, { escape, onCount }) {
  let requests = [];
  let filter = 'new';

  async function call(body) {
    const response = await fetch('/api/admin/requests', {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin'
    }).catch(() => null);
    if (!response) return { error: 'Connexion impossible. Vérifiez votre réseau.' };
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (json.error === 'not_found') await call();
      return { error: errors[json.error] || 'Une erreur est survenue. Réessayez.' };
    }
    requests = json.requests;
    onCount(requests.filter((request) => request.status === 'new').length);
    return {};
  }

  function card(request) {
    const count = nights(request.arrival, request.departure);
    const past = request.departure <= new Date().toISOString().slice(0, 10);
    const contact = [
      `<a href="mailto:${escape(request.email)}">${escape(request.email)}</a>`,
      request.phone ? `<a href="tel:${escape(request.phone.replace(/[^\d+]/g, ''))}">${escape(request.phone)}</a>` : '',
      request.phone ? `<a href="https://wa.me/${escape(whatsappNumber(request.phone))}" target="_blank" rel="noopener">WhatsApp</a>` : ''
    ].filter(Boolean).join('<span aria-hidden="true">·</span>');

    let actions = '';
    if (request.status === 'new') {
      actions = `
        <button type="button" class="primary small" data-status="accepted" ${request.conflict ? 'disabled' : ''}>Accepter et bloquer les dates</button>
        <button type="button" class="secondary small" data-status="declined">Refuser</button>`;
    } else if (request.status === 'accepted') {
      actions = `
        <a class="secondary small button-link" href="${escape(replyLink(request, 'accepted'))}">Écrire la confirmation</a>
        <button type="button" class="link-button" data-status="new" data-confirm="Remettre cette demande en attente ? Ses dates seront débloquées sur le site et sur Airbnb.">Annuler l’acceptation</button>`;
    } else {
      actions = `
        <a class="secondary small button-link" href="${escape(replyLink(request, 'declined'))}">Écrire la réponse</a>
        <button type="button" class="link-button" data-status="new">Remettre en attente</button>`;
    }

    return `
      <article class="request-card status-${request.status}" data-id="${escape(request.id)}">
        <header class="request-head">
          <div>
            <h2>${escape(request.name)}</h2>
            <p class="request-received">Reçue le ${receivedFormat.format(request.createdAt)}${request.lang === 'en' ? ' · en anglais' : ''}</p>
          </div>
          <span class="request-status">${statusLabels[request.status]}</span>
        </header>
        <p class="request-stay"><strong>${formatDate(request.arrival)} → ${formatDate(request.departure)}</strong><span>${plural(count, 'nuit')} · ${plural(request.guests, 'voyageur')}</span>${request.estimate ? `<span class="request-total">${request.estimate.offer ? `Prix promo <s>${euros.format(request.estimate.regular)}</s>` : 'Total estimé'} <b>${request.estimate.total ? euros.format(request.estimate.total) : 'sur demande'}</b></span>` : ''}</p>
        ${request.conflict ? '<p class="status error">Ces dates sont déjà prises (autre demande acceptée, Airbnb ou blocage manuel).</p>' : ''}
        ${past && request.status === 'new' ? '<p class="status warn">Ce séjour est déjà passé.</p>' : ''}
        ${request.status === 'accepted' ? '<p class="status ok">Dates bloquées sur le site et dans le calendrier exporté vers Airbnb.</p>' : ''}
        ${request.status === 'accepted' ? `
        <form class="request-amount" data-amount novalidate>
          <label for="amount-${escape(request.id)}">Montant encaissé</label>
          <span class="amount-field"><input id="amount-${escape(request.id)}" type="number" inputmode="numeric" min="0" step="1" value="${request.amount ?? request.estimate?.total ?? ''}" /><span>€</span></span>
          <button type="submit" class="secondary small">Enregistrer</button>
          <small>${request.amount == null ? 'Montant estimé d’après la grille : corrigez-le si le prix final est différent (remise, ménage…).' : 'Montant réel, utilisé dans le tableau de bord.'}</small>
        </form>` : ''}
        ${request.promo ? `<p class="request-promo"><span>Promotion en cours</span>${escape(request.promo.text)}${request.promo.viaBanner ? '<small>Demande envoyée depuis le bouton de la bannière</small>' : ''}</p>` : ''}
        <p class="request-contact">${contact}</p>
        ${request.message ? `<blockquote class="request-message">${escape(request.message)}</blockquote>` : ''}
        <div class="request-actions">
          ${actions}
          <button type="button" class="link-button danger" data-delete>Supprimer</button>
        </div>
      </article>`;
  }

  function render(message = '') {
    const counts = Object.fromEntries(filters.map(([id]) => [id, id === 'all' ? requests.length : requests.filter((request) => request.status === id).length]));
    const visible = filter === 'all' ? requests : requests.filter((request) => request.status === filter);
    const empty = {
      new: 'Aucune demande en attente. Les nouvelles demandes envoyées depuis le site apparaîtront ici et vous serez prévenu par email.',
      accepted: 'Aucune demande acceptée pour l’instant.',
      declined: 'Aucune demande refusée.',
      all: 'Aucune demande reçue pour l’instant.'
    }[filter];

    container.innerHTML = `
      ${message ? `<p class="form-error panel-error" role="alert">${escape(message)}</p>` : ''}
      <div class="lang-switch request-filters" role="tablist" aria-label="Filtrer les demandes">
        ${filters.map(([id, label]) => `<button type="button" role="tab" data-filter="${id}" class="${id === filter ? 'active' : ''}" aria-selected="${id === filter}">${label}${counts[id] && id !== 'all' ? ` <small>${counts[id]}</small>` : ''}</button>`).join('')}
      </div>
      ${visible.length ? `<div class="request-list">${visible.map(card).join('')}</div>` : `<p class="placeholder request-empty">${empty}</p>`}
      <p class="hint request-retention">Chaque demande est supprimée automatiquement 3 ans après le dernier contact (fin du séjour ou dernière action), comme l’annonce la politique de confidentialité.</p>`;

    container.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
      filter = button.dataset.filter;
      render();
    }));

    const run = async (button, body) => {
      container.querySelectorAll('.request-actions button').forEach((el) => { el.disabled = true; });
      button.classList.add('loading');
      const result = await call(body);
      render(result.error);
    };
    container.querySelectorAll('.request-card').forEach((article) => {
      const { id } = article.dataset;
      article.querySelectorAll('[data-status]').forEach((button) => button.addEventListener('click', () => {
        if (button.dataset.confirm && !window.confirm(button.dataset.confirm)) return;
        run(button, { action: 'setStatus', id, status: button.dataset.status });
      }));
      article.querySelector('[data-amount]')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = event.currentTarget.querySelector('input').value.trim();
        run(event.submitter || event.currentTarget.querySelector('button'), { action: 'setAmount', id, amount: value === '' ? null : Number(value) });
      });
      article.querySelector('[data-delete]').addEventListener('click', (event) => {
        const request = requests.find((item) => item.id === id);
        const note = request?.status === 'accepted' ? ' Les dates resteront bloquées : débloquez-les dans l’onglet Disponibilités si besoin.' : '';
        if (!window.confirm(`Supprimer définitivement la demande de ${request?.name || 'ce voyageur'} ?${note}`)) return;
        run(event.currentTarget, { action: 'delete', id });
      });
    });
  }

  container.innerHTML = `<div class="request-list" aria-busy="true" aria-label="Chargement des demandes">${'<div class="panel"><span class="skel skel-h"></span><span class="skel skel-line"></span><span class="skel skel-line short"></span></div>'.repeat(3)}</div>`;
  call().then((result) => {
    if (result.error) container.innerHTML = `<p class="form-error">${escape(result.error)}</p>`;
    else render();
  });
}
