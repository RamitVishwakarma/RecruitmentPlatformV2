import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

const adminRegister = asyncHandler(async (req, res) => {
  const { email, password, name, domain } = req.body;

  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  if (existingAdmin) {
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      domain,
      isAdmin: true,
    },
  });

  return res
    .status(statusCode.Created201)
    .json({ message: "Admin registered successfully", admin });
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.user.findUnique({ where: { email } });
  if (!admin || !admin.isAdmin) {
    return res
      .status(statusCode.Unauthorized401)
      .json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    return res
      .status(statusCode.Unauthorized401)
      .json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    { userId: admin.id, isAdmin: admin.isAdmin, email: admin.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );

  const refreshToken = jwt.sign(
    { userId: admin.id, isAdmin: admin.isAdmin, email: admin.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
  });

  return res
    .status(statusCode.Ok200)
    .json({ message: "Admin logged in successfully", admin });
});

const adminLogout = asyncHandler(async (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "No token provided" });
  }

  // Blacklist the token
  await prisma.blackListToken.create({ data: { token } });

  res.clearCookie("accessToken");
  return res
    .status(statusCode.Ok200)
    .json({ message: "Admin logged out successfully" });
});

export { adminRegister, adminLogin, adminLogout };
