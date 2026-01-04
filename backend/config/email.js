import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create reusable transporter using SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // SGGS email address
      pass: process.env.EMAIL_PASSWORD, // App password (not regular password)
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email server is ready to send messages");
    return true;
  } catch (error) {
    console.error("❌ Email configuration error:", error.message);
    return false;
  }
};

// Send email function
export const sendEmail = async ({to, subject, html, text}) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Zenith 2026 - SGGS" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || subject, // Fallback plain text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully:", info.messageId);
    return {success: true, messageId: info.messageId};
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return {success: false, error: error.message};
  }
};

export default {sendEmail, verifyEmailConfig};
