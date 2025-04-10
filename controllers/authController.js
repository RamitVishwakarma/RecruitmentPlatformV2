import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendRegistrationEmail,
} from "../utils/sendMailerEmail.js";
import { validatePassword } from "../utils/validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "All fields are required" });

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      socialLinks: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
          link: true,
        },
      },
    },
  });
  if (!user)
    return res
      .status(statusCode.NotFount404)
      .json({ message: "User with the specified email does not exist." });

  const validatePassword = await bcrypt.compare(password, user.password);
  if (!validatePassword)
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "Password doesn’t match. Try again." });

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, isAdmin: user.isAdmin },
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
  return res
    .status(statusCode.Ok200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({ message: "User logged in successfully", user: user });
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

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

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
  if (presentTime > dbToken.expiresAt) {
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
    socialLinks,
    photoUrl,
    resume,
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
      photo: photoUrl ?? null,
      resume: resume ?? null,
      domain: domain ?? null,
      year: year ?? null,
      socialLinks: {
        create: socialLinks,
      },
    },
    include: {
      socialLinks: true,
    },
  });

  const userData = name;
  await sendRegistrationEmail(email, userData);

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, isAdmin: user.isAdmin },
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

  return res
    .status(statusCode.Created201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      message: "Registration successful.",
      user: user,
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

    return res.status(200).json({
      message: "OTP sent to email",
    });
  } catch (error) {
    return res.status(500).json({
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

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
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

  console.log(resetToken);

  await sendPasswordResetEmail(email, resetToken.token);

  return res.status(statusCode.Ok200).json({
    message: "Password reset link sent to email",
  });
});

// reset password

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });
  // console.log(verificationToken);

  if (
    !verificationToken ||
    verificationToken.type !== "PASSWORD_RESET" ||
    verificationToken.expiresAt < new Date()
  ) {
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

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return res
      .status(statusCode.BadRequest400)
      .json({ errors: passwordValidation.errors });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: decoded.userId },
    data: { password: hashedPassword },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return res.status(statusCode.Ok200).json({
    message: "Password reset successful",
  });
});

// reset password with old password {authenticated route}

const resetPasswordWithOldPassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "Old and new password, email required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "User not found" });
  }

  if (user.id !== req.user.userId) {
    return res
      .status(statusCode.Unauthorized401)
      .json({ message: "User is unauthorised" });
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "Old password is incorrect" });
  }

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return res
      .status(statusCode.BadRequest400)
      .json({ errors: passwordValidation.errors });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  return res.status(statusCode.Ok200).json({
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

  if (verificationToken.type !== "PASSWORD_RESET") {
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
      updatedAt: new Date(),
    },
  });

  // await prisma.verificationToken.delete({
  //   where: { token },
  // });

  return res
    .status(statusCode.Ok200)
    .json({ message: "Email verified successfully" });
});

export {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  requestPasswordReset,
  resetPassword,
  resetPasswordWithOldPassword,
  verifyUser,
  sendOtpToEmail,
  verifyEmailOtp,
};
