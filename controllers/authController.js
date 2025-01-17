import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/emailService.js";
import { validatePassword } from "../utils/validators.js";

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) return res.status(400).json({ message: "Unable to find User" });

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword)
      return res.status(400).json({ message: "Invalid user credentials" });

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
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "User logged in successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while logging in", error: error.message });
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      res.status(400).json({ message: "Token is missing" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) res.status(400).json({ message: "Invalid token" });

    await prisma.blackListToken.create({
      data: {
        token,
      },
    });

    return res.status(201).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured while logging out user",
      error: error.message,
    });
  }
};

const refreshAccessToken = async (req, res, next) => {
  const { refresh_Token } = req.body;
  if (!refresh_Token) {
    res.status(400).json({ message: "Refresh token required" });
  }

  try {
    const dbToken = await prisma.refreshToken.findUnique({
      where: {
        token: refresh_Token,
      },
      include: {
        user: true,
      },
    });

    if (!dbToken) {
      return res.status(400).json({ message: "Refresh Token not found" });
    }

    const presentTime = new Date();
    if (presentTime > refresh_Token.expiresAt) {
      await prisma.refreshToken.delete({
        where: {
          token: refresh_Token,
        },
      });
      return res.status(401).json({ message: "Refresh Token Deleted" });
    }

    const refreshedAccessToken = jwt.sign(
      { userId: dbToken.user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    );
    if (!refreshedAccessToken) {
      return res.status(400).json({ message: "Refreshed Token not found" });
    }
    return res.status(201).json({
      message: "Access Token refreshed",
      accessToken: refreshedAccessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while refreshing Access Token",
      error: error.message,
    });
  }
};

// register user

const registerUser = async (req, res) => {
  const { name, email, password, admissionNumber } = req.body;

  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Invalid email address.");
  }

  if (!admissionNumber || admissionNumber.trim().length < 3) {
    errors.push("Admission number must be at least 3 characters long.");
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        admissionNumber,
      },
    });

    const verificationToken = await prisma.verificationToken.create({
      data: {
        token: jwt.sign({ userId: user.id }, process.env.PASSWORD_RESET_SECRET),
        userId: user.id,
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    await sendVerificationEmail(email, verificationToken.token);

    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during registration",
      error: error.message,
    });
  }
};

// request password reset

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = await prisma.verificationToken.create({
      data: {
        token: jwt.sign({ userId: user.id }, process.env.PASSWORD_RESET_SECRET),
        userId: user.id,
        type: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    await sendPasswordResetEmail(email, resetToken.token);

    res.status(200).json({
      message: "Password reset link sent to email",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error requesting password reset",
      error: error.message,
    });
  }
};

// reset password

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.type !== "PASSWORD_RESET") {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const decoded = jwt.verify(token, process.env.PASSWORD_RESET_SECRET);

    if (!decoded) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ errors: passwordValidation.errors });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    prisma.verificationToken.delete({
      where: { token },
    });

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

// verify user

const verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    if (verificationToken.type !== "EMAIL_VERIFICATION") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    if (new Date() > verificationToken.expiresAt) {
      await prisma.verificationToken.delete({
        where: { token },
      });
      return res.status(400).json({ message: "Token has expired" });
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

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error verifying email",
      error: error.message,
    });
  }
};

export {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  requestPasswordReset,
  resetPassword,
  verifyUser,
};
