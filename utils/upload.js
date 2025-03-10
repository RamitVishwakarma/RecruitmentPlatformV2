import multer from "multer";
import { BlobServiceClient } from "@azure/storage-blob";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

// Azure SAS URL
const AZURE_SAS_URL = process.env.AZURE_SAS_URL;
const PHOTO_CONTAINER = process.env.AZURE_PHOTO_CONTAINER;
const RESUME_CONTAINER = process.env.AZURE_RESUME_CONTAINER;

// Allowed MIME types
const allowedMimeTypes = {
  photos: ["image/png", "image/jpg", "image/jpeg"],
  resumes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

// Multer in-memory storage
const storage = multer.memoryStorage();

// Multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isPhoto = allowedMimeTypes.photos.includes(file.mimetype);
    const isResume = allowedMimeTypes.resumes.includes(file.mimetype);

    if (isPhoto || isResume) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only photos and resumes are allowed."));
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
});

// Function to determine the container based on file type
function getContainerName(file) {
  if (allowedMimeTypes.photos.includes(file.mimetype)) {
    return PHOTO_CONTAINER;
  }
  if (allowedMimeTypes.resumes.includes(file.mimetype)) {
    return RESUME_CONTAINER;
  }
  throw new Error("Unsupported file type");
}

// Upload file to correct container
export async function uploadToAzure(file) {
  try {
    if (!file) throw new Error("No file provided");

    const containerName = getContainerName(file);
    const blobServiceClient = new BlobServiceClient(AZURE_SAS_URL);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = `${Date.now()}_${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const stream = Readable.from(file.buffer);

    // Setting content type for the file so that it can be displayed in the browser
    const options = {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    };

    await blockBlobClient.uploadStream(stream, file.size, undefined, options);

    return { fileUrl: blockBlobClient.url };
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw error;
  }
}

export default upload;
