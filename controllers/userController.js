import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//~ Get all users

const getUsers = asyncHandler(async (req, res) => {
  const { skip, take, page, perPage } = req.pagination;

  const users = await prisma.user.findMany({
    where: { isDeleted: false },
    include: {
      socialLinks: true,
      aptitude: true,
    },
    skip,
    take,
  });
  const totalUsers = await prisma.user.count({ where: { isDeleted: false } });

  return res.status(200).json({
    data: users,
    meta: {
      page: page,
      total: totalUsers,
      pages: Math.ceil(totalUsers / perPage),
    },
  });
});

//~ get user by Id

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id, isDeleted: false },
    include: { socialLinks: true, aptitude: true },
  });

  if (!user) {
    return res.status(404).json({ msg: "User not found!" });
  }

  return res.status(200).json({ "Fetched user": user });
});

//~get users by domain

const getUsersByDomain = asyncHandler(async (req, res) => {
  const { domain } = req.query;
  const { skip, take, page, perPage } = req.pagination;

  if (!domain) {
    return res.status(400).json({ error: "Domain parameter is required." });
  }

  const users = await prisma.user.findMany({
    where: {
      domain,
      isDeleted: false,
    },
    include: {
      socialLinks: true,
      aptitude: true,
    },
    skip,
    take,
  });
  const totalUsers = await prisma.user.count({
    where: { domain, isDeleted: false },
  });

  if (users.length === 0) {
    return res
      .status(404)
      .json({ error: `No users found in the ${domain} domain.` });
  }

  return res.status(200).json({
    data: users,
    meta: {
      page: page,
      total: totalUsers,
      pages: Math.ceil(totalUsers / perPage),
    },
  });
});

//~ Update a user

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    name,
    email,
    admissionNumber,
    domain,
    year,
    photo,
    resume,
    aptitudeScore,
    aptitudeDetails,
    socialLinks,
  } = req.body;

  if (
    !name &&
    !email &&
    !domain &&
    !year &&
    !photo &&
    !resume &&
    !admissionNumber
  ) {
    return res.status(400).json({ message: "No fields provided!" });
  }

  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(admissionNumber && { admissionNumber }),
      ...(domain && { domain }),
      ...(year && { year }),
      ...(photo && { photo }),
      ...(resume && { resume }),
      ...(aptitudeScore && { aptitudeScore }),
      socialLinks: socialLinks
        ? {
            create: socialLinks,
          }
        : undefined,
      aptitude: aptitudeDetails
        ? {
            upsert: {
              create: aptitudeDetails,
              update: aptitudeDetails,
            },
          }
        : undefined,
    },
  });

  return res.status(200).json({ message: "User updated!", user });
});

//~ Delete user by id

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "User ID is required!" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { id, isDeleted: false },
  });

  if (!existingUser) {
    return res.status(404).json({ msg: "User not found!" });
  }

  const deletedUser = await prisma.user.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });

  return res.status(200).json({ msg: "User deleted!", deletedUser });
});

const checkUserShortlistStatus = asyncHandler(async (req, res, next) => {
  const { skip, take, page, perPage } = req.pagination;
  const users = await prisma.user.findMany({
    where: { isDeleted: false },
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

  return res.status(200).json({
    data: userData,
    meta: {
      page: page,
      total: totalUsers,
      pages: Math.ceil(totalUsers / perPage),
    },
  });
});

export {
  getUsers,
  getUserById,
  getUsersByDomain,
  updateUser,
  deleteUser,
  checkUserShortlistStatus,
};
