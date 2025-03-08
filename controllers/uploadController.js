import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

const uploadFiles = asyncHandler(async (req, res) => {
  const photoUrl = req.files.photo ? req.files.photo[0].location : null;
  const resumeUrl = req.files.resume ? req.files.resume[0].location : null;

  res.status(statusCode.Ok200).json({
    message: "Files uploaded successfully",
    "photo-url": photoUrl,
    "resume-url": resumeUrl,
  });
});

export { uploadFiles };
