import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

// check userId
const checkUserId = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return false;
  } else {
    return true;
  }
};

//~ Create or update social links
const createOrUpdateSocialLinks = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { socialLinks } = req.body; // array of { name, link }

  if (!Array.isArray(socialLinks) || socialLinks.length === 0 || !userId) {
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "Invalid input format" });
  }

  const userExists = await checkUserId(userId);
  if (!userExists) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "User not found!" });
  }

  const duplicateLinks = socialLinks.filter(
    (link, index) =>
      socialLinks.findIndex((l) => l.name === link.name) !== index,
  );

  if (duplicateLinks.length > 0) {
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "Duplicate social links not allowed" });
  }

  const upsertOperations = socialLinks.map(({ name, link }) =>
    prisma.socialLink.upsert({
      where: { userId_name: { userId, name } },
      update: { link, isDeleted: false },
      create: { name, link, userId },
    }),
  );

  const updatedLinks = await prisma.$transaction(upsertOperations);

  const allLinks = await prisma.socialLink.findMany({
    where: { userId, isDeleted: false },
  });

  return res.status(statusCode.Created201).json({
    message: "Social links updated successfully!",
    allLinks,
  });
});

//~ Get social links by userId

const getSocialLinksByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "userId is required" });
  }

  const userExists = await checkUserId(userId);
  if (!userExists) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "User not found" });
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

export { createOrUpdateSocialLinks, getSocialLinksByUserId, deleteSocialLink };
