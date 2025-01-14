import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @swagger
 * /user-aptitude-details:
 *   get:
 *     summary: Get user aptitude details
 *     description: Retrieve a user's aptitude test results.
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: The ID of the user to retrieve aptitude details for.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's aptitude test results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 aptitudeScore:
 *                   type: integer
 *                 testDate:
 *                   type: string
 *                   format: date
 */
const createUserAptitudeDetails = asyncHandler(async (req, res) => {
  const { userId, aptitudeScore } = req.body;

  const newDetails = await prisma.userAptitudeDetails.create({
    data: { userId: userId, aptitudeScore: aptitudeScore },
  });

  return res.status(201).json({
    message: "User Aptitude Details created successfully",
    newDetails,
  });
});

/**
 * @swagger
 * /user-aptitude-details:
 *   get:
 *     summary: Get user aptitude details
 *     description: Retrieve a user's aptitude test results.
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: The ID of the user to retrieve aptitude details for.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's aptitude test results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 aptitudeScore:
 *                   type: integer
 *                 testDate:
 *                   type: string
 *                   format: date
 */
const getUserAptitudeDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const details = await prisma.userAptitudeDetails.findUnique({
    where: { userId: userId, isDeleted: false },
  });
  if (!details) {
    return res.status(404).json({ error: "Details not found" });
  }
  return res.status(201).json({
    message: "User Aptitude Details obtained successfully",
    details,
  });
});

/**
 * @swagger
 * /user-aptitude-details:
 *   get:
 *     summary: Get user aptitude details
 *     description: Retrieve a user's aptitude test results.
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: The ID of the user to retrieve aptitude details for.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's aptitude test results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 aptitudeScore:
 *                   type: integer
 *                 testDate:
 *                   type: string
 *                   format: date
 */
const updateUserAptitudeDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { aptitudeScore } = req.body;

  const updatedDetails = await prisma.userAptitudeDetails.update({
    where: { userId: userId, isDeleted: false },
    data: { aptitudeScore },
  });
  return res.status(201).json({
    message: "User Aptitude Details updated successfully",
    updatedDetails,
  });
});

/**
 * @swagger
 * /user-aptitude-details:
 *   get:
 *     summary: Get user aptitude details
 *     description: Retrieve a user's aptitude test results.
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: The ID of the user to retrieve aptitude details for.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's aptitude test results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 aptitudeScore:
 *                   type: integer
 *                 testDate:
 *                   type: string
 *                   format: date
 */
const deleteUserAptitudeDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  await prisma.userAptitudeDetails.update({
    where: { userId },
    data: {
      isDeleted: true,
    },
  });
  return res
    .status(201)
    .json({ message: "User Aptitude Details deleted successfully" });
});
export {
  createUserAptitudeDetails,
  getUserAptitudeDetails,
  updateUserAptitudeDetails,
  deleteUserAptitudeDetails,
};
