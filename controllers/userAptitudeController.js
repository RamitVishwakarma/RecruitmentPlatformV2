import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

const getAptitudes = asyncHandler(async (req, res) => {
  const { aptitudeYear, aptitudeDomain } = req.query;

  const whereCondition = {
    isDeleted: false,
  };

  if (aptitudeYear) {
    whereCondition.aptitudeYear = parseInt(aptitudeYear);
  }

  if (aptitudeDomain) {
    whereCondition.aptitudeDomain = aptitudeDomain;
  }

  const aptitudes = await prisma.aptitude.findMany({
    where: whereCondition,
    include: {
      aptitudeQuestions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!aptitudes.length) {
    return res.status(statusCode.NotFount404).json({
      success: false,
      message: "No aptitudes found",
    });
  }

  return res.status(statusCode.Ok200).json({
    success: true,
    aptitudes,
  });
});

export { getAptitudes };
