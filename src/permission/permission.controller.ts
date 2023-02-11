import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Patch,
} from "@nestjs/common";
import { Body } from "@nestjs/common/decorators";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { message } from "../errorLogging/errorMessage";
import { Roles } from "../constants/constants";
import { modulesEnum } from "../constants/types";
import { CreatePermissionNamenDto } from "./dto/create-PemissionName.dto";
import { PermissionName } from "./entities/permissionName.entity";
import { PermissionService } from "./permission.service";
import { Permission } from "./entities/permission.entity";
import { SubPermissionName } from "./entities/subPermissionName.entity";
import { updatePermissionDto } from "./dto/update-Permission.dto";
import { access } from "fs";

@ApiTags("Permission")
@Controller("permission")
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @Roles(modulesEnum.permission)
  async AllPermissionNames(): Promise<PermissionName[]> {
    return await this.permissionService.findAllPermissionsName();
  }

  @Get("subPermission")
  @Roles(modulesEnum.permission)
  async AllSubPermissionNames(): Promise<SubPermissionName[]> {
    return await this.permissionService.findAllSubpermissionName();
  }

  @Get("subPermission/:id")
  @Roles(modulesEnum.permission)
  async getSubPermissionNameById(
    @Param("id") id: number
  ): Promise<SubPermissionName> {
    return await this.permissionService.findSubPermissionNameByIdOrThrow(+id);
  }

  @Get(":id")
  @Roles(modulesEnum.permission)
  async getPermissionNameById(
    @Param("id") id: number
  ): Promise<PermissionName> {
    return await this.permissionService.findPermissionNameByIdOrThrow(+id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(modulesEnum.permission)
  async createModule(
    @Body() permissionNameData: CreatePermissionNamenDto
  ): Promise<PermissionName> {
    const checkModuleName = await this.permissionService.findByPermissionName(
      permissionNameData.name
    );
    if (checkModuleName) {
      throw new BadRequestException(message.moduleAlreadyExists);
    }
    return await this.permissionService.createPermissionName(
      permissionNameData
    );
  }

  @Patch(":id")
  @ApiBearerAuth()
  @Roles(modulesEnum.permission)
  async updatePermission(
    @Body() permissionData: updatePermissionDto,
    @Param("id") id: number
  ) {
    return await this.permissionService.updatePermission(
      id,
      permissionData.access
    );
  }
}
