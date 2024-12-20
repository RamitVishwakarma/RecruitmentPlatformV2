import { Router } from "express";
import { createUserAptitudeDetails,getUserAptitudeDetails,updateUserAptitudeDetails,deleteUserAptitudeDetails } from "../controllers/userAptitudeDetailsController.js";
const router = Router();

router.route('/create-user-aptitude-details').post(createUserAptitudeDetails)
router.route('/get-user-update-details/:userId').get(getUserAptitudeDetails)
router.route('/update-user-aptitude-details/:userId').put(updateUserAptitudeDetails)
router.route('/delete-user-aptitude-details/:userId').delete(deleteUserAptitudeDetails)

export default router