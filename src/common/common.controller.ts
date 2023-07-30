import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "../user/user.service";
import {
  modules,
  modulesType,
  subPermissions,
  roles,
  rolesEnum,
} from "../constants/types";
import { SERVER_URL, Public } from "../constants/constants";
import { fileUploadServer } from "./common.constants";
import { fileUploadDto } from "./dto/common.dto";
import { RoleService } from "../role/role.service";
import { PermissionService } from "../permission/permission.service";
import { MyNewFileInterceptor } from "./common.service";

@ApiTags("Common")
@Controller()
export class CommonController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService
  ) {}

  @Public()
  @Get()
  serverStatus() {
    return {
      server: "Server is running",
      database: "Database is running",
    };
  }

  @Public()
  @Get("addDefaultUsers")
  async addDefaultUsers() {
    // create deafult subPermissions
    for await (const subPermission of subPermissions) {
      const subPermissionNameExists =
        await this.permissionService.findBySubPermissionName(subPermission);
      if (!subPermissionNameExists)
        await this.permissionService.subPermissionNameSave(subPermission);
    }

    // create deafult modules permission
    for await (const permissionName of modules) {
      const permissionNameExists =
        await this.permissionService.findByPermissionName(permissionName);
      if (!permissionNameExists)
        await this.permissionService.createPermissionName({
          name: permissionName,
        });
    }

    // Create Roles
    for await (const name of roles) {
      let role = await this.roleService.findByName(name);
      if (!role) {
        role = await this.roleService.create({ name });
      }
    }

    const adminRole = await this.roleService.findByNameOrThrow(rolesEnum.admin);
    let adminUser = {
      name: "Admin",
      email: "admin@admin.com",
      password: "Admin@1234",
      role: adminRole,
    };
    const userRole = await this.roleService.findByNameOrThrow(rolesEnum.user);
    let userUser = {
      name: "User",
      email: "user@user.com",
      password: "User@1234",
      role: userRole,
    };

    let admin = await this.userService.findByEmail(adminUser.email);
    if (!admin) {
      admin = await this.userService.create(adminUser);
    }

    let user = await this.userService.findByEmail(userUser.email);
    if (!user) {
      user = await this.userService.create(userUser);
    }

    return { admin, user };
  }

  @Public()
  @UseInterceptors(MyNewFileInterceptor("file"))
  @Post("fileUpload")
  async uploadFile(
    @Query() fileUpload: fileUploadDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    if (fileUploadServer === "CLOUDINARY") {
      return { path: file.path, image: file.path };
    } else {
      return { path: file.path, image: SERVER_URL + file.path };
    }
  }
}
