import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

const adminAuthMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res
      .status(statusCode.Unauthorized401)
      .json({ message: "Unauthorized request" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });

    if (!user || !user.isAdmin) {
      return res
        .status(statusCode.Forbidden403)
        .json({ message: "Forbidden: Admins only" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(statusCode.Unauthorized401)
      .json({ message: "Invalid or expired token" });
  }
});

export { adminAuthMiddleware };
