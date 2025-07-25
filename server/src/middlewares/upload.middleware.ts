import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { Multer } from "multer";

const storage = multer.memoryStorage();

type FileType = "mixed" | "image" | "video";

const fileFilter = (params: FileType) => {
  return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedExtensions: Record<FileType, RegExp> = {
      mixed: /jpeg|jpg|png|webp|mp4|mkv|avi|mov/,
      image: /jpeg|jpg|png|webp/,
      video: /mp4|mkv|avi|mov/,
    };

    const extRegex = allowedExtensions[params];
    if (!extRegex) {
      return cb(new Error("Invalid file type parameter"));
    }

    const extName = extRegex.test(file.originalname.toLowerCase());
    const mimeType = extRegex.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${params} files are allowed!`));
    }
  };
};

export function upload(params: FileType = "image", size?: number): Multer {
  return multer({
    storage,
    limits: { fileSize: size || 5 * 1024 * 1024 }, // default 5MB
    fileFilter: fileFilter(params),
  });
}
