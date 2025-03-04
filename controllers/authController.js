import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/emailService.js";
import { validatePassword } from "../utils/validators.js";
import { sendOTP } from "../utils/twilioService.js";
import twilio from "twilio";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";
import upload from "../utils/upload.js";

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "All fields are required" });

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user)
    return res
      .status(statusCode.NotFount404)
      .json({ message: "Unable to find User" });

  const validatePassword = await bcrypt.compare(password, user.password);
  if (!validatePassword)
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "Invalid user credentials" });

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );

  const createdAt = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(createdAt.getDate() + 10);

  const refreshTokenDb = await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      createdAt: createdAt,
      expiresAt: expiresAt,
    },
  });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(statusCode.Ok200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ message: "User logged in successfully" });
});

const logoutUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res
      .status(statusCode.Unauthorized401)
      .json({ message: "Token is missing" });
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedToken)
    res.status(statusCode.BadRequest400).json({ message: "Invalid token" });

  await prisma.blackListToken.create({
    data: {
      token,
    },
  });

  return res
    .status(statusCode.Ok200)
    .json({ message: "User logged out successfully" });
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refresh_Token } = req.body;
  if (!refresh_Token) {
    res
      .status(statusCode.Unauthorized401)
      .json({ message: "Refresh token required" });
  }

  const dbToken = await prisma.refreshToken.findUnique({
    where: {
      token: refresh_Token,
    },
    include: {
      user: true,
    },
  });

  if (!dbToken) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "Refresh Token not found" });
  }

  const presentTime = new Date();
  if (presentTime > refresh_Token.expiresAt) {
    await prisma.refreshToken.delete({
      where: {
        token: refresh_Token,
      },
    });
    return res
      .status(statusCode.NoContent204)
      .json({ message: "Refresh Token Deleted" });
  }

  const refreshedAccessToken = jwt.sign(
    { userId: dbToken.user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
  if (!refreshedAccessToken) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "Refreshed Token not found" });
  }
  return res.status(statusCode.Created201).json({
    message: "Access Token refreshed",
    accessToken: refreshedAccessToken,
  });
});

// register user

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    admissionNumber,
    phone,
    domain,
    year,
    aptitudeDetails,
    socialLinks,
  } = req.body;

  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Invalid email address.");
  }

  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phone || !phoneRegex.test(phone)) {
    errors.push("Invalid phone number format");
  }

  if (!admissionNumber || admissionNumber.trim().length < 6) {
    errors.push("Admission number must be at least 6 characters long.");
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  if (errors.length > 0) {
    return res.status(statusCode.BadRequest400).json({ errors });
  }

  let photoUrl = null;
  if (req.files && req.files.photo && req.files.photo.length > 0) {
    photoUrl = await upload(req.files.photo[0]);
    if (!photoUrl) {
      return res
        .status(statusCode.BadRequest400)
        .json({ message: "Could not upload image." });
    }
  }

  let resumeUrl = null;
  if (req.files && req.files.resume && req.files.resume.length > 0) {
    resumeUrl = await upload(req.files.resume[0]);
    if (!resumeUrl) {
      return res
        .status(statusCode.BadRequest400)
        .json({ message: "Could not upload resume." });
    }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res
      .status(statusCode.Conflict409)
      .json({ message: "User already exists" });
  }

  const existingUserWithPhone = await prisma.user.findFirst({
    where: { phone },
  });

  if (existingUserWithPhone) {
    return res
      .status(statusCode.Conflict409)
      .json({ message: "Phone number already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      admissionNumber,
      phone,
      phoneVerified: true,
      photo: photoUrl ?? null,
      resume: resumeUrl ?? null,
      domain: domain ?? null,
      year: year ?? null,
      socialLinks: {
        create: socialLinks,
      },
      aptitude: {
        create: aptitudeDetails,
      },
    },
    include: {
      socialLinks: true,
      aptitude: true,
    },
  });

  const verificationToken = await prisma.verificationToken.create({
    data: {
      token: jwt.sign({ userId: user.id }, process.env.PASSWORD_RESET_SECRET),
      userId: user.id,
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });
  // ? Remove this verification email step as email is already verified.
  await sendVerificationEmail(email, verificationToken.token);

  res.status(statusCode.Created201).json({
    message: "Registration successful.",
  });
});

