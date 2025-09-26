import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Helper to create transporter
function createTransporter() {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email configuration missing. Make sure EMAIL_HOST, EMAIL_USER, and EMAIL_PASS are set in .env"
    );
  }

  const port = Number(process.env.EMAIL_PORT || 465);

  console.log("🚀 Creating email transporter...");
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // allow self-signed or Zoho certs
    },
  });

  console.log("✅ Email transporter created");
  return transporter;
}

// Singleton transporter
const transporter = createTransporter();

/**
 * sendEmail - Sends an email with optional attachments
 *
 * @param {Object} options
 * @param {string|string[]} options.to - recipient email(s)
 * @param {string} options.subject - email subject
 * @param {string} options.text - plain text body
 * @param {string} [options.html] - HTML body
 * @param {Array} [options.attachments] - array of attachment objects for nodemailer
 */
export async function sendEmail({ to, subject, text, html = "", attachments = [] }) {
  if (!to || !subject || !text) {
    throw new Error("Missing required email fields: to, subject, text");
  }

  try {
    console.log("📧 Sending email...");
    console.log("👤 Recipient:", to);
    console.log("📝 Subject:", subject);
    console.log("📄 Attachments count:", attachments.length);

    const info = await transporter.sendMail({
      from: `"Forems Africa" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
      attachments, // Forward attachments
    });

    console.log(`[SEND EMAIL] Email sent successfully to ${to}`);
    console.log("📌 Message ID:", info.messageId);
    if (attachments.length > 0) {
      attachments.forEach((att, idx) => {
        console.log(`📎 Attachment ${idx + 1}: ${att.filename}`);
      });
    }
    return info;
  } catch (error) {
    console.error(`[SEND EMAIL ERROR] Failed to send email to ${to}`, error);
    throw error; // rethrow for upstream handling
  }
}
