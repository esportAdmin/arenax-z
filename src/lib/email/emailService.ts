/**
 * src/lib/email/emailService.ts
 * ─────────────────────────────────────────────────────────────────────
 * Service d'envoi d'emails via Resend.
 * Utilisé pour :
 *   - Confirmation de demande de suppression RGPD
 *   - Welcome email post-onboarding
 *   - Notifications de match (optionnel)
 *
 * Pré-requis : npm install resend
 * Variable d'env : RESEND_API_KEY, EMAIL_FROM
 * ─────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM     = process.env.EMAIL_FROM ?? "ArenaX <noreply@arena-x.gg>";
const APP_URL        = process.env.NEXT_PUBLIC_APP_URL ?? "https://arena-x.gg";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface SendEmailParams {
  to:      string;
  subject: string;
  html:    string;
  text?:   string;
}

interface EmailResult {
  success: boolean;
  id?:     string;
  error?:  string;
}

// ─────────────────────────────────────────────
// SENDER
// ─────────────────────────────────────────────

async function sendEmail(params: SendEmailParams): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    // En dev sans clé API — logger uniquement
    console.info("[email] DEV — would send:", params.subject, "to", params.to);
    return { success: true, id: "dev-mock" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        from:    EMAIL_FROM,
        to:      [params.to],
        subject: params.subject,
        html:    params.html,
        text:    params.text,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: (err as { message?: string }).message ?? `HTTP ${res.status}` };
    }

    const data = await res.json() as { id?: string };
    return { success: true, id: data.id };
  } catch (err) {
    return {
      success: false,
      error:   err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ─────────────────────────────────────────────
// TEMPLATES
// ─────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; background: #050816; font-family: "Inter", Arial, sans-serif; }
    .container { max-width: 520px; margin: 40px auto; padding: 0 20px; }
    .card { background: #0f1629; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; }
    .logo { font-size: 24px; font-weight: 900; color: #22d3ee; margin-bottom: 24px; letter-spacing: -0.02em; }
    h1 { font-size: 20px; font-weight: 800; color: #ffffff; margin: 0 0 12px; }
    p { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6; margin: 0 0 16px; }
    .btn { display: inline-block; padding: 12px 24px; background: rgba(34,211,238,0.15); border: 1px solid rgba(34,211,238,0.25); border-radius: 10px; color: #22d3ee; text-decoration: none; font-weight: 600; font-size: 14px; }
    .footer { margin-top: 24px; font-size: 12px; color: rgba(255,255,255,0.25); text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">⚔️ ArenaX</div>
      ${content}
    </div>
    <div class="footer">
      ArenaX · <a href="${APP_URL}/privacy" style="color:inherit">Privacy Policy</a> · <a href="${APP_URL}/terms" style="color:inherit">Terms</a>
    </div>
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// EMAILS SPÉCIFIQUES
// ─────────────────────────────────────────────

/**
 * Email de confirmation de suppression de compte RGPD.
 * Légalement obligatoire pour Article 17.
 */
export async function sendDeletionConfirmationEmail(params: {
  to:           string;
  username:     string;
  scheduledFor: string; // date ISO
  cancelUrl:    string;
}): Promise<EmailResult> {
  const scheduledDate = new Date(params.scheduledFor).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return sendEmail({
    to:      params.to,
    subject: "Your ArenaX account deletion request",
    text:    `Hi ${params.username}, your account deletion is scheduled for ${scheduledDate}. Cancel at: ${params.cancelUrl}`,
    html:    baseTemplate(`
      <h1>Account Deletion Requested</h1>
      <p>Hi <strong style="color:#fff">${params.username}</strong>,</p>
      <p>We've received your request to delete your ArenaX account. Your account and all associated data will be permanently deleted on <strong style="color:#fff">${scheduledDate}</strong>.</p>
      <p>If you change your mind, you can cancel this request before that date:</p>
      <a href="${params.cancelUrl}" class="btn">Cancel Deletion →</a>
      <p style="margin-top:16px;font-size:12px;color:rgba(255,255,255,0.3)">
        If you didn't request this, please contact support immediately at support@arena-x.gg
      </p>
    `),
  });
}

/**
 * Email de bienvenue après onboarding complété.
 */
export async function sendWelcomeEmail(params: {
  to:       string;
  username: string;
}): Promise<EmailResult> {
  return sendEmail({
    to:      params.to,
    subject: `Welcome to ArenaX, ${params.username}!`,
    text:    `Welcome to ArenaX, ${params.username}! Your account is ready. Play your first match at ${APP_URL}/play`,
    html:    baseTemplate(`
      <h1>Welcome to the Arena 🎮</h1>
      <p>Hi <strong style="color:#fff">${params.username}</strong>,</p>
      <p>Your account is ready. You're about to compete in real-time strategy battles, climb the ranked ladder, and watch your highlights.</p>
      <p>Your placement matches determine your starting rank — play well!</p>
      <a href="${APP_URL}/play" class="btn">Find Your First Match →</a>
    `),
  });
}

/**
 * Email de notification de match trouvé (optionnel — si le joueur n'est pas en ligne).
 */
export async function sendMatchFoundEmail(params: {
  to:      string;
  username: string;
  warId:   string;
}): Promise<EmailResult> {
  const matchUrl = `${APP_URL}/match/${params.warId}`;
  return sendEmail({
    to:      params.to,
    subject: "Match Found — ArenaX",
    text:    `A match has been found for you, ${params.username}! Join now: ${matchUrl}`,
    html:    baseTemplate(`
      <h1>Match Found! ⚔️</h1>
      <p>Hi <strong style="color:#fff">${params.username}</strong>,</p>
      <p>Your opponent is ready. Accept the match to enter the arena.</p>
      <a href="${matchUrl}" class="btn">Join Match →</a>
      <p style="font-size:12px;color:rgba(255,255,255,0.3);margin-top:12px">
        This match will expire if not accepted within 30 seconds.
      </p>
    `),
  });
}
