import nodemailer from "nodemailer";

// ─── Create Transporter ───────────────────────────────────────────
// Transporter is the connection to Gmail SMTP server
// It is created once and reused for all emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Send Email Function ──────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    // Log error but do not crash the app
    // Email failure should never block the main operation
    console.error(`❌ Email failed to ${to}: ${error.message}`);
    return false;
  }
};

export default sendEmail;
