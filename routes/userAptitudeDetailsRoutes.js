import { Router } from "express";
import {
  createUserAptitudeDetails,
  getUserAptitudeDetails,
  updateUserAptitudeDetails,
  deleteUserAptitudeDetails,
} from "../controllers/userAptitudeDetailsController.js";
const router = Router();

router.route("/create-details").post(createUserAptitudeDetails);
router.route("/get-details/:userId").get(getUserAptitudeDetails);
router.route("/update-details/:userId").put(updateUserAptitudeDetails);
router.route("/delete-details/:userId").put(deleteUserAptitudeDetails);

export default router;
