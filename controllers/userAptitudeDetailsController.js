import prisma from "../utils/prisma";
const createUserAptitudeDetails = async (req, res) => {
    const { userId, aptitudeScore } = req.body;
    try {
        const newDetails = await prisma.userAptitudeDetails.create({
            data: { userId, aptitudeScore },
        });
        res.status(201).json({message:"User Aptitude Details created successfully",newDetails});
    } catch (error) {
        res.status(500).json({ error: 'Error creating user aptitude details', details: error.message });
    }
};
const getUserAptitudeDetails = async (req, res) => {
    const { userId } = req.params;
    try {
        const details = await prisma.userAptitudeDetails.findUnique({
            where: { userId: parseInt(userId) },
        });
        if (!details) {
            return res.status(404).json({ error: 'Details not found' });
        }
        res.status(201).json({message:"User Aptitude Details obtained successfully",details});
    } catch (error) {
        res.status(500).json({ error: 'Error obtaining details', details: error.message });
    }
};
const updateUserAptitudeDetails = async (req, res) => {
    const { userId } = req.params;
    const { aptitudeScore } = req.body;
    try {
        const updatedDetails = await prisma.userAptitudeDetails.update({
            where: { userId: parseInt(userId) },
            data: { aptitudeScore },
        });
        res.status(201).json({message:"User Aptitude Details updated successfully",updatedDetails});
    } catch (error) {
        res.status(500).json({ error: 'Error updating details', details: error.message });
    }
};
const deleteUserAptitudeDetails = async (req, res) => {
    const { userId } = req.params;
    try {
        await prisma.userAptitudeDetails.delete({
            where: { userId: parseInt(userId)}
        });
        res.status(201).json({ message: 'User Aptitude Details deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting User Aptitude Deatils", message: error.message });
    }
}
export { createUserAptitudeDetails, getUserAptitudeDetails, updateUserAptitudeDetails, deleteUserAptitudeDetails }