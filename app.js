import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  userRoutes,
  aptitudeRoutes,
  userAptitudeDetailsRoutes,
  questionRoutes,
  optionsRoutes,
  authRoutes,
  socialRoutes,
  oauthRoutes,
} from "./routes/index.js";
import session from "express-session";
import passport from "passport";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.use("/users", userRoutes);
app.use("/questions", questionRoutes);
app.use("/options", optionsRoutes);
app.use("/aptitude", aptitudeRoutes);
app.use("/users", userAptitudeDetailsRoutes);
app.use("/users", authRoutes);
app.use("/auth", oauthRoutes);
app.use("/social", socialRoutes);
export default app;
