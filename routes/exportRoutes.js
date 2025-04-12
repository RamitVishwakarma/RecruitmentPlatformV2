import { Router } from "express";
import { exportData } from "../controllers/exportController.js";

const router = Router();

router.route("/export").get(exportData);
export default router;
