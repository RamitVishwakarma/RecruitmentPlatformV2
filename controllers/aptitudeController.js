import prisma from "../utils/prisma.js";

const createAptitude = async (req, res) => {
    const { title, shortDescription, longDescription, questions, domain, year, duration } = req.body;
    if (!title || !shortDescription || !domain || !year || !duration) {
        res.status(500).json({ error: "All Fields are required" })
    }
    try {
        const aptitude = await prisma.aptitude.create({
            data: {
                aptitudeTitle: title,
                aptitudeShortDesc: shortDescription,
                aptitudeLongDesc: longDescription ?? null,
                aptitudeDomain: domain,
                aptitudeYear: year,
                aptitudeDuration: duration,
                aptitudeQuestions: {
                    create: questions,
                },
            },
            include: {
                aptitudeQuestions: true,
            },
        });

        res.status(201).json({ message: 'Aptitude created successfully', aptitude });
    } catch (error) {
        res.status(500).json({ message: "Aptitude creation failed", error: error.message });
    }
};


const getAllAptitudes = async (req, res) => {
    try {
        const aptitudes = await prisma.aptitude.findMany();
        res.status(201).json(aptitudes);
    } catch (error) {
        res.status(500).json({ error: "Could not get all aptitudes" });
    }
};

const getAptitudesById = async (req, res) => {
    const { id } = req.params;

    try {
        const aptitude = await prisma.aptitude.findUnique({
            where: { id: (id) },
            include: { aptitudeQuestions: true },
        });

        if (!aptitude) {
            return res.status(404).json({ error: "Aptitude not found" });
        }

        res.status(201).json(aptitude);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch aptitude", details: error.message });
    }
};

const updateAptitude = async (req, res) => {
    const { id } = req.params;
    const { title, shortDescription, longDescription, domain, year, duration } = req.body;

    try {
        const updatedAptitude = await prisma.aptitude.update({
            where: { id: (id) },
            data: {
                aptitudeTitle: title,
                aptitudeShortDesc: shortDescription,
                aptitudeLongDesc: longDescription ?? null,
                aptitudeDomain: domain,
                aptitudeYear: year,
                aptitudeDuration: duration,
            }
        });
        res.status(201).json({ message: 'Aptitude updated successfully', updatedAptitude });
    } catch (error) {
        res.status(500).json({ message: "Failed to update Aptitude",error:error.message });
    }
};

const deleteAptitude = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.aptitude.delete({
            where: { id: (id) }
        });
        res.status(201).json({ message: 'Aptitude deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Aptitude" });
    }
};
export { createAptitude, getAptitudesById, getAllAptitudes, updateAptitude, deleteAptitude }