import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { Body } from "@nestjs/common/decorators";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { message } from "../errorLogging/errorMessage";
import { Roles } from "../constants/constants";
import { modulesEnum } from "../constants/types";
import { CreateModuleDto } from "./dto/create-module.dto";
import { PermissionName } from "./entities/permissionName.entity";
import { PermissionService } from "./permission.service";

@ApiTags("Module")
@Controller("module")
export class PermissionController {
  constructor(private readonly moduleService: PermissionService) {}

  @Get()
  @Roles(modulesEnum.permission)
  async AllModules(): Promise<PermissionName[]> {
    return await this.moduleService.findAll();
  }

  @Get(":id")
  @Roles(modulesEnum.permission)
  async getModuleById(@Param("id") id: number): Promise<PermissionName[]> {
    return await this.moduleService.findById(+id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(modulesEnum.permission)
  async createModule(
    @Body() moduleData: CreateModuleDto
  ): Promise<PermissionName> {
    const checkModuleName = await this.moduleService.findByPermissionName(
      moduleData.name
    );
    if (checkModuleName) {
      throw new BadRequestException(message.moduleAlreadyExists);
    }
    return await this.moduleService.createPermissionName(moduleData);
  }
}
