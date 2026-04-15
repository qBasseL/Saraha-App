import nodemailer from "nodemailer";
import {
  GOOGLE_APP_EMAIL,
  GOOGLE_APP_PASSWORD,
} from "../../../../config/config.service.js";

// Create a transporter using SMTP

export const sendEmail = async ({ to, cc, bcc, subject, html, attachments=[] } = {}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GOOGLE_APP_EMAIL,
      pass: GOOGLE_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"OTP for verification" <${GOOGLE_APP_EMAIL}>`, // sender address
    to,
    cc,
    bcc,
    subject,
    html,
    attachments
  });
  console.log("Message sent: %s", info.messageId);
};
