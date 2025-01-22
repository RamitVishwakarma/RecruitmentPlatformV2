import { Router } from "express";
import {
  passwordResetLimiter,
  authLimiter,
} from "../middlewares/rateLimiter.js";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  requestPasswordReset,
  resetPassword,
  verifyUser,
  verifyPhone,
  verifyOTP,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", authLimiter, registerUser);
router.post(
  "/request-password-reset",
  passwordResetLimiter,
  requestPasswordReset,
);
router.get("/verify/:token", verifyUser);
router.post("/reset-password", passwordResetLimiter, resetPassword);
router.post("/login", authLimiter, loginUser);
router.post("/verify-phone", authLimiter, verifyPhone);
router.post("/verify-otp", authLimiter, verifyOTP);
router.route("/logout").post(logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
