import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";
import { statusCode } from "../utils/statusCodes.js";

dotenv.config();

const loginSuccess = asyncHandler((req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  const user = req.user;
  res.json({
    message: "Welcome to your profile!",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      googleId: user.googleId ?? null,
    },
  });
});

const logout = asyncHandler((req, res) => {
  req.logout((err) => {
    if (err)
      return res
        .status(statusCode.ServerError500)
        .json({ error: "Logout Failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(process.env.FRONTEND_URL + "/login");
      // res.redirect(
      //   "https://accounts.google.com/o/oauth2/v2/auth" +
      //     "?response_type=code" +
      //     "&client_id=" +
      //     process.env.GOOGLE_CLIENT_ID +
      //     "&redirect_uri=" +
      //     encodeURIComponent(process.env.CALLBACK_URL) +
      //     "&scope=profile%20email" +
      //     "&prompt=select_account",
      // );
    });
  });
});

export { loginSuccess, logout };
