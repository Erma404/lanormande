import { isDeployed } from './http.js';
import { SITE_URL } from '../../src/site.js';
import { estimateStay } from '../../src/pricing.js';

// Mode local : sans Resend et hors Vercel, le code n'est pas envoyé mais affiché.
export const isLocalMailMode = () => !process.env.RESEND_API_KEY && !isDeployed();

const FROM = () => process.env.MAIL_FROM || 'Villa Normande <contact@villanormande.com>';
const splitEmails = (value) => (value || '').split(',').map((email) => email.trim()).filter(Boolean);
const adminEmails = () => splitEmails(process.env.ADMIN_EMAILS);
// Adresse de Christophe (variable Vercel HOST_EMAIL, hors du dépôt public) : il reçoit les demandes
// et les réponses des voyageurs. À défaut, les admins.
const hostEmails = () => splitEmails(process.env.HOST_EMAIL).length ? splitEmails(process.env.HOST_EMAIL) : adminEmails();

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const formatDate = (locale) => (iso) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
const frDate = formatDate('fr-FR');
const enDate = formatDate('en-GB');

async function deliver(message) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM(), ...message })
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

/* Mise en page commune, à l'image du site : en-tête noir, carte blanche arrondie sur fond gris
   clair, police Manrope (repli Helvetica), accent terracotta. Tableaux et styles en ligne pour
   rester lisible dans Gmail, Outlook et Apple Mail. */
const C = { bg: '#f3f3f5', paper: '#ffffff', dark: '#121313', ink: '#151919', muted: '#73757c', line: '#e4e4e8', clay: '#bd6c52', forest: '#17221d', soft: '#f6f1ec' };
const FONT = "Manrope,'Helvetica Neue',Helvetica,Arial,sans-serif";

