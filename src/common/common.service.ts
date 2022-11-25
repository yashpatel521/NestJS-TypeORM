import {
  ExecutionContext,
  Optional,
  Inject,
  CallHandler,
  mixin,
  Type,
  NestInterceptor,
  BadRequestException,
} from "@nestjs/common";
import { extname } from "path";
import {
  fileUpload,
  fileUploadServer,
  fileUploadSize,
  fileUploadType,
} from "./common.constants";
import { FileInterceptor, MulterModuleOptions } from "@nestjs/platform-express";
import { MULTER_MODULE_OPTIONS } from "@nestjs/platform-express/multer/files.constants";
import * as multer from "multer";
import { Request } from "express";
import { message } from "../errorLogging/errorMessage";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 } from "cloudinary";
import firebaseAdmin, { messaging } from "firebase-admin";
import serviceAccount from "../../firbaseToken.json";
import { isFcmEnable } from "../constants/constants";

export const MyNewFileInterceptor = (fieldName: string) => {
  const FileInterceptorInstance = FileInterceptor(fieldName);

  class MixinInterceptor extends FileInterceptorInstance {
    protected multer: any;
    protected moduleOptions: {};

    constructor(
      @Optional()
      @Inject(MULTER_MODULE_OPTIONS)
      options: MulterModuleOptions = {}
    ) {
      super();
      this.moduleOptions = options;
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): any {
      const req = context.switchToHttp().getRequest() as Request;
      const { type } = req.query as { type: fileUploadType };
      if (!fileUpload.includes(type))
        throw new BadRequestException(message.typeInValid);

      let storage = {};
      if (fileUploadServer === "CLOUDINARY") {
        storage = new CloudinaryStorage({
          cloudinary: v2,
          params: {
            // @ts-ignore
            folder: type,
          },
        });
      } else if (fileUploadServer === "LOCAL") {
        storage = localStorage;
      }

      this.multer = (multer as any)({
        ...this.moduleOptions,
        limits: {
          fileSize: fileUploadSize * 1024 * 1024,
        },
        fileFilter: (req: any, file: any, cb: any) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
          } else {
            cb(
              new BadRequestException(
                `Unsupported file type ${extname(file.originalname)}`
              ),
              false
            );
          }
        },
        storage,
      });
      return super.intercept(context, next);
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
};

const firebase = isFcmEnable
  ? firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount as any),
    })
  : null;
export class CommonService {
  async sendMessage(body: messaging.MulticastMessage) {
    const messageTemp = await firebase.messaging().sendMulticast(body);
    return messageTemp;
  }
}
