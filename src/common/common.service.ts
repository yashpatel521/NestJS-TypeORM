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
import { fileUpload, fileUploadSize, fileUploadType } from "./common.constants";
import { FileInterceptor, MulterModuleOptions } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { MULTER_MODULE_OPTIONS } from "@nestjs/platform-express/multer/files.constants";
import * as multer from "multer";
import { Request } from "express";
import { message } from "src/errorLogging/errorMessage";

export const MyNewFileInterceptor = (
  fieldName: string,
  localOptions?: (context: ExecutionContext) => MulterOptions
) => {
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

      this.multer = (multer as any)({
        ...this.moduleOptions,
        // Enable file size limits MAX_FILE_SIZE_IN_MB
        limits: {
          fileSize: +fileUploadSize * 1024 * 1024,
        },
        // Check the mimetypes to allow for upload
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
        ...localOptions(context),
      });
      return super.intercept(context, next);
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
};
