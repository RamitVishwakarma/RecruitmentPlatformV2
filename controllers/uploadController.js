import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";
import prisma from "../utils/prisma.js";
import { uploadToS3 } from "../utils/upload.js";

const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(statusCode.BadRequest400).json({
      message: "No photo file uploaded",
    });
  }

  const uploadResult = await uploadToS3(req.file, "photo");

  res.status(statusCode.Ok200).json({
    message: "Photo uploaded successfully",
    url: uploadResult.fileUrl,
  });
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(statusCode.BadRequest400).json({
      message: "No resume file uploaded",
    });
  }

  const uploadResult = await uploadToS3(req.file, "resume");

  res.status(statusCode.Ok200).json({
    message: "Resume uploaded successfully",
    url: uploadResult.fileUrl,
  });
});

const submitTaskLink = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { taskLink } = req.body;

  if (!taskLink || !id) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "Task link and id is required" });
  }
  const updatedUser = await prisma.user.update({
    where: { id, isDeleted: false },
    data: { taskLink },
  });

  return res
    .status(statusCode.Ok200)
    .json({ message: "Task link submitted successfully" });
});

export { uploadPhoto, uploadResume, submitTaskLink };
