// ================================================
// JARDINIA FRANCE - Service Email (Nodemailer)
// ================================================
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const brandColor = "#16a34a";
const brandName = "Jardinia France";

function baseTemplate(content: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:${brandColor};padding:32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:bold;">🌿 ${brandName}</h1>
              <p style="color:#bbf7d0;margin:8px 0 0;font-size:14px;">Tout pour profiter de votre extérieur</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#6b7280;font-size:12px;">
                © ${new Date().getFullYear()} ${brandName} - Tous droits réservés<br>
                Livraison dans toute l'Europe 🇪🇺
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ========================
// Confirmation de commande
// ========================
export async function sendOrderConfirmationEmail({
  to,
  firstName,
  orderNumber,
  total,
  items,
}: {
  to: string;
  firstName: string;
  orderNumber: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}) {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">${item.name} x${item.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:bold;">${(item.price * item.quantity).toFixed(2)} €</td>
    </tr>`
    )
    .join("");

  const content = `
    <h2 style="color:#111827;margin:0 0 8px;">Merci pour votre commande, ${firstName} ! 🎉</h2>
    <p style="color:#6b7280;">Votre commande a bien été confirmée et est en cours de traitement.</p>
    
    <div style="background:#f0fdf4;border-left:4px solid ${brandColor};padding:16px;border-radius:4px;margin:24px 0;">
      <strong style="color:${brandColor};">Commande N° ${orderNumber}</strong>
    </div>
    
    <h3 style="color:#374151;">Récapitulatif :</h3>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${itemsHtml}
      <tr>
        <td style="padding:16px 0 0;font-size:18px;font-weight:bold;color:#111827;">Total</td>
        <td style="padding:16px 0 0;font-size:18px;font-weight:bold;color:${brandColor};text-align:right;">${total.toFixed(2)} €</td>
      </tr>
    </table>
    
    <div style="text-align:center;margin-top:32px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/compte/commandes" 
         style="background:${brandColor};color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
        Suivre ma commande
      </a>
    </div>`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `✅ Confirmation commande #${orderNumber} - Jardinia France`,
    html: baseTemplate(content, "Confirmation de commande"),
  });
}

// ========================
// Email de bienvenue
// ========================
export async function sendWelcomeEmail({
  to,
  firstName,
  welcomeCode,
}: {
  to: string;
  firstName: string;
  welcomeCode?: string | null;
}) {
  const couponBlock = welcomeCode
    ? `<div style="background:#f0fdf4;padding:24px;border-radius:8px;margin:24px 0;border:1px solid #bbf7d0;">
      <h3 style="color:${brandColor};margin:0 0 8px;">🎁 Votre cadeau de bienvenue</h3>
      <p style="margin:0 0 12px;color:#374151;">Profitez de <strong>20% de réduction</strong> sur votre première commande dès 100&nbsp;€ d'achats avec le code :</p>
      <div style="text-align:center;background:#ffffff;border:2px dashed ${brandColor};border-radius:8px;padding:14px;font-size:22px;font-weight:bold;letter-spacing:3px;color:${brandColor};">${welcomeCode}</div>
      <p style="margin:12px 0 0;color:#6b7280;font-size:12px;text-align:center;">Valable 30 jours · Usage unique · Commande min. 100&nbsp;€</p>
    </div>`
    : "";

  const content = `
    <h2 style="color:#111827;">Bienvenue chez ${brandName}, ${firstName}&nbsp;! 🌿</h2>
    <p style="color:#4b5563;line-height:1.6;">
      Votre compte a été créé avec succès. Vous pouvez maintenant profiter de toutes nos offres pour aménager votre extérieur.
    </p>

    ${couponBlock}

    <div style="text-align:center;margin-top:32px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/boutique"
         style="background:${brandColor};color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
        Découvrir nos produits
      </a>
    </div>`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `🌿 Bienvenue chez ${brandName} - Votre compte est créé`,
    html: baseTemplate(content, "Bienvenue"),
  });
}

// ========================
// Réinitialisation mot de passe
// ========================
export async function sendPasswordResetEmail({
  to,
  resetLink,
}: {
  to: string;
  resetLink: string;
}) {
  const content = `
    <h2 style="color:#111827;">Réinitialisation de votre mot de passe</h2>
    <p style="color:#4b5563;line-height:1.6;">
      Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
    </p>
    <p style="color:#9ca3af;font-size:14px;">Ce lien est valable pendant 1 heure.</p>
    
    <div style="text-align:center;margin:32px 0;">
      <a href="${resetLink}"
         style="background:${brandColor};color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
        Réinitialiser mon mot de passe
      </a>
    </div>
    
    <p style="color:#9ca3af;font-size:12px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "🔐 Réinitialisation de votre mot de passe - Jardinia France",
    html: baseTemplate(content, "Réinitialisation mot de passe"),
  });
}
