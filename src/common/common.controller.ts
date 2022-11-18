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
import {
  DATABSE_URL,
  modules,
  Public,
  roles,
  rolesEnum,
} from "../constants/constants";
import { fileUploadEnum, multerOptions } from "./common.constants";
import { fileUploadDto } from "./dto/common.dto";
import { RoleService } from "../role/role.service";
import { ModuleService } from "../module/module.service";

@ApiTags("Common")
@Controller()
export class CommonController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly moduleService: ModuleService
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
    roles.forEach(async (name: string) => {
      let role = await this.roleService.findByName(name);
      if (!role) {
        role = await this.roleService.create({ name });
      }
      modules.forEach(async (name: string) => {
        const module = await this.moduleService.findByNameAndRole(
          name,
          role.id
        );
        if (!module) {
          await this.moduleService.create({
            name,
            role,
          });
        }
      });
    });

    let adminUser = {
      name: "Admin",
      email: "admin@admin.com",
      password: "Admin@1234",
      role: await this.roleService.findByName(rolesEnum.admin),
    };
    let customerUser = {
      name: "Customer",
      email: "customer@admin.com",
      password: "Customer@1234",
      role: await this.roleService.findByName(rolesEnum.customer),
    };

    let admin = await this.userService.findByEmail(adminUser.email);
    if (!admin) {
      admin = await this.userService.create(adminUser);
    }

    let customer = await this.userService.findByEmail(customerUser.email);
    if (!customer) {
      customer = await this.userService.create(customerUser);
    }

    return { admin, customer };
  }

  @Public()
  @UseInterceptors(FileInterceptor("file", multerOptions))
  @Post("fileUpload")
  async uploadFile(
    @Query() fileUpload: fileUploadDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    if (fileUpload.type === fileUploadEnum.user) {
      const user = await this.userService.findByIdOrThrow(+fileUpload.userId);
      user.profile = file.path;
      return await this.userService.save(user);
    } else {
      return { path: file.path };
    }
  }
}
