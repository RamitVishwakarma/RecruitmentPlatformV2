import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  checkUserShortlistStatus,
} from "../controllers/userController.js";
import { paginationMiddleware } from "../middlewares/paginationMiddleware.js";

const router = Router();

router.route("/").get(paginationMiddleware, getUsers);
router.route("/shortlist").get(paginationMiddleware, checkUserShortlistStatus);
router.route("/:id").get(getUserById);
router.route("/:id").put(updateUser);
router.route("/delete/:id").put(deleteUser);

export default router;
