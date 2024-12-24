import { Router } from "express";
import { createAptitude,getAllAptitudes,getAptitudesById,updateAptitude,deleteAptitude } from "../controllers/aptitudecontroller.js"; 
const router = Router();

router.route('/create-aptitude').post(createAptitude)
router.route('/').get(getAllAptitudes)
router.route('/:id').get(getAptitudesById)
router.route('/update-aptitude/:id').put(updateAptitude)
router.route('/delete-aptitude/:id').delete(deleteAptitude)

export default router