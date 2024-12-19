import express from "express";
import { config } from "dotenv";
import userRouter from "./userRoutes.js";

config();

const router = express.Router();

router.use("/users", userRouter);

export default router;
