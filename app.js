import express from "express";
import cors from "cors";
<<<<<<< HEAD
import routes from "./routes/index.js";
=======
import { userRoutes, aptitudeRoutes, userAptitudeDetailsRoutes } from "./routes/index.js";
>>>>>>> 96ddcbe7978e3479b0b83a054866bc55131cbf50

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
app.use("/", routes);

=======
app.use("/users", userRoutes);
app.use("/aptitude", aptitudeRoutes)
app.use("/users", userAptitudeDetailsRoutes)
>>>>>>> 96ddcbe7978e3479b0b83a054866bc55131cbf50
export default app;
