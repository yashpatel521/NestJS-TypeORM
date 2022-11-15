import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "../user/user.service";
import { DATABSE_URL, Public } from "../constants/constants";
import { fileUploadEnum, multerOptions } from "./common.constants";
import { fileUploadDto } from "./dto/common.dto";
import { RoleService } from "../role/role.service";

@ApiTags("Common")
@Controller()
export class CommonController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService
  ) {}

  @Public()
  @Get()
  serverStatus() {
    return {
      server: "Server is running",
      database: DATABSE_URL,
    };
  }

  @Public()
  @Get("addAdminUser")
  async addAdminUser() {
    let adminRole = {
      name: "admin",
    };
    let role = await this.roleService.findByName(adminRole.name);
    if (!role) {
      role = await this.roleService.create(adminRole);
    }

    let adminUser = {
      name: "Admin",
      email: "admin@admin.com",
      password: "Admin@1234",
      role,
    };

    let user = await this.userService.findByEmail(adminUser.email);

    if (!user) {
      user = await this.userService.create(adminUser);
    }

    return user;
  }

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
