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
    res.redirect("/auth/login");
  },
);

router.get("/login", loginSuccess);
router.get("/logout", logout);
router.get("/google-logout-redirect", (req, res) => {
  res.redirect("http://localhost:5000");
});

export default router;
