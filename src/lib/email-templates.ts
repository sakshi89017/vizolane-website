/**
 * Email templates for transactional notifications.
 */

interface AdminEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  timestamp: string;
}

interface UserConfirmationData {
  name: string;
  message: string;
}

/**
 * Returns the HTML content for the admin notification email.
 */
export function getAdminEmailTemplate(data: AdminEmailData): string {
  const phoneVal = data.phone && data.phone.trim() ? data.phone : "Not provided";
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0b1a;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0b1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#12142e;border:1px solid rgba(255,255,255,0.08);border-top:3px solid #6366F1;max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 36px 20px;">
              <h1 style="margin:0;font-size:14px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#6366F1;">
                📩 NEW CONTACT
              </h1>
              <p style="margin:8px 0 0;font-size:13px;color:#6b7280;">
                Someone reached out via the Vizolane website.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 36px;">
              <div style="height:1px;background:rgba(255,255,255,0.07);"></div>
            </td>
          </tr>

          <!-- Contact Details -->
          <tr>
            <td style="padding:24px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <!-- Name -->
                <tr>
                  <td style="padding:10px 0;vertical-align:top;">
                    <span style="display:block;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b7280;margin-bottom:4px;">NAME</span>
                    <span style="font-size:16px;font-weight:600;color:#f2f0eb;">${escapeHtml(data.name)}</span>
                  </td>
                </tr>
                <!-- Email -->
                <tr>
                  <td style="padding:10px 0;vertical-align:top;">
                    <span style="display:block;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b7280;margin-bottom:4px;">EMAIL</span>
                    <a href="mailto:${encodeURIComponent(data.email)}" style="font-size:15px;color:#38bdf8;text-decoration:none;">${escapeHtml(data.email)}</a>
                  </td>
                </tr>
                <!-- Phone -->
                <tr>
                  <td style="padding:10px 0;vertical-align:top;">
                    <span style="display:block;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b7280;margin-bottom:4px;">PHONE</span>
                    <span style="font-size:15px;color:#f2f0eb;">${escapeHtml(phoneVal)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 36px;">
              <div style="height:1px;background:rgba(255,255,255,0.07);"></div>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:24px 36px;">
              <span style="display:block;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b7280;margin-bottom:10px;">MESSAGE</span>
              <div style="padding:16px 20px;background:rgba(0,0,0,0.25);border-left:3px solid #6366F1;font-size:14px;line-height:1.7;color:#d1d5db;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
            </td>
          </tr>

          <!-- Timestamp -->
          <tr>
            <td style="padding:16px 36px 32px;">
              <span style="font-size:11px;color:#4b5563;">
                Received: ${escapeHtml(data.timestamp)} IST
              </span>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;background:rgba(0,0,0,0.2);border-top:1px solid rgba(255,255,255,0.05);">
              <p style="margin:0;font-size:11px;color:#4b5563;text-align:center;">
                Vizolane Technologies LLP · Automated notification from website contact form
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

/**
 * Returns the HTML content for the user confirmation email.
 */
export function getUserConfirmationTemplate(data: UserConfirmationData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thanks for reaching out — Vizolane Technologies</title>
</head>
<body style="margin:0;padding:0;background:#050714;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050714;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#0C0E22;border:1px solid rgba(255,255,255,0.07);max-width:600px;width:100%;overflow:hidden;">

          <!-- Gradient Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3dcb7d 0%,#6366F1 100%);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:0.3px;">Thank you, ${escapeHtml(data.name)}!</h1>
              <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:14px;line-height:1.5;">We've received your message and our team is on it.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">

              <!-- Greeting -->
              <p style="margin:0 0 20px;color:#F2F0EB;font-size:15px;line-height:1.7;">
                Hi ${escapeHtml(data.name)},
              </p>
              <p style="margin:0 0 24px;color:#9CA3AF;font-size:14px;line-height:1.7;">
                Thanks for reaching out to Vizolane Technologies. We appreciate your interest and want you to know that your message hasn't gone into a void — a real human on our team will review it and get back to you.
              </p>

              <!-- Expected Response Time -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:18px 22px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:14px;">
                          <span style="font-size:24px;">⏱️</span>
                        </td>
                        <td>
                          <span style="display:block;color:#F2F0EB;font-size:14px;font-weight:600;margin-bottom:4px;">Expected Response Time</span>
                          <span style="color:#9CA3AF;font-size:13px;">We typically respond within <strong style="color:#6366F1;">24 hours</strong> on business days.</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px;background:rgba(255,255,255,0.07);margin:0 0 24px;"></div>

              <!-- Copy of their message -->
              <p style="margin:0 0 12px;color:#6B7280;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Your Message</p>
              <div style="padding:16px 20px;background:rgba(0,0,0,0.25);border-left:3px solid #3dcb7d;margin-bottom:28px;">
                <p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
              </div>

              <!-- Closing -->
              <p style="margin:0 0 6px;color:#9CA3AF;font-size:14px;line-height:1.7;">
                In the meantime, feel free to reply directly to this email if you have anything else to add.
              </p>
              <p style="margin:20px 0 0;color:#F2F0EB;font-size:14px;">
                Warm regards,<br />
                <strong>The Vizolane Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 40px;background:rgba(0,0,0,0.2);border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="margin:0 0 6px;color:#4B5563;font-size:12px;">
                Vizolane Technologies LLP
              </p>
              <p style="margin:0;color:#374151;font-size:11px;">
                AI-Powered Urban Infrastructure · Smarter Cities for India and Beyond
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

/**
 * Basic HTML escaping to prevent injection in generated emails.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
