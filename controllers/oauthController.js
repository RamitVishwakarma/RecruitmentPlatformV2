import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();

const loginSuccess = asyncHandler((req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  res.json({
    message: "Welcome to your profile!",
    user: req.user,
  });
});

const logout = asyncHandler((req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout Failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(
        "https://accounts.google.com/o/oauth2/v2/auth" +
          "?response_type=code" +
          "&client_id=" +
          process.env.GOOGLE_CLIENT_ID +
          "&redirect_uri=" +
          encodeURIComponent(process.env.CALLBACK_URL) +
          "&scope=profile%20email" +
          "&prompt=select_account",
      );
    });
  });
});

export { loginSuccess, logout };
