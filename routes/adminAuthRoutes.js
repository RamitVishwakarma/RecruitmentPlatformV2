import { Router } from "express";

import {
  adminLogin,
  adminLogout,
  adminRegister,
} from "../controllers/adminAuthController.js";

const router = Router();

/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin - Auth]
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
 *         description: Admin logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error during login
 */
router.post("/login", adminLogin);

/**
 * @swagger
 * /admin/auth/logout:
 *   post:
 *     summary: Admin logout
 *     tags: [Admin - Auth]
 *     responses:
 *       200:
 *         description: Admin logged out successfully
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Server error during logout
 */
router.post("/logout", adminLogout);

/**
 * @swagger
 * /admin/auth/register:
 *   post:
 *     summary: Admin registration
 *     tags: [Admin - Auth]
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
 *               name:
 *                 type: string
 *               domain:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Admin already exists
 *       500:
 *         description: Server error during registration
 */
router.post("/register", adminRegister);

export default router;
