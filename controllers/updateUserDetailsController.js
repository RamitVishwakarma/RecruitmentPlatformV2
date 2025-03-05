import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, year, admissionNumber, domain } = req.body;
  const userId = req.user.userId;

  let photoUrl = null;
  if (req.files?.photo?.length > 0) {
    photoUrl = req.files.photo[0].location;
  }

  let resumeUrl = null;
  if (req.files?.resume?.length > 0) {
    resumeUrl = req.files.resume[0].location;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "User not found" });
  }

  const parsedYear = year && year.trim() !== "" ? parseInt(year, 10) : null;
  if (year && isNaN(parsedYear)) {
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "Invalid year format. Must be an integer." });
  }

  const updateData = {};
  if (name?.trim()) updateData.name = name;
  if (parsedYear !== null) updateData.year = parsedYear;
  if (admissionNumber?.trim()) updateData.admissionNumber = admissionNumber;
  if (domain?.trim()) updateData.domain = domain;
  if (photoUrl) updateData.photo = photoUrl;
  if (resumeUrl) updateData.resume = resumeUrl;

  if (Object.keys(updateData).length === 0) {
    return res
      .status(statusCode.BadRequest400)
      .json({ message: "No valid fields provided for update." });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
  res
    .status(statusCode.Ok200)
    .json({ message: "Profile updated successfully", user: updatedUser });
});

export { updateUserProfile };
