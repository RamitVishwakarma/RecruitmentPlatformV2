import prisma from "../utils/prisma.js";

//~ Create a social link
const createSocialLink = async (req, res) => {
  const { userId } = req.params;
  const { name, link } = req.body;

  if (!name || !link || !userId) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingLink = await prisma.socialLink.findFirst({
      where: { name, userId },
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

    res.status(201).json({ message: "Social link created!", socialLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

//~ Get social links by userId
const getSocialLinksByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required!" });
  }

  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: { userId, isDeleted: false },
    });

    if (!socialLinks.length) {
      return res.status(404).json({ message: "No social links found!" });
    }

    res.status(200).json(socialLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

//~ Update a social link
const updateSocialLink = async (req, res) => {
  const { id } = req.params;
  const { link } = req.body;

  if (!link || !id) {
    return res.status(400).json({ message: "Link and id are required!" });
  }

  try {
    const existingLink = await prisma.socialLink.findUnique({ where: { id } });

    if (!existingLink) {
      return res.status(404).json({ message: "Social link not found!" });
    }

    const duplicateLink = await prisma.socialLink.findFirst({
      where: { link, userId: existingLink.userId },
    });

    if (duplicateLink && duplicateLink.id !== id) {
      return res
        .status(400)
        .json({ message: "Link already exists for this user!" });
    }

    const updatedLink = await prisma.socialLink.update({
      where: { id },
      data: {
        link,
      },
    });

    res.status(200).json({ message: "Social link updated!", updatedLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

//~ Delete a social link
const deleteSocialLink = async (req, res) => {
  const { id } = req.params;

  try {
    const existingLink = await prisma.socialLink.findUnique({ where: { id } });

    if (!existingLink) {
      return res.status(404).json({ message: "Social link not found!" });
    }

    await prisma.socialLink.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({ message: "Social link deleted!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export {
  createSocialLink,
  getSocialLinksByUserId,
  updateSocialLink,
  deleteSocialLink,
};
