// src/utils/sendEmail.js
// Email utility using SendGrid API
// SendGrid uses HTTPS instead of SMTP
// This works on Render free tier which blocks SMTP ports

import sgMail from "@sendgrid/mail";

// ─── Configure SendGrid ───────────────────────────────────────────
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ─── Send Email Function ──────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM,
      subject,
      html,
    };

    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Email failed to ${to}: ${error.message}`);
    return false;
  }
};

export default sendEmail;