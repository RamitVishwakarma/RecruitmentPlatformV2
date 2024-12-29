import { Router } from "express";
import { createUser,getUsers,getUserById,updateUser,deleteUser } from "../controllers/userController.js";
const router = Router();

router.route("/").post(createUser)
router.route("/").get(getUsers)
router.route("/:id").get(getUserById)
router.route("/:id").put(updateUser)
router.route("/:id").delete(deleteUser)

export default router;