function layout({ preheader, eyebrow, hero = false, body, footerNote }) {
  const site = SITE_URL.replace('https://', '');
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only">
<title>Villa Normande</title></head>
<body style="margin:0;padding:0;background:${C.bg};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}"><tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:${FONT};color:${C.ink}">
    <tr><td style="background:${C.dark};border-radius:14px 14px 0 0;padding:20px 28px ${hero ? 28 : 20}px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-family:${FONT};color:#ffffff;font-size:15px;line-height:1;font-weight:700;letter-spacing:-.04em">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${C.clay};margin-right:8px;vertical-align:middle"></span><span style="vertical-align:middle">Villa <span style="font-weight:500;color:#e6e6e7">Normande</span></span>
        </td>
        <td align="right" style="font-family:${FONT};color:#a6a6a6;font-size:11px;letter-spacing:.02em">${escapeHtml(eyebrow)}</td>
      </tr></table>
      ${hero ? `<img src="${SITE_URL}/images/email-maison.jpg" width="504" alt="La Villa Normande, maison à colombages à Danestal" style="display:block;width:100%;height:auto;border-radius:10px;border:0;margin-top:20px">` : ''}
    </td></tr>
    <tr><td style="background:${C.paper};padding:36px 28px 32px;border-radius:0 0 14px 14px">${body}</td></tr>
    <tr><td align="center" style="padding:22px 12px 0;font-family:${FONT};font-size:11px;line-height:1.6;color:${C.muted}">
      ${footerNote ? `${footerNote}<br>` : ''}Villa Normande · Danestal, Pays d’Auge · <a href="${SITE_URL}" style="color:${C.clay};text-decoration:none;font-weight:600">${site}</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

const h1 = (text) => `<h1 style="margin:0 0 14px;font-family:${FONT};font-size:28px;line-height:1.08;font-weight:700;letter-spacing:-.05em;color:${C.ink}">${text}</h1>`;
const p = (text, extra = '') => `<p style="margin:0 0 18px;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.ink};${extra}">${text}</p>`;
const small = (text) => `<p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.6;color:${C.muted}">${text}</p>`;
const pill = (text) => `<p style="margin:0 0 26px"><span style="display:inline-block;padding:8px 14px;border-radius:999px;background:${C.soft};color:${C.clay};font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:-.01em">● ${text}</span></p>`;
const button = (href, text, last = false) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 ${last ? 0 : 24}px"><tr><td style="border-radius:6px;background:${C.forest}"><a href="${href}" style="display:inline-block;padding:14px 22px;font-family:${FONT};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:-.01em">${text} &rarr;</a></td></tr></table>`;

// Bloc sombre façon carte de réservation du site : arrivée | départ, puis voyageurs.
function stayCard(labels, values) {
  const cell = (label, value, border) => `<td width="50%" style="padding:14px 16px;${border ? 'border-left:1px solid rgba(255,255,255,.16);' : ''}vertical-align:top">
    <div style="font-family:${FONT};font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#a5a5a5">${label}</div>
    <div style="font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff;padding-top:4px">${escapeHtml(value)}</div></td>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#141616;border-radius:10px;margin:0 0 26px">
    <tr><td colspan="2" style="padding:16px 16px 4px;font-family:${FONT};font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#bcbcbc">${labels.title}</td></tr>
    <tr><td colspan="2" style="padding:8px 16px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(255,255,255,.16);border-radius:6px"><tr>${cell(labels.arrival, values.arrival, false)}${cell(labels.departure, values.departure, true)}</tr></table></td></tr>
    <tr><td style="padding:14px 16px ${values.total ? 4 : 16}px;font-family:${FONT};font-size:13px;color:#d2d4d3">${labels.guests}</td><td align="right" style="padding:14px 16px ${values.total ? 4 : 16}px;font-family:${FONT};font-size:13px;font-weight:700;color:#ffffff">${escapeHtml(values.guests)}</td></tr>
    ${values.total ? `<tr><td style="padding:10px 16px 16px;font-family:${FONT};font-size:13px;color:#d2d4d3">${labels.total}<br><span style="font-size:11px;color:#a5a5a5">${escapeHtml(values.totalDetail)}</span></td><td align="right" style="padding:10px 16px 16px;font-family:${FONT};font-size:22px;font-weight:800;color:#e9a483">${escapeHtml(values.total)}</td></tr>` : ''}
  </table>`;
}

const detailRows = (rows) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 26px;border-top:1px solid ${C.line}">${rows.map(([label, value]) => `<tr>
  <td style="padding:11px 12px 11px 0;border-bottom:1px solid ${C.line};font-family:${FONT};font-size:13px;color:${C.muted};white-space:nowrap;vertical-align:top">${label}</td>
  <td style="padding:11px 0;border-bottom:1px solid ${C.line};font-family:${FONT};font-size:14px;color:${C.ink};white-space:pre-line">${escapeHtml(value)}</td></tr>`).join('')}</table>`;

const signature = (line) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:6px"><tr>
  <td style="padding-right:14px;vertical-align:middle"><img src="${SITE_URL}/images/email-christophe.jpg" width="52" height="52" alt="Christophe" style="display:block;border-radius:50%;border:0"></td>
  <td style="vertical-align:middle;font-family:${FONT};font-size:14px;line-height:1.45;color:${C.ink}">${line}<br><strong>Christophe</strong> <span style="color:${C.muted}">· Villa Normande</span></td>
</tr></table>`;

export async function sendLoginCode(email, code) {
  if (!process.env.RESEND_API_KEY) {
    if (isDeployed()) throw new Error('RESEND_API_KEY non configuré');
    console.log(`\n[admin] Code de connexion pour ${email} : ${code} (valable 15 min)\n`);
    return;
  }
  await deliver({
    to: [email],
    subject: `${code} — votre code de connexion`,
    text: `Votre code de connexion à l'espace admin de la Villa Normande : ${code}\n\nIl est valable 15 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.`,
    html: layout({
      preheader: `Votre code : ${code} (valable 15 minutes)`,
      eyebrow: 'Espace admin',
      body: `${h1('Votre code de connexion')}
        ${p('Saisissez ce code sur la page de connexion de l’espace admin.')}
        <p style="margin:0 0 24px;padding:20px;border-radius:10px;background:${C.soft};text-align:center;font-family:${FONT};font-size:36px;font-weight:700;letter-spacing:10px;color:${C.ink}">${code}</p>
        ${small('Ce code est valable <strong>15 minutes</strong> et ne sert qu’une fois. Si vous n’êtes pas à l’origine de cette demande, ignorez simplement cet email.')}`
    })
  });
}

