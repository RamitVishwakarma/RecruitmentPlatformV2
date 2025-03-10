import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";
import { uploadToAzure } from "../utils/upload.js";

const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(statusCode.BadRequest400).json({
      message: "No photo file uploaded",
    });
  }

  const uploadResult = await uploadToAzure(req.file); // Upload photo to Azure

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

  const uploadResult = await uploadToAzure(req.file); // Upload resume to Azure

  res.status(statusCode.Ok200).json({
    message: "Resume uploaded successfully",
    url: uploadResult.fileUrl,
  });
});

export { uploadPhoto, uploadResume };
