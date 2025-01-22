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

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               admissionNumber:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *               - admissionNumber
 *     responses:
 *       201:
 *         description: User registered successfully, verification email sent
 *       400:
 *         description: Validation errors or user already exists
 *       500:
 *         description: Server error during registration
 */
router.post("/register", authLimiter, registerUser);

/**
 * @swagger
 * /users/request-password-reset:
 *   post:
 *     summary: Request password reset for user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset link sent to email
 *       404:
 *         description: User not found
 *       500:
 *         description: Error occurred while requesting password reset
 */
router.post(
  "/request-password-reset",
  passwordResetLimiter,
  requestPasswordReset,
);

/**
 * @swagger
 * /users/verify/{token}:
 *   get:
 *     summary: Verify user's email address
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error during email verification
 */
router.get("/verify/:token", verifyUser);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - token
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token or new password is invalid
 *       500:
 *         description: Server error during password reset
 */
router.post("/reset-password", passwordResetLimiter, resetPassword);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user and get access and refresh tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in, tokens generated
 *       400:
 *         description: Invalid credentials or missing fields
 *       500:
 *         description: Error occurred during login
 */
router.post("/login", authLimiter, loginUser);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout user by invalidating their refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Token is missing or invalid
 *       500:
 *         description: Error occurred during logout
 */
router.post("/verify-phone", authLimiter, verifyPhone);
router.post("/verify-otp", authLimiter, verifyOTP);
router.route("/logout").post(logoutUser);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh the access token using the refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_Token:
 *                 type: string
 *             required:
 *               - refresh_Token
 *     responses:
 *       201:
 *         description: Access token refreshed successfully
 *       400:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Error occurred while refreshing token
 */
router.route("/refresh-token").post(refreshAccessToken);

export default router;