// Alerte de sécurité : chaque connexion réussie est signalée à l'admin concerné.
// S'il n'en est pas à l'origine, il sait que sa boîte mail est compromise et peut agir.
export async function sendLoginAlert(email, { when, place, device }) {
  if (!process.env.RESEND_API_KEY) {
    if (!isDeployed()) console.log(`\n[admin] Alerte de connexion pour ${email} : ${when}, ${place}, ${device}\n`);
    return;
  }
  await deliver({
    to: [email],
    subject: 'Nouvelle connexion à l’espace admin',
    text: `Une connexion à l'espace admin de la Villa Normande vient d'avoir lieu avec votre adresse.\n\nQuand : ${when}\nOù (approximatif) : ${place}\nAppareil : ${device}\n\nSi c'est bien vous, rien à faire. Sinon, changez tout de suite le mot de passe de votre boîte mail et prévenez Ernestine.`,
    html: layout({
      preheader: `Connexion le ${when}`,
      eyebrow: 'Sécurité',
      body: `${h1('Nouvelle connexion à l’espace admin')}
        ${p('Une connexion vient d’avoir lieu avec votre adresse email.')}
        ${p(`<strong>Quand :</strong> ${escapeHtml(when)}<br><strong>Où (approximatif) :</strong> ${escapeHtml(place)}<br><strong>Appareil :</strong> ${escapeHtml(device)}`)}
        ${small('Si c’est bien vous, rien à faire. Sinon, changez tout de suite le mot de passe de votre boîte mail et prévenez Ernestine : la personne a pu recevoir votre code de connexion.')}`
    })
  });
}

// Prévient Christophe et les admins d'une nouvelle demande ; le détail reste consultable dans l'admin.
export async function sendRequestNotification(request) {
  // Destinataire : la boîte de la Villa (HOST_EMAIL, contact@) ; les admins (Christophe, Claire…) en copie.
  const recipients = hostEmails();
  const copies = adminEmails().filter((email) => !recipients.includes(email));
  const summary = `${request.name} — du ${frDate(request.arrival)} au ${frDate(request.departure)}, ${request.guests} voyageur${request.guests > 1 ? 's' : ''}`;
  if (!process.env.RESEND_API_KEY || !recipients.length) {
    if (isDeployed()) throw new Error('RESEND_API_KEY ou ADMIN_EMAILS non configuré');
    console.log(`\n[admin] Nouvelle demande de réservation : ${summary}\n`);
    return;
  }

  const adminUrl = `${SITE_URL}/admin`;
  // Total estimé selon la grille tarifaire : le montant affiché au voyageur au moment de sa demande.
  const estimate = estimateStay(request.arrival, request.departure);
  const euros = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  const nightsText = estimate ? `${estimate.nights} nuit${estimate.nights > 1 ? 's' : ''}` : '';
  const totalText = estimate?.total ? euros(estimate.total) : estimate ? 'sur demande' : '';
  const totalDetail = estimate?.total ? `${nightsText} · ${estimate.seasons.length > 1 ? 'basse et haute saison' : `${estimate.seasons[0]} saison`}` : nightsText;
  const rows = [['Email', request.email], ['Téléphone', request.phone || '—'], ['Langue', request.lang === 'en' ? 'Anglais' : 'Français'], ['Message', request.message || '—']];
  await deliver({
    to: recipients,
    ...(copies.length ? { cc: copies } : {}),
    reply_to: request.email,
    subject: `Nouvelle demande de réservation — ${request.name}`,
    text: `Nouvelle demande de réservation sur le site.\n\n${summary}\nTotal estimé : ${totalText} (${totalDetail})\n${rows.map(([label, value]) => `${label} : ${value}`).join('\n')}\n\nLe voyageur a reçu un accusé de réception annonçant une réponse sous 48 h maximum.\nPour l'accepter ou la refuser : ${adminUrl}\nRépondre à cet email écrit directement au voyageur.`,
    html: layout({
      preheader: summary,
      eyebrow: 'Nouvelle demande',
      body: `${h1(`${escapeHtml(request.name)} souhaite réserver`)}
        ${pill('À traiter sous 48 h maximum')}
        ${stayCard({ title: 'Séjour demandé', arrival: 'Arrivée', departure: 'Départ', guests: 'Voyageurs', total: 'Total estimé' }, { arrival: frDate(request.arrival), departure: frDate(request.departure), guests: `${request.guests} voyageur${request.guests > 1 ? 's' : ''}`, total: totalText, totalDetail })}
        ${detailRows(rows)}
        ${button(adminUrl, 'Accepter ou refuser')}
        ${small('Le voyageur a reçu un accusé de réception annonçant une réponse sous 48 h maximum. Répondre à cet email lui écrit directement.')}`
    })
  });
}

