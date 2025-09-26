import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = "tenant_uploads";
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedFormats.includes(file.mimetype)) {
      throw new Error("Unsupported file type");
    }

    return {
      folder,
      format: "jpg", // Automatically convert to JPG
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`
    };
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
