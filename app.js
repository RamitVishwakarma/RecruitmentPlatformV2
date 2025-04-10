import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  authRoutes,
  socialRoutes,
  oauthRoutes,
  adminRoutes,
  userDetailsUpdateRoutes,
  uploadRoutes,
  userAptitudeRoutes,
  notificationRoutes,
  questionRoutes,
  answerRoutes,
} from "./routes/index.js";
import swaggerSpecs from "./utils/swaggerconfig.js";
import swaggerUi from "swagger-ui-express";
import session from "express-session";
import passport from "passport";
import requestLogger from "./middlewares/requestLogger.js";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(requestLogger);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send(
    '<h1>Welcome to Recruitment Platform</h1><a href="/auth/google">Login with Google</a>',
  );
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/users", authRoutes);
app.use("/auth", oauthRoutes);
app.use("/social", socialRoutes);
app.use("/users", userDetailsUpdateRoutes);
app.use("/admin", adminRoutes);
app.use("/upload", uploadRoutes);
app.use("/users", userAptitudeRoutes);
app.use("/questions", questionRoutes);
app.use("/questions", answerRoutes);
app.use("/notification", notificationRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  const errorResponse = {
    error: err.name || "Error",
    message: err.message || "Internal Server Error",
  };

  switch (err.name) {
    case "TokenExpiredError":
      return res.status(401).json({
        error: "Unauthorized",
        message: "Token expired, please log in again.",
      });

    case "JsonWebTokenError":
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "Invalid token" });

    case "ValidationError":
      return res.status(400).json({
        error: "Bad Request",
        message: "Validation error",
        details: err.errors,
      });

    case "NotFoundError":
      return res
        .status(404)
        .json({ error: "Not Found", message: "Resource not found" });

    case "UnauthorizedError":
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "Unauthorized access" });

    case "CastError":
      return res
        .status(400)
        .json({ error: "Bad Request", message: "Invalid ID format" });

    case "RateLimitExceeded":
      return res.status(429).json({
        error: "Too Many Requests",
        message: "Too many requests. Please try again later.",
      });

    default:
      return res.status(err.status || 500).json(errorResponse);
  }
});

export default app;
