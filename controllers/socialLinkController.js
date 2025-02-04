import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

//~ Create a social link

const createSocialLink = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, link } = req.body;

  if (!name || !link || !userId) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "All fields are required!" });
  }

  const existingLink = await prisma.socialLink.findFirst({
    where: { name, userId, isDeleted: false },
  });

  if (existingLink) {
    return res.status(statusCode.Conflict409).json({
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

  return res
    .status(statusCode.Created201)
    .json({ message: "Social link created!", socialLink });
});

//~ Get social links by userId

const getSocialLinksByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "userId is required!" });
  }

  const socialLinks = await prisma.socialLink.findMany({
    where: { userId, isDeleted: false },
  });

  if (socialLinks.length === 0) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "No social links found!" });
  }

  return res.status(statusCode.Ok200).json(socialLinks);
});

//~ Update a social link

const updateSocialLink = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { link } = req.body;

  if (!link || !id) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "Link and id are required!" });
  }

  const existingLink = await prisma.socialLink.findUnique({
    where: { id, isDeleted: false },
  });

  if (!existingLink) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "Social link not found!" });
  }

  const duplicateLink = await prisma.socialLink.findFirst({
    where: { link, userId: existingLink.userId, isDeleted: false },
  });

  if (duplicateLink && duplicateLink.id === id) {
    return res
      .status(statusCode.Conflict409)
      .json({ message: "Link already exists for this user!" });
  }

  const updatedLink = await prisma.socialLink.update({
    where: { id, isDeleted: false },
    data: {
      link,
    },
  });

  return res
    .status(statusCode.Ok200)
    .json({ message: "Social link updated!", updatedLink });
});

//~ Delete a social link

const deleteSocialLink = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existingLink = await prisma.socialLink.findUnique({
    where: { id, isDeleted: false },
  });

  if (!existingLink) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "Social link not found!" });
  }

  await prisma.socialLink.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });

  return res
    .status(statusCode.NoContent204)
    .json({ message: "Social link deleted!" });
});

export {
  createSocialLink,
  getSocialLinksByUserId,
  updateSocialLink,
  deleteSocialLink,
};
