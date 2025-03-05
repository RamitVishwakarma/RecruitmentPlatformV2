import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//reminder:-use this middleware later for protected routes for all GDG members and the users after they login
const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(401).json({ message: "Unauthorized request" });
  }

  const blacklistedToken = await prisma.blackListToken.findUnique({
    where: {
      token,
    },
  });
  if (blacklistedToken) {
    res.status(401).json({ message: "Token has been blacklisted" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

export { authMiddleware };
