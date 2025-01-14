import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//~ Create a social link
/**
 * @swagger
 * /social:
 *   get:
 *     summary: Get social media links
 *     description: Retrieve a list of social media links available for the user.
 *     responses:
 *       200:
 *         description: A list of social media links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   platform:
 *                     type: string
 *                   url:
 *                     type: string
 */
const createSocialLink = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, link } = req.body;

  if (!name || !link || !userId) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const existingLink = await prisma.socialLink.findFirst({
    where: { name, userId, isDeleted: false },
  });

  if (existingLink) {
    return res.status(400).json({
      message: `Link already exists for this user: ${name}`,
    });
  }

  const socialLink = await prisma.socialLink.create({
    data: {
      name,
      link,
      userId,
    },
  });

  return res.status(201).json({ message: "Social link created!", socialLink });
});

//~ Get social links by userId
/**
 * @swagger
 * /social:
 *   get:
 *     summary: Get social media links
 *     description: Retrieve a list of social media links available for the user.
 *     responses:
 *       200:
 *         description: A list of social media links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   platform:
 *                     type: string
 *                   url:
 *                     type: string
 */
const getSocialLinksByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required!" });
  }

  const socialLinks = await prisma.socialLink.findMany({
    where: { userId, isDeleted: false },
  });

  if (socialLinks.length === 0) {
    return res.status(404).json({ message: "No social links found!" });
  }

  return res.status(200).json(socialLinks);
});

//~ Update a social link
/**
 * @swagger
 * /social:
 *   get:
 *     summary: Get social media links
 *     description: Retrieve a list of social media links available for the user.
 *     responses:
 *       200:
 *         description: A list of social media links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   platform:
 *                     type: string
 *                   url:
 *                     type: string
 */
const updateSocialLink = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { link } = req.body;

  if (!link || !id) {
    return res.status(400).json({ message: "Link and id are required!" });
  }

  const existingLink = await prisma.socialLink.findUnique({
    where: { id, isDeleted: false },
  });

  if (!existingLink) {
    return res.status(404).json({ message: "Social link not found!" });
  }

  const duplicateLink = await prisma.socialLink.findFirst({
    where: { link, userId: existingLink.userId, isDeleted: false },
  });

  if (duplicateLink && duplicateLink.id === id) {
    return res
      .status(400)
      .json({ message: "Link already exists for this user!" });
  }

  const updatedLink = await prisma.socialLink.update({
    where: { id, isDeleted: false },
    data: {
      link,
    },
  });

  return res.status(200).json({ message: "Social link updated!", updatedLink });
});

//~ Delete a social link
/**
 * @swagger
 * /social:
 *   get:
 *     summary: Get social media links
 *     description: Retrieve a list of social media links available for the user.
 *     responses:
 *       200:
 *         description: A list of social media links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   platform:
 *                     type: string
 *                   url:
 *                     type: string
 */
const deleteSocialLink = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existingLink = await prisma.socialLink.findUnique({
    where: { id, isDeleted: false },
  });

  if (!existingLink) {
    return res.status(404).json({ message: "Social link not found!" });
  }

  await prisma.socialLink.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });

  return res.status(200).json({ message: "Social link deleted!" });
});

export {
  createSocialLink,
  getSocialLinksByUserId,
  updateSocialLink,
  deleteSocialLink,
};
