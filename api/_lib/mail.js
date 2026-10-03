import { isDeployed } from './http.js';
import { SITE_URL } from '../../src/site.js';

// Mode local : sans Resend et hors Vercel, le code n'est pas envoyé mais affiché.
export const isLocalMailMode = () => !process.env.RESEND_API_KEY && !isDeployed();

export async function sendLoginCode(email, code) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (isDeployed()) throw new Error('RESEND_API_KEY non configuré');
    console.log(`\n[admin] Code de connexion pour ${email} : ${code} (valable 15 min)\n`);
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'Villa Normande <onboarding@resend.dev>',
      to: [email],
      subject: `${code} — votre code de connexion`,
      text: `Votre code de connexion à l'espace admin de la Villa Normande : ${code}\n\nIl est valable 15 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.`,
      html: `<div style="font-family:Helvetica,Arial,sans-serif;max-width:440px;margin:0 auto;padding:32px 24px;color:#201b17">
  <p style="font-size:13px;color:#665c52;margin:0 0 8px">Villa Normande — espace admin</p>
  <h1 style="font-size:20px;margin:0 0 24px">Votre code de connexion</h1>
  <p style="font-size:34px;font-weight:700;letter-spacing:8px;background:#f7f1e8;padding:18px;text-align:center;border-radius:8px;margin:0 0 24px">${code}</p>
  <p style="font-size:14px;line-height:1.5;margin:0 0 8px">Ce code est valable <strong>15 minutes</strong> et ne peut servir qu'une fois.</p>
  <p style="font-size:13px;line-height:1.5;color:#665c52;margin:0">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
</div>`
    })
  });

  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const frDate = (iso) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

// Prévient les admins d'une nouvelle demande ; le détail reste consultable dans l'admin.
export async function sendRequestNotification(request) {
  const recipients = (process.env.ADMIN_EMAILS || '').split(',').map((email) => email.trim()).filter(Boolean);
  const apiKey = process.env.RESEND_API_KEY;
  const summary = `${request.name} — du ${frDate(request.arrival)} au ${frDate(request.departure)}, ${request.guests} voyageur${request.guests > 1 ? 's' : ''}`;
  if (!apiKey || !recipients.length) {
    if (isDeployed()) throw new Error('RESEND_API_KEY ou ADMIN_EMAILS non configuré');
    console.log(`\n[admin] Nouvelle demande de réservation : ${summary}\n`);
    return;
  }

  const adminUrl = `${SITE_URL}/admin`;
  const rows = [
    ['Nom', request.name],
    ['Arrivée', frDate(request.arrival)],
    ['Départ', frDate(request.departure)],
    ['Voyageurs', request.guests],
    ['Email', request.email],
    ['Téléphone', request.phone || '—'],
    ['Message', request.message || '—']
  ];
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'Villa Normande <onboarding@resend.dev>',
      to: recipients,
      reply_to: request.email,
      subject: `Nouvelle demande de réservation — ${request.name}`,
      text: `Nouvelle demande de réservation sur le site.\n\n${rows.map(([label, value]) => `${label} : ${value}`).join('\n')}\n\nPour l'accepter ou la refuser : ${adminUrl}\nRépondre à cet email écrit directement au voyageur.`,
      html: `<div style="font-family:Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#201b17">
  <p style="font-size:13px;color:#665c52;margin:0 0 8px">Villa Normande — espace admin</p>
  <h1 style="font-size:20px;margin:0 0 20px">Nouvelle demande de réservation</h1>
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 24px">${rows.map(([label, value]) => `<tr><td style="padding:8px 12px 8px 0;color:#665c52;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:8px 0;border-bottom:1px solid #e8dccb;white-space:pre-line">${escapeHtml(value)}</td></tr>`).join('')}</table>
  <a href="${adminUrl}" style="display:inline-block;padding:12px 18px;background:#27372a;color:#fffdf9;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">Accepter ou refuser</a>
  <p style="font-size:13px;line-height:1.5;color:#665c52;margin:20px 0 0">Répondre à cet email écrit directement au voyageur.</p>
</div>`
    })
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}
