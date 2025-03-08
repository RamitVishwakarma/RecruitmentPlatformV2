import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "./s3.js";

const allowedMimeTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg, .jpeg, .pdf, .docx files are allowed"));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
});

export default upload;
