import { BadRequestException } from "@nestjs/common";
import * as dotenv from "dotenv";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuid } from "uuid";
import { message } from "../errorLogging/errorMessage";

dotenv.config();
const ENV = process.env;

export const fileUpload = ["user"];
export type fileUploadType = "user";
export enum fileUploadEnum {
  user = "user",
}

// Multer upload options
export const multerOptions = {
  // Enable file size limits MAX_FILE_SIZE(MB)
  limits: {
    fileSize: +ENV.MAX_FILE_SIZE * 1024 * 1024,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new BadRequestException(
          `Unsupported file type ${extname(file.originalname)}`
        ),
        false
      );
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const { type } = req.query as { type: string };
      console.log(type);

      let uploadPath = ENV.FILE_UPLOAD_LOCATION;
      // Create folder if doesn't exist
      if (!existsSync(ENV.FILE_UPLOAD_LOCATION)) {
        mkdirSync(ENV.FILE_UPLOAD_LOCATION);
      }

      if (type) {
        if (fileUpload.includes(type)) {
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          uploadPath = ENV.FILE_UPLOAD_LOCATION + "/" + type;
          cb(null, uploadPath);
        } else {
          cb(new BadRequestException(message.typeInValid), false);
        }
      } else {
        cb(null, uploadPath);
      }
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid()}${extname(file.originalname).toLocaleLowerCase()}`);
    },
  }),
};
