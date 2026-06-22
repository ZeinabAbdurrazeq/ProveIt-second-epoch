import { Resend } from "resend";
import { ENV } from "./env.js";

// Single Resend client. If the API key is missing we still export helpers,
// but they no-op (and log) so missing email config never crashes the app
// flow (e.g. accepting an invitation must still create the session).
const resend = ENV.RESEND_API_KEY ? new Resend(ENV.RESEND_API_KEY) : null;

const FROM = ENV.RESEND_FROM || "Provelt <onboarding@resend.dev>";

// Shared HTML shell so every email looks consistent and professional.
// Inline styles only — email clients do not support external CSS.
function emailShell(title, bodyHtml) {
  return `
  <div style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:24px;">
      <div style="text-align:center;padding:16px 0;">
        <!-- Logo placeholder -->
        <div style="display:inline-block;width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#a855f7);line-height:44px;color:#fff;font-weight:bold;font-size:20px;">P</div>
        <div style="font-size:20px;font-weight:bold;color:#111827;margin-top:8px;">Provelt</div>
      </div>
      <div style="background:#ffffff;border-radius:12px;padding:28px;border:1px solid #e5e7eb;">
        <h1 style="font-size:20px;color:#111827;margin:0 0 16px;">${title}</h1>
        ${bodyHtml}
      </div>
      <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
        Provelt — Code Together. This is an automated message.
      </p>
    </div>
  </div>`;
}

function difficultyBadge(difficulty) {
  const colors = {
    easy: "#16a34a",
    medium: "#d97706",
    hard: "#dc2626",
  };
  const color = colors[String(difficulty).toLowerCase()] || "#6b7280";
  const label =
    String(difficulty).charAt(0).toUpperCase() + String(difficulty).slice(1);
  return `<span style="display:inline-block;padding:2px 10px;border-radius:999px;background:${color};color:#fff;font-size:12px;font-weight:bold;">${label}</span>`;
}

function button(text, url) {
  return `<a href="${url}" style="display:inline-block;padding:12px 24px;border-radius:8px;background:#6366f1;color:#fff;text-decoration:none;font-weight:bold;">${text}</a>`;
}

async function send(to, subject, html) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing - skipping email to", to);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (error) {
    // Never let an email failure break the request flow.
    console.error("[email] Failed to send to", to, error?.message || error);
  }
}

export async function sendInvitationEmail(to, data) {
  const { senderName, problem, difficulty, scheduledDate, scheduledTime, message } = data;
  const body = `
    <p style="color:#374151;">Hi, <strong>${senderName}</strong> invited you to a coding session on Provelt.</p>
    <table style="width:100%;margin:16px 0;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#6b7280;">Problem</td><td style="padding:6px 0;color:#111827;font-weight:bold;">${problem}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Difficulty</td><td style="padding:6px 0;">${difficultyBadge(difficulty)}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Date</td><td style="padding:6px 0;color:#111827;">${scheduledDate}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Time (Egypt)</td><td style="padding:6px 0;color:#111827;">${scheduledTime}</td></tr>
    </table>
    ${message ? `<p style="background:#f9fafb;border-left:3px solid #6366f1;padding:12px;color:#374151;">“${message}”</p>` : ""}
    <p style="color:#374151;">Open Provelt to accept or decline this invitation.</p>
  `;
  return send(to, `${senderName} invited you to a Provelt session`, emailShell("You have a new session invitation", body));
}

export async function sendDeclineEmail(to, data) {
  const { recipientName, problem, scheduledDate, scheduledTime } = data;
  const body = `
    <p style="color:#374151;"><strong>${recipientName}</strong> declined your session invitation.</p>
    <table style="width:100%;margin:16px 0;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#6b7280;">Problem</td><td style="padding:6px 0;color:#111827;font-weight:bold;">${problem}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Date</td><td style="padding:6px 0;color:#111827;">${scheduledDate} at ${scheduledTime} (Egypt)</td></tr>
    </table>
    <p style="color:#374151;">You can schedule another session anytime from your dashboard.</p>
  `;
  return send(to, `${recipientName} declined your invitation`, emailShell("Invitation declined", body));
}

export async function sendSubscriptionEmail(to, data) {
  const { name, planName, price, currentPeriodEnd } = data;
  const renews =
    currentPeriodEnd instanceof Date
      ? currentPeriodEnd.toDateString()
      : String(currentPeriodEnd || "");
  const body = `
    <p>Hi ${name || "there"}, thanks for upgrading — your payment was successful.</p>
    <table>
      <tbody><tr><td>Plan</td><td>${planName}</td></tr>
      <tr><td>Price</td><td>$${Number(price || 0).toFixed(2)} / month</td></tr>
      <tr><td>Renews on</td><td>${renews}</td></tr>
    </tbody></table>
    <p>Your ${planName} features are active right now. Enjoy unlimited practice!</p>
  `;
  return send(
    to,
    `Your Provelt ${planName} plan is active`,
    emailShell("Subscription confirmed", body),
  );
}

export async function sendAcceptedEmail(to, data) {
  const { problem, scheduledDate, scheduledTime, sessionUrl } = data;
  const body = `
    <p style="color:#374151;">Your session is confirmed and ready to join.</p>
    <table style="width:100%;margin:16px 0;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#6b7280;">Problem</td><td style="padding:6px 0;color:#111827;font-weight:bold;">${problem}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Date</td><td style="padding:6px 0;color:#111827;">${scheduledDate} at ${scheduledTime} (Egypt)</td></tr>
    </table>
    <div style="text-align:center;margin-top:20px;">${button("Join Session", sessionUrl)}</div>
  `;
  return send(to, "Your Provelt session is confirmed", emailShell("Session confirmed", body));
}
