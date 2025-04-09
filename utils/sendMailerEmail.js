import transporter from "./nodemailerService.js";
import { generateEmailTemplate } from "./emailTemplates.js";

const sendVerificationEmail = async (email, otp) => {
  const html = generateEmailTemplate("verification", otp);
  try {
    const info = await transporter.sendMail({
      from: `"Recruitment Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: html,
    });

    // console.log("Verification email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

const sendPasswordResetEmail = async (email, token) => {
  const html = generateEmailTemplate("passwordReset", token);
  try {
    const info = await transporter.sendMail({
      from: `"Recruitment Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: html,
    });

    // console.log("Password reset email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

export { sendVerificationEmail, sendPasswordResetEmail };
