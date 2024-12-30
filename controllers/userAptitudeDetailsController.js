import prisma from "../utils/prisma.js";

const createUserAptitudeDetails = async (req, res) => {
  const { userId, aptitudeScore } = req.body;
  try {
    const newDetails = await prisma.userAptitudeDetails.create({
      data: { userId:userId, aptitudeScore:aptitudeScore },
    });
   
   return res.status(201).json({
      message: "User Aptitude Details created successfully",
      newDetails,
    });
  } catch (error) {
   return res.status(500).json({
      error: "Error creating user aptitude details",
      details: error.message,
    });
  }
};
const getUserAptitudeDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const details = await prisma.userAptitudeDetails.findUnique({
      where: { userId: (userId) },
    });
    if (!details) {
      return res.status(404).json({ error: "Details not found" });
    }
   return res.status(201).json({
      message: "User Aptitude Details obtained successfully",
      details,
    });
  } catch (error) {
   return res
      .status(500)
      .json({ error: "Error obtaining details", details: error.message });
  }
};
const updateUserAptitudeDetails = async (req, res) => {
  const { userId } = req.params;
  const { aptitudeScore } = req.body;
  try {
    const updatedDetails = await prisma.userAptitudeDetails.update({
      where: { userId: (userId) },
      data: { aptitudeScore },
    });
   return res.status(201).json({
      message: "User Aptitude Details updated successfully",
      updatedDetails,
    });
  } catch (error) {
   return res
      .status(500)
      .json({ error: "Error updating details", details: error.message });
  }
};
const deleteUserAptitudeDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    await prisma.userAptitudeDetails.delete({
      where: { userId:(userId) },
    });
   return res
      .status(201)
      .json({ message: "User Aptitude Details deleted successfully" });
  } catch (error) {
   return res.status(500).json({
      error: "Error deleting User Aptitude Deatils",
      message: error.message,
    });
  }
};
export {
  createUserAptitudeDetails,
  getUserAptitudeDetails,
  updateUserAptitudeDetails,
  deleteUserAptitudeDetails,
};
