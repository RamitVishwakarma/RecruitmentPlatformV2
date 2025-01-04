import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
