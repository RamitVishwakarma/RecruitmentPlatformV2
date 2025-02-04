import sgMail from "@sendgrid/mail";
import { generateEmailTemplate } from "./emailTemplates.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerificationEmail = async (email, otp) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Verify Your Email",
    html: generateEmailTemplate("verification", otp),
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Reset Your Password",
    html: generateEmailTemplate("passwordReset", token),
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};
