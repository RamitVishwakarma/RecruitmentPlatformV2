import { Router } from "express";
import {
  getUserById,
  getUsersByDomain,
  checkUserShortlistStatus,
  updateUserShortlistStatus,
  updateUserInterviewStatus,
  updateUserProjectStatus,
  updateUserAptitudeStatus,
} from "../controllers/userController.js";
import { paginationMiddleware } from "../middlewares/paginationMiddleware.js";

const router = Router();

/**
 * @swagger
 * /admin/users/shortlisted-users:
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
router
  .route("/shortlisted-users")
  .get(paginationMiddleware, checkUserShortlistStatus);

/**
 * @swagger
 * /admin/users/update-shortlist-status:
 *   put:
 *     summary: Update user shortlist status
 *     tags: [Admin - User]
 *     description: Update the shortlist status of a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The unique ID of the user.
 *               shortlisted:
 *                 type: string
 *                 description: The new shortlist status of the user.
 *     responses:
 *       200:
 *         description: User shortlist status updated successfully.
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid user ID or shortlist status.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
 */
router.route("/update-shortlist-status").put(updateUserShortlistStatus);

/**
 * @swagger
 * /admin/users/update-interview-status:
 *   put:
 *     summary: Update user interview status
 *     tags: [Admin - User]
 *     description: Update the interview status of a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The unique ID of the user.
 *               interviewed:
 *                 type: string
 *                 description: The new interview status of the user.
 *     responses:
 *       200:
 *         description: User interview status updated successfully.
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid user ID or interview status.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
 */
router.route("/update-interview-status").put(updateUserInterviewStatus);

/**
 * @swagger
 * /admin/users/update-project-status:
 *   put:
 *     summary: Update user project status
 *     tags: [Admin - User]
 *     description: Update the project status of a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The unique ID of the user.
 *               projectSubmitted:
 *                 type: string
 *                 description: The new project status of the user.
 *     responses:
 *       200:
 *         description: User project status updated successfully.
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid user ID or project status.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
 */
router.route("/update-project-status").put(updateUserProjectStatus);

/**
 * @swagger
 * /admin/users/update-aptitude-status:
 *   put:
 *     summary: Update user aptitude status
 *     tags: [Admin - User]
 *     description: Update the aptitude status of a user after quiz submission.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The unique ID of the user.
 *               quizSubmitted:
 *                 type: string
 *                 description: The new aptitude status of the user (expects "true" or "false").
 *     responses:
 *       200:
 *         description: User aptitude status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User aptitude status updated successfully
 *                 user:
 *                   type: object
 *                   description: The updated user object.
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid user ID or quiz status.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found!
 */
router.route("/update-aptitude-status").put(updateUserAptitudeStatus);

/**
 * @swagger
 * /admin/users/:
 *   get:
 *     summary: Get users by domain
 *     tags: [Admin - User]
 *     description: Retrieve a paginated list of users filtered by their domain (e.g., programming, development, etc.).
 *     parameters:
 *       - in: query
 *         name: domain
 *         schema:
 *           type: string
 *         description: The domain to filter users by (e.g., "Programming").
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter users by year.
 *       - in: query
 *         name: shortlistedStatus
 *         schema:
 *           type: boolean
 *         description: Filter users by shortlist status.
 *       - in: query
 *         name: interviewedStatus
 *         schema:
 *           type: boolean
 *         description: Filter users by interview status.
 *       - in: query
 *         name: projectSubmitted
 *         schema:
 *           type: boolean
 *         description: Filter users by project submission status.
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
 *         description: No users found in the specified filters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No users found with specific filters
 */
router.route("/").get(paginationMiddleware, getUsersByDomain);

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

export default router;
