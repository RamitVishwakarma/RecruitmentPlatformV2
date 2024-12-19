import prisma from "../utils/prisma.js";

//~ Create a user
const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    admissionNumber,
    domain,
    year,
    photo,
    resume,
    aptitudeScore,
    aptitudeDetails,
    socialLinks,
  } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists! 🧐" });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        admissionNumber: admissionNumber ?? null,
        domain: domain ?? null,
        year: year ?? null,
        photo: photo ?? null,
        resume: resume ?? null,
        aptitudeScore: aptitudeScore ?? null,
        socialLinks: {
          create: socialLinks,
        },
        aptitude: {
          create: aptitudeDetails,
        },
      },
      include: {
        socialLinks: true,
        aptitude: true,
      },
    });

    res.status(201).json({ message: "User created! 🥳", user });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal Server Error! 🥲" });
  }
};

//~ Get all users
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        socialLinks: true,
        aptitude: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! 🥲" });
  }
};

//~ get user by Id
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = prisma.user.findUnique({
      where: { id },
      include: { socialLinks: true, aptitude: true },
    });

    if (!user) {
      res.status(404).json({ msg: "User not found! 😞" });
    }

    res.status(200).json({ "Fetched user 😃": user });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error! 🥲" });
  }
};

//~ Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    email,
    password,
    admissionNumber,
    domain,
    year,
    photo,
    resume,
    aptitudeScore,
    aptitudeDetails,
    socialLinks,
  } = req.body;

  if (!name && !email && !domain && !year && !photo && !resume) {
    return res.status(400).json({ message: "No fields provided! 🤔" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found 😥" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(password && { password }),
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

    res.status(200).json({ message: "User updated!", user });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "Email or admission number already in use" });
    }

    res.status(500).json({ message: "Internal server error! 🥲" });
  }
};

//~ Delete user by id
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "User ID is required! 😳" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return res.status(404).json({ msg: "User not found! 🥲" });
    }

    const user = await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({ msg: "User updated! 👶", user });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error! 🥲" });
  }
};

export { createUser, getUsers, getUserById, updateUser, deleteUser };
