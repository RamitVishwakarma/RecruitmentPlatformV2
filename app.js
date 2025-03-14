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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/users", authRoutes);
app.use("/auth", oauthRoutes);
app.use("/social", socialRoutes);
app.use("/users", userDetailsUpdateRoutes);
app.use("/admin", adminRoutes);
app.use("/upload", uploadRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
