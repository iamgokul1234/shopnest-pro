import nodemailer from "nodemailer";

// ─── Create Transporter ───────────────────────────────────────────
// Using port 587 with TLS instead of 465 (SSL)
// Port 587 is allowed on Render free tier
// Port 465 is blocked by Render network restrictions
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // false for port 587 (TLS), true for port 465 (SSL)
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