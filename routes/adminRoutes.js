import { Router } from "express";

import userRoutes from "./userRoutes";
import questionRoutes from "./questionRoutes";
import optionsRoutes from "./optionsRoutes";
import aptitudeRoutes from "./aptitudeRoutes";
import userAptitudeDetailsRoutes from "./userAptitudeDetailsRoutes";
import socialRoutes from "./socialRoutes";
import contestProblemRoutes from "./contestProblemRoutes";
import contestRoutes from "./contestRoutes";
import testcaseRoutes from "./testcaseRoutes";
import codingQuestionsRoutes from "./codingQuestionsRoutes";

const router = Router();

app.use("/users", userRoutes);
app.use("/questions", questionRoutes);
app.use("/options", optionsRoutes);
app.use("/aptitude", aptitudeRoutes);
app.use("/users", userAptitudeDetailsRoutes);
app.use("/social", socialRoutes);
app.use("/contest", contestProblemRoutes);
app.use("/contest", contestRoutes);
app.use("/contest", testcaseRoutes);
app.use("/problems", codingQuestionsRoutes);

export default router;
