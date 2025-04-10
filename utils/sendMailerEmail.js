import transporter from "./nodemailerService.js";
import { generateEmailTemplate } from "./emailTemplates.js";

const sendVerificationEmail = async (email, otp) => {
  const html = generateEmailTemplate("verification", otp);
  try {
    const info = await transporter.sendMail({
      from: `"GDG OnCampus JSS" <${process.env.EMAIL_USER}>`,
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
      from: `"GDG OnCampus JSS" <${process.env.EMAIL_USER}>`,
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

const sendRegistrationEmail = async (email, userData) => {
  const html = generateEmailTemplate("registration", userData);
  try {
    const info = await transporter.sendMail({
      from: `"GDG OnCampus JSS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Registration Successful",
      html,
    });
    return info;
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw new Error("Failed to send registration email");
  }
};

const sendInterviewEmail = async (email, interviewDetails) => {
  const html = generateEmailTemplate("interview", interviewDetails);
  try {
    const info = await transporter.sendMail({
      from: `"GDG OnCampus JSS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Shortlisted for Interview",
      html,
    });
    return info;
  } catch (error) {
    console.error("Error sending interview email:", error);
    throw new Error("Failed to send interview email");
  }
};

const sendNotificationEmail = async (email, messageData) => {
  const html = generateEmailTemplate("notification", messageData);
  try {
    const info = await transporter.sendMail({
      from: `"GDG OnCampus JSS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Notification",
      html,
    });
    return info;
  } catch (error) {
    console.error("Error sending notification email:", error);
    throw new Error("Failed to send notification email");
  }
};

const sendTaskShortlistEmail = async (email, taskData) => {
  const html = generateEmailTemplate("task", taskData);
  try {
    const info = await transporter.sendMail({
      from: `"GDG OnCampus JSS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Shortlisted for task round",
      html,
    });
    return info;
  } catch (error) {
    console.error("Error sending task shortlist email:", error);
    throw new Error("Failed to send task shorlist email");
  }
};

export {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendInterviewEmail,
  sendNotificationEmail,
  sendRegistrationEmail,
  sendTaskShortlistEmail,
};
