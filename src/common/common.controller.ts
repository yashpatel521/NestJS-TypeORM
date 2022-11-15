import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "../user/user.service";
import { Public } from "../constants/constants";
import { fileUploadEnum, multerOptions } from "./common.constants";
import { fileUploadDto } from "./dto/common.dto";

@ApiTags("Common")
@Controller()
export class CommonController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @UseInterceptors(FileInterceptor("file", multerOptions))
  @Post("fileUpload")
  async uploadFile(
    @Query() fileUpload: fileUploadDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    console.log(file);
    if (fileUpload.type === fileUploadEnum.user) {
      const user = await this.userService.findByIdOrThrow(+fileUpload.userId);
      user.profile = file.path;
      return await this.userService.save(user);
    } else {
      return { path: file.path };
    }
  }
}
