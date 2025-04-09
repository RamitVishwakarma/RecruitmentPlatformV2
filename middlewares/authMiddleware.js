import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//reminder:-use this middleware later for protected routes for all GDG members and the users after they login
const authMiddleware = asyncHandler(async (req, res, next) => {
  let accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  const blacklistedToken = await prisma.blackListToken.findUnique({
    where: { token: accessToken },
  });

  if (blacklistedToken) {
    return res.status(401).json({ message: "Token has been blacklisted" });
  }

  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );
    req.user = decodedToken;
    // console.log(req.user);
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
        );

        const blacklistedRefreshToken = await prisma.blackListToken.findUnique({
          where: { token: refreshToken },
        });

        if (blacklistedRefreshToken) {
          return res.status(403).json({
            message: "Refresh token has been blacklisted. Please log in again.",
          });
        }

        const dbToken = await prisma.refreshToken.findUnique({
          where: { token: refreshToken },
          include: { user: true },
        });

        if (!dbToken) {
          return res
            .status(403)
            .json({ message: "Invalid refresh token. Please log in again." });
        }

        const newAccessToken = jwt.sign(
          {
            userId: dbToken.user.id,
            email: dbToken.user.email,
            isAdmin: dbToken.user.isAdmin,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
        );

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
        });

        req.user = dbToken.user;
        return next();
      } catch (refreshErr) {
        return res
          .status(403)
          .json({ message: "Refresh token expired. Please log in again." });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Invalid access token. Please log in again." });
    }
  }
});

export { authMiddleware };
