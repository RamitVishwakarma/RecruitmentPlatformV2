import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";
import { sendInterviewEmail } from "../utils/sendMailerEmail.js";

//~ get user by Id

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id, isDeleted: false },
    include: { socialLinks: true, answer: { include: { question: true } } },
  });

  if (!user) {
    return res.status(statusCode.NotFount404).json({ msg: "User not found!" });
  }

  return res.status(statusCode.Ok200).json({ "Fetched user": user });
});

//~get users by domain

const getUsersByDomain = asyncHandler(async (req, res) => {
  const {
    domain,
    year,
    shortlistedStatus,
    interviewedStatus,
    projectStatus,
    aptitudeStatus,
  } = req.query;

  const { skip, take, page, perPage } = req.pagination;

  // if (!domain) {
  //   return res
  //     .status(statusCode.NotFount404)
  //     .json({ error: "Domain parameter is required." });
  // }

  const filters = {
    isDeleted: false,
    isAdmin: false,
    ...(domain && { domain }),
    ...(year && { year: parseInt(year, 10) }),
    ...(shortlistedStatus && {
      shortlistStatus: shortlistedStatus === "true",
    }),
    ...(interviewedStatus && {
      interviewStatus: interviewedStatus === "true",
    }),
    ...(projectStatus && { projectStatus: projectStatus === "true" }),
    ...(aptitudeStatus && { aptitudeStatus: aptitudeStatus === "true" }),
  };

  const users = await prisma.user.findMany({
    where: filters,
    include: {
      socialLinks: true,
    },
    skip,
    take,
  });
  const totalUsers = await prisma.user.count({
    where: { domain, isDeleted: false },
  });

  if (users.length === 0) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "No users found with specific filters" });
  }

  return res.status(statusCode.Ok200).json({
    data: users,
    meta: {
      page: page,
      total: totalUsers,
      pages: Math.ceil(totalUsers / perPage),
    },
  });
});

const checkUserShortlistStatus = asyncHandler(async (req, res, next) => {
  const { skip, take, page, perPage } = req.pagination;
  const users = await prisma.user.findMany({
    where: { isDeleted: false, isAdmin: false },
    skip,
    take,
    select: {
      id: true,
      name: true,
      email: true,
      shortlistStatus: true,
    },
  });

  const userData = users.map((user) => ({
    user_id: user.id,
    user_name: user.name,
    user_email: user.email,
    shortlist_status: user.shortlistStatus,
  }));

  const totalUsers = await prisma.user.count({ where: { isDeleted: false } });

  return res.status(statusCode.Ok200).json({
    data: userData,
    meta: {
      page: page,
      total: totalUsers,
      pages: Math.ceil(totalUsers / perPage),
    },
  });
});

const updateUserShortlistStatus = asyncHandler(async (req, res, next) => {
  const { userId, shortlisted } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "User not found!" });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { shortlistStatus: shortlisted === "true" },
  });

  // await sendTaskShortlistEmail(user.email, user.name);

  return res.status(statusCode.Ok200).json({
    message: "User shortlist status updated successfully",
    user: user,
  });
});

const updateUserInterviewStatus = asyncHandler(async (req, res, next) => {
  const { userId, interviewed } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "User not found!" });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { interviewStatus: interviewed === "true" },
  });

  await sendInterviewEmail(user.email, user.name);

  return res.status(statusCode.Ok200).json({
    message: "User interview status updated successfully",
    user: user,
  });
});

const updateUserProjectStatus = asyncHandler(async (req, res, next) => {
  const { userId, projectSubmitted } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "User not found!" });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { projectStatus: projectSubmitted === "true" },
  });

  return res.status(statusCode.Ok200).json({
    message: "User project status updated successfully",
    user: user,
  });
});

const updateUserAptitudeStatus = asyncHandler(async (req, res, next) => {
  const { userId, quizSubmitted } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    return res
      .status(statusCode.NotFount404)
      .json({ message: "User not found!" });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { aptitudeStatus: quizSubmitted === "true" },
  });

  return res.status(statusCode.Ok200).json({
    message: "User aptitude status updated successfully",
    user: user,
  });
});

export {
  getUserById,
  getUsersByDomain,
  checkUserShortlistStatus,
  updateUserShortlistStatus,
  updateUserInterviewStatus,
  updateUserProjectStatus,
  updateUserAptitudeStatus,
};
