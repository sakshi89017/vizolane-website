import { getAdminEmailTemplate, getUserConfirmationTemplate } from "./email-templates";

const RESEND_API = "https://api.resend.com/emails";

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Low-level utility to send email via Resend REST API using fetch.
 */
async function sendEmail({ to, subject, html, from }: SendMailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const defaultFrom = process.env.FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    console.warn("⚠️  RESEND_API_KEY is not defined. Email notifications are skipped.");
    return false;
  }

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: from || defaultFrom,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`❌ Resend API Error (${res.status}):`, errText);
      return false;
    }

    const data = await res.json();
    console.log("✅ Email sent successfully via Resend. ID:", data.id);
    return true;
  } catch (err) {
    console.error("❌ Exception failed to send email via Resend:", err);
    return false;
  }
}

/**
 * Send admin notification email about a new submission.
 */
export async function sendAdminNotification({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("⚠️  ADMIN_EMAIL is not defined. Skipping admin notification.");
    return false;
  }

  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const html = getAdminEmailTemplate({ name, email, phone, message, timestamp });

  return sendEmail({
    to: adminEmail,
    subject: `📩 New Contact: ${name}`,
    html,
  });
}

/**
 * Send confirmation email to the user.
 */
export async function sendUserConfirmation({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  const html = getUserConfirmationTemplate({ name, message });

  return sendEmail({
    to: email,
    subject: "Thanks for contacting Vizolane Technologies!",
    html,
  });
}
