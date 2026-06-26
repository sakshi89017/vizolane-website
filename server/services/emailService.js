// ── Email Service ────────────────────────────────────────
// Sends emails via Gmail SMTP using Nodemailer.
// Two functions: admin notification + user confirmation.

const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

// Load HTML templates once at startup
const adminTemplatePath = path.join(__dirname, "..", "templates", "adminEmail.html");
const userTemplatePath = path.join(__dirname, "..", "templates", "userConfirmation.html");

let adminTemplate = "";
let userTemplate = "";

try {
  adminTemplate = fs.readFileSync(adminTemplatePath, "utf-8");
  userTemplate = fs.readFileSync(userTemplatePath, "utf-8");
} catch (err) {
  console.error("⚠️  Could not load email templates:", err.message);
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Replace {{placeholder}} tokens in a template string.
 */
function fillTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || "");
}

/**
 * Send notification email to the admin about a new contact.
 */
async function sendAdminNotification({ name, email, phone, message }) {
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const html = fillTemplate(adminTemplate, {
    name,
    email,
    phone: phone || "Not provided",
    message,
    timestamp,
  });

  const mailOptions = {
    from: `"Vizolane Website" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `📩 New Contact: ${name}`,
    html,
    // Plain-text fallback
    text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nMessage: ${message}\nTime: ${timestamp}`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Admin notification sent:", info.messageId);
  return info;
}

/**
 * Send confirmation email to the user who submitted the contact form.
 */
async function sendUserConfirmation({ name, email, message }) {
  const html = fillTemplate(userTemplate, {
    name,
    message,
  });

  const mailOptions = {
    from: `"Vizolane Technologies" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Thanks for contacting Vizolane Technologies!",
    html,
    // Plain-text fallback
    text: `Hi ${name},\n\nThank you for reaching out to Vizolane Technologies!\n\nWe've received your message:\n"${message}"\n\nOur team will get back to you within 24 hours.\n\nBest regards,\nVizolane Technologies LLP`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ User confirmation sent to:", email, info.messageId);
  return info;
}

/**
 * Verify the SMTP connection is valid.
 */
async function verifyConnection() {
  try {
    await transporter.verify();
    console.log("✅ Email service ready (Gmail SMTP)");
    return true;
  } catch (err) {
    console.error("❌ Email service error:", err.message);
    return false;
  }
}

module.exports = {
  sendAdminNotification,
  sendUserConfirmation,
  verifyConnection,
};
