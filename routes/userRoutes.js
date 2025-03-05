import { Router } from "express";
import {
  getUsers,
  getUserById,
  getUsersByDomain,
  updateUser,
  deleteUser,
  checkUserShortlistStatus,
} from "../controllers/userController.js";
import { paginationMiddleware } from "../middlewares/paginationMiddleware.js";

const router = Router();

/**
 * @swagger
 * /admin/users/:
 *   get:
 *     summary: Get all users
 *     tags: [Admin - User]
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
 * /admin/users/shortlist:
 *   get:
 *     summary: Check user shortlist status
 *     tags: [Admin - User]
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
 * /admin/users/domain:
 *   get:
 *     summary: Get users by domain
 *     tags: [Admin - User]
 *     description: Retrieve a paginated list of users filtered by their domain (e.g., programming, development, etc.).
 *     parameters:
 *       - in: query
 *         name: domain
 *         schema:
 *           type: string
 *         required: true
 *         description: The domain to filter users by (e.g., "Programming").
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page for pagination.
 *     responses:
 *       200:
 *         description: List of users successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique user ID.
 *                       name:
 *                         type: string
 *                         description: Name of the user.
 *                       domain:
 *                         type: string
 *                         description: User's domain (e.g., programming, development).
 *                       socialLinks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             platform:
 *                               type: string
 *                               description: Social media platform (e.g., LinkedIn).
 *                             link:
 *                               type: string
 *                               description: Link to the user's profile.
 *                       aptitude:
 *                         type: object
 *                         description: Aptitude-related details.
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: Current page number.
 *                     total:
 *                       type: integer
 *                       description: Total number of users in the domain.
 *                     pages:
 *                       type: integer
 *                       description: Total number of pages.
 *       400:
 *         description: Domain parameter is missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Domain parameter is required.
 *       404:
 *         description: No users found in the specified domain.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No users found in the programming domain.
 */
router.route("/domain").get(paginationMiddleware, getUsersByDomain);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Admin - User]
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
 * /admin/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Admin - User]
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
 * /admin/users/delete/{id}:
 *   put:
 *     summary: Delete a user
 *     tags: [Admin - User]
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
