import passport from "../utils/passport.js";
import { loginSuccess, logout } from "../controllers/oauthController.js";
import { Router } from "express";

const router = Router();
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    res.redirect("http://localhost:3000/login");
  },
);

router.get("/login", loginSuccess);
router.get("/logout", logout);
router.get("/google-logout-redirect", (req, res) => {
  res.redirect(process.env.FRONTEND_URL);
});

export default router;
