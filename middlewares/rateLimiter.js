import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 3,
  message: { error: "Too many attempts. Please try again later." },
});

export const passwordResetLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 3,
  message: { error: "Too many attempts. Please try again later." },
});
