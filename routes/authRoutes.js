import { Router } from "express";
import {
  passwordResetLimiter,
  authLimiter,
} from "../middlewares/rateLimiter.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
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
} from "../controllers/authController.js";

const router = Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
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
router.post(
  "/register",
  authLimiter,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  registerUser,
);

/**
 * @swagger
 * /users/send-otp-email:
 *   post:
 *     summary: Send OTP to email for verification
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email to which the OTP will be sent
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent to the provided email successfully
 *       400:
 *         description: Email already registered
 *       429:
 *         description: OTP request too frequent, please wait before retrying
 *       500:
 *         description: Internal server error while sending OTP
 */
router.post("/send-otp-email", sendOtpToEmail);

/**
 * @swagger
 * /users/verify-otp-email:
 *   post:
 *     summary: Verify the OTP sent to email
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email associated with the OTP
 *               otp:
 *                 type: string
 *                 description: The OTP received in email
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Internal server error during OTP verification
 */
router.post("/verify-otp-email", verifyEmailOtp);

/**
 * @swagger
 * /users/request-password-reset:
 *   post:
 *     summary: Request password reset for user
 *     tags: [User]
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
 *     tags: [User]
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
 *     tags: [User]
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
 * /users/reset-password-with-old-password:
 *   post:
 *     summary: Reset user password using the old password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - email
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid old password or new password is invalid
 *       500:
 *         description: Server error during password reset
 */
router.post(
  "/reset-password-with-old-password",
  resetPasswordWithOldPassword,
  authMiddleware,
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user and get access and refresh tokens
 *     tags: [User]
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
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Token is missing or invalid
 *       500:
 *         description: Error occurred during logout
 */
router.route("/logout").post(logoutUser);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh the access token using the refresh token
 *     tags: [User]
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
