import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

//reminder:-use this middleware later for protected routes for all GDG members and the users after they login
const authMiddleware = async (req, res, next) => {
  try {
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

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export { authMiddleware };
