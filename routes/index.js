import express from "express";
import authRoutes from "./authRoutes.js";
import socialRoutes from "./socialRoutes.js";
import oauthRoutes from "./oauthRoutes.js";
import adminRoutes from "./adminRoutes.js";
import userDetailsUpdateRoutes from "./userDetailsUpdateRoutes.js";

const router = express.Router();

router.use("/", authRoutes);
router.use("/", oauthRoutes);
router.use("/", socialRoutes);
router.use("/", adminRoutes);
router.use("/", userDetailsUpdateRoutes);

export {
  authRoutes,
  socialRoutes,
  oauthRoutes,
  adminRoutes,
  userDetailsUpdateRoutes,
};
