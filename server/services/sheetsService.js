// ── Google Sheets Service ────────────────────────────────
// Appends contact form data as rows in a Google Sheet.
// Uses a Google Cloud Service Account for authentication.

const { google } = require("googleapis");
const path = require("path");

let sheetsClient = null;

/**
 * Initialize the Google Sheets API client using Service Account credentials.
 */
async function initSheets() {
  try {
    const credentialsPath = path.resolve(
      process.env.GOOGLE_CREDENTIALS_PATH || "./credentials.json"
    );

    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const authClient = await auth.getClient();
    sheetsClient = google.sheets({ version: "v4", auth: authClient });

    console.log("✅ Google Sheets service ready");
    return true;
  } catch (err) {
    console.error("❌ Google Sheets init failed:", err.message);
    console.error("   Make sure credentials.json exists and GOOGLE_SHEET_ID is set.");
    return false;
  }
}

/**
 * Append a contact form submission as a new row in the Google Sheet.
 * Columns: Timestamp | Name | Email | Phone | Message | Status
 */
async function appendContactToSheet({ name, email, phone, message }) {
  if (!sheetsClient) {
    const msg = "⚠️  Sheets client not initialized — skipping sheet write.";
    console.warn(msg);
    throw new Error(msg);
  }

  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    const msg = "⚠️  GOOGLE_SHEET_ID not set — skipping sheet write.";
    console.warn(msg);
    throw new Error(msg);
  }

  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  const values = [[timestamp, name, email, phone || "N/A", message, "New"]];

  try {
    const response = await sheetsClient.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:F", // Adjust sheet name if different
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });

    console.log(
      "✅ Contact appended to Google Sheet:",
      response.data.updates?.updatedRange
    );
    return response.data;
  } catch (err) {
    console.error("❌ Failed to write to Google Sheet:", err.message);
    // Throw error so Promise.allSettled records it as rejected
    throw err;
  }
}

module.exports = {
  initSheets,
  appendContactToSheet,
};
