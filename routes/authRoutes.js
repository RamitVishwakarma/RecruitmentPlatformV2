import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken } from "../controllers/authController.js";
const router = Router();

router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router