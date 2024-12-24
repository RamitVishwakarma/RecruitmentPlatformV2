import prisma from "../utils/prisma.js";

//~ Create Social Link
const createSocialLink = async (req, res) => {
  const { userId, name, link } = req.body;

  if (!userId || !name || !link) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const socialLink = await prisma.socialLink.create({
      data: {
        userId,
        name,
        link,
      },
    });

    res
      .status(201)
      .json({ message: "Social link created successfully", socialLink });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create social link", details: error.message });
  }
};

//~ Get Social Links by User ID
const getSocialLinksByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: { userId },
    });

    if (!socialLinks.length) {
      return res
        .status(404)
        .json({ error: "No social links found for this user" });
    }

    res.status(200).json({ socialLinks });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch social links", details: error.message });
  }
};

//~ Get Social Link by ID
const getSocialLinkById = async (req, res) => {
  const { id } = req.params;

  try {
    const socialLink = await prisma.socialLink.findUnique({
      where: { id },
    });

    if (!socialLink) {
      return res.status(404).json({ error: "Social link not found" });
    }

    res.status(200).json({ socialLink });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch social link", details: error.message });
  }
};

//~ Update Social Link
const updateSocialLink = async (req, res) => {
  const { id } = req.params;
  const { name, link } = req.body;

  try {
    const socialLink = await prisma.socialLink.update({
      where: { id },
      data: {
        name,
        link,
      },
    });

    res
      .status(200)
      .json({ message: "Social link updated successfully", socialLink });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update social link", details: error.message });
  }
};

//~ Delete Social Link
const deleteSocialLink = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.socialLink.delete({
      where: { id },
    });

    res.status(200).json({ message: "Social link deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete social link", details: error.message });
  }
};

export {
  createSocialLink,
  getSocialLinksByUserId,
  getSocialLinkById,
  updateSocialLink,
  deleteSocialLink,
};
