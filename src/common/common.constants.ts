import * as dotenv from "dotenv";
import { v2 } from "cloudinary";
import { extname } from "path";
import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "fs";
import { v4 as uuid } from "uuid";

dotenv.config();
const ENV = process.env;
export const fileUploadServer = ENV.FILE_UPLOAD;
export const fileUploadLocation = ENV.FILE_UPLOAD_LOCATION;
export const fileUploadSize = +ENV.MAX_FILE_SIZE_IN_MB;
export const fileUpload = ["user", "others"];
export type fileUploadType = "user" | "others";
export enum fileUploadEnum {
  user = "user",
  others = "others",
}

export const CloudinaryProvider = {
  provide: "Cloudinary",
  useFactory: () => {
    return v2.config({
      cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
      api_key: ENV.CLOUDINARY_CLOUD_API_KEY,
      api_secret: ENV.CLOUDINARY_CLOUD_API_SECRET,
    });
  },
};

export const localStorage = diskStorage({
  // Destination storage path details
  destination: (req: any, file: any, cb: any) => {
    const { type } = req.query as { type: string };

    let uploadPath = ENV.FILE_UPLOAD_LOCATION;
    // Create folder if doesn't exist
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }
    uploadPath = uploadPath + "/" + type;
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  // File modification details
  filename: (req: any, file: any, cb: any) => {
    // Calling the callback passing the random name generated with the original extension name
    cb(null, `${uuid()}${extname(file.originalname).toLocaleLowerCase()}`);
  },
});