//send otp to email

const sendOtpToEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const existingOtp = await prisma.otp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (existingOtp) {
      const timeSinceLastOtp = (new Date() - existingOtp.createdAt) / 1000;
      if (timeSinceLastOtp < 60) {
        return res.status(429).json({
          message:
            "OTP request too frequent. Please wait a minute before retrying.",
        });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await prisma.otp.upsert({
      where: { email },
      update: { otp, expiresAt: new Date(Date.now() + 60 * 10 * 1000) },
      create: { otp, email, expiresAt: new Date(Date.now() + 60 * 10 * 1000) },
    });

    await sendVerificationEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to email",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

// verify email otp

const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const existingOtp = await prisma.otp.findFirst({
      where: { email, otp },
    });

    if (!existingOtp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (new Date() > existingOtp.expiresAt) {
      await prisma.otp.deleteMany({
        where: { email },
      });

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    await prisma.otp.deleteMany({
      where: { email },
    });

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error verifying email",
      error: error.message,
    });
  }
};

// request password reset

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "User not found" });
  }

  const resetToken = await prisma.verificationToken.create({
    data: {
      token: jwt.sign({ userId: user.id }, process.env.PASSWORD_RESET_SECRET),
      userId: user.id,
      type: "PASSWORD_RESET",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  await sendPasswordResetEmail(email, resetToken.token);

  res.status(statusCode.Ok200).json({
    message: "Password reset link sent to email",
  });
});

// reset password

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || verificationToken.type !== "PASSWORD_RESET") {
    return res
      .status(statusCode.Unauthorized401)
      .json({ message: "Invalid or expired token" });
  }

  const decoded = jwt.verify(token, process.env.PASSWORD_RESET_SECRET);

  if (!decoded) {
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "Invalid token" });
  }

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return res
      .status(statusCode.BadRequest400)
      .json({ errors: passwordValidation.errors });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: decoded.userId },
    data: { password: hashedPassword },
  });

  prisma.verificationToken.delete({
    where: { token },
  });

  res.status(statusCode.Ok200).json({
    message: "Password reset successful",
  });
});

// verify user

const verifyUser = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return res
      .status(statusCode.Unauthorized401)
      .json({ message: "Invalid verification token" });
  }

  if (verificationToken.type !== "EMAIL_VERIFICATION") {
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "Invalid token type" });
  }

  if (new Date() > verificationToken.expiresAt) {
    await prisma.verificationToken.delete({
      where: { token },
    });
    return res
      .status(statusCode.NotFount404)
      .json({ message: "Token has expired" });
  }

  await prisma.user.update({
    where: { id: verificationToken.userId },
    data: {
      emailVerified: true,
      updatedAt: new Date(),
    },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return res
    .status(statusCode.Ok200)
    .json({ message: "Email verified successfully" });
});

// verify phone
const verifyPhone = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(statusCode.BadRequest400).json({
      message: "Invalid phone number format. Use format: +919876543210",
    });
  }

  const existingUser = await prisma.user.findFirst({
    where: { phone },
  });

  if (existingUser) {
    return res.status(statusCode.Conflict409).json({
      message: "Phone number already registered",
    });
  }

  await sendOTP(phone);

  res.status(statusCode.Ok200).json({
    message: "OTP sent successfully",
  });
});

// verify OTP
const verifyOTP = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_SERVICE_SID;

  const client = twilio(accountSid, authToken);

  const verification_check = await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: phone, code: otp });

  if (verification_check.status === "approved") {
    return res.status(statusCode.Ok200).json({
      message: "Phone number verified successfully",
    });
  } else {
    return res.status(statusCode.BadRequest400).json({
      message: "Invalid OTP",
    });
  }
});

export {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  requestPasswordReset,
  resetPassword,
  verifyUser,
  verifyPhone,
  verifyOTP,
  sendOtpToEmail,
  verifyEmailOtp,
};
