import express from "express";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import questionsRoutes from "./routes/questionsRoutes.js"
import optionsRoutes from "./routes/optionsRoutes.js"

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/questions", questionsRoutes);
app.use("/options", optionsRoutes)

export default app;
