import { isDeployed } from './http.js';

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