const CONFIRMATION = {
  fr: {
    date: frDate,
    subject: 'Votre demande de réservation à la Villa Normande',
    eyebrow: 'Demande reçue',
    preheader: 'Christophe vous répond sous 48 h maximum.',
    title: (name) => `Merci ${name}, votre demande est bien arrivée.`,
    lead: 'Christophe l’a reçue et revient vers vous par email ou par téléphone pour confirmer votre séjour.',
    pill: 'Réponse sous 48 h maximum',
    card: { title: 'Votre séjour', arrival: 'Arrivée', departure: 'Départ', guests: 'Voyageurs' },
    guests: (n) => `${n} voyageur${n > 1 ? 's' : ''}`,
    note: 'Rien n’est débité à cette étape. Pour ajouter une précision, répondez simplement à cet email : votre message arrivera directement à Christophe.',
    sign: 'À très bientôt à Danestal,',
    cta: 'Revoir la maison',
    text: (r, d) => `Bonjour ${r.name},\n\nMerci pour votre demande : Christophe l’a bien reçue et vous répond sous 48 h maximum pour confirmer votre séjour.\n\nArrivée : ${d(r.arrival)}\nDépart : ${d(r.departure)}\nVoyageurs : ${r.guests}\n\nRien n’est débité à cette étape. Pour ajouter une précision, répondez simplement à cet email.\n\nÀ très bientôt à Danestal,\nChristophe — Villa Normande\n${SITE_URL}`
  },
  en: {
    date: enDate,
    subject: 'Your booking request at Villa Normande',
    eyebrow: 'Request received',
    preheader: 'Christophe will reply within 48 hours at most.',
    title: (name) => `Thank you ${name}, your request has arrived.`,
    lead: 'Christophe has received it and will get back to you by email or phone to confirm your stay.',
    pill: 'Reply within 48 hours at most',
    card: { title: 'Your stay', arrival: 'Arrival', departure: 'Departure', guests: 'Guests' },
    guests: (n) => `${n} guest${n > 1 ? 's' : ''}`,
    note: 'Nothing is charged at this stage. To add anything, simply reply to this email: your message will go straight to Christophe.',
    sign: 'See you soon in Danestal,',
    cta: 'See the house again',
    text: (r, d) => `Hello ${r.name},\n\nThank you for your request: Christophe has received it and will reply within 48 hours at most to confirm your stay.\n\nArrival: ${d(r.arrival)}\nDeparture: ${d(r.departure)}\nGuests: ${r.guests}\n\nNothing is charged at this stage. To add anything, simply reply to this email.\n\nSee you soon in Danestal,\nChristophe — Villa Normande\n${SITE_URL}`
  }
};

// Accusé de réception au voyageur. Volontairement sans son message libre : le site ne doit pas
// pouvoir servir à relayer un texte arbitraire vers n'importe quelle adresse.
export async function sendRequestConfirmation(request) {
  const t = CONFIRMATION[request.lang] || CONFIRMATION.fr;
  if (!process.env.RESEND_API_KEY) {
    if (isDeployed()) throw new Error('RESEND_API_KEY non configuré');
    console.log(`\n[voyageur] Confirmation envoyée à ${request.email} (${request.lang}) : ${t.subject}\n`);
    return;
  }
  const firstName = request.name.split(/\s+/)[0];
  await deliver({
    to: [request.email],
    reply_to: hostEmails(),
    subject: t.subject,
    text: t.text(request, t.date),
    html: layout({
      preheader: t.preheader,
      eyebrow: t.eyebrow,
      hero: true,
      body: `${h1(escapeHtml(t.title(firstName)))}
        ${p(t.lead)}
        ${pill(t.pill)}
        ${stayCard(t.card, { arrival: t.date(request.arrival), departure: t.date(request.departure), guests: t.guests(request.guests) })}
        ${p(t.note, `font-size:14px;color:${C.muted}`)}
        ${signature(t.sign)}
        <div style="height:26px;line-height:26px;font-size:0">&nbsp;</div>
        ${button(request.lang === 'en' ? `${SITE_URL}/en` : SITE_URL, t.cta, true)}`
    })
  });
}
