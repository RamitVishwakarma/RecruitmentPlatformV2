import multer from "multer";
import dotenv from "dotenv";
import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";

dotenv.config();

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const bucketName = process.env.S3_BUCKET_NAME;

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
  limits: { fileSize: 1024 * 1024 * 3 }, // 3 MB
});

// Upload file to correct container
export async function uploadToS3(file, type) {
  if (!file) throw new Error("No file provided");

  let folder = "";
  if (type === "photo") folder = "photo/";
  else if (type === "resume") folder = "resume/";
  else throw new Error("Invalid upload type");

  const key = `${folder}${Date.now()}_${file.originalname}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const uploadResult = await new Upload({
    client: s3,
    params,
  }).done();
  const fileUrl = uploadResult.Location;

  return { fileUrl };
}

export default upload;
