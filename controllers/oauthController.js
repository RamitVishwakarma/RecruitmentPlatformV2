import { asyncHandler } from "../utils/asyncHandler.js";

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
    res.clearCookie("connect.sid");
    const googleLogoutURL = "https://accounts.google.com/logout";
    res.redirect(googleLogoutURL);
  });
});

export { loginSuccess, logout };
