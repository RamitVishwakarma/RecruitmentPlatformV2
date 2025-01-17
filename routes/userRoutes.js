import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  checkUserShortlistStatus,
} from "../controllers/userController.js";
import { paginationMiddleware } from "../middlewares/paginationMiddleware.js";

const router = Router();

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     description: Retrieve a paginated list of all users.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: A paginated list of users.
 *       400:
 *         description: Error in fetching users.
 */
router.route("/").get(paginationMiddleware, getUsers);

/**
 * @swagger
 * /users/shortlist:
 *   get:
 *     summary: Check user shortlist status
 *     tags: [User]
 *     description: Retrieve a paginated list of users and their shortlist statuses.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: Users and shortlist statuses fetched successfully.
 */
router.route("/shortlist").get(paginationMiddleware, checkUserShortlistStatus);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     description: Retrieve user details by their unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user.
 *     responses:
 *       200:
 *         description: User details fetched successfully.
 *       404:
 *         description: User not found.
 */
router.route("/:id").get(getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [User]
 *     description: Update the details of a specific user by their unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               admissionNumber:
 *                 type: string
 *               domain:
 *                 type: string
 *               year:
 *                 type: string
 *               photo:
 *                 type: string
 *               resume:
 *                 type: string
 *               aptitudeScore:
 *                 type: number
 *               aptitudeDetails:
 *                 type: object
 *               socialLinks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     link:
 *                       type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: No fields provided or user not found.
 */
router.route("/:id").put(updateUser);

/**
 * @swagger
 * /users/delete/{id}:
 *   put:
 *     summary: Delete a user
 *     tags: [User]
 *     description: Soft delete a user by marking them as deleted.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
router.route("/delete/:id").put(deleteUser);

export default router;
