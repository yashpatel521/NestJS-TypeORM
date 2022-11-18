import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { roleCreate, roleList } from "../ApiResponsExample/role";
import {
  deleteSuccess,
  modulesEnum,
  permissionsEnum,
  Roles,
  rolesEnum,
} from "../constants/constants";

@ApiTags("Role")
@Controller(modulesEnum.role)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: roleCreate,
    },
  })
  @Roles(modulesEnum.role, permissionsEnum.post, [rolesEnum.admin])
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Roles(modulesEnum.role, permissionsEnum.get, [rolesEnum.admin])
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: roleList,
    },
  })
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: roleCreate,
    },
  })
  @Roles(modulesEnum.role, permissionsEnum.get, [rolesEnum.admin])
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.roleService.findByIdOrThrow(+id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: roleCreate,
    },
  })
  @Roles(modulesEnum.role, permissionsEnum.patch, [rolesEnum.admin])
  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.roleService.findByIdOrThrow(id);

    if (updateRoleDto.name) {
      role.name = updateRoleDto.name;
    }

    return this.roleService.save(role);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: deleteSuccess,
    },
  })
  @Roles(modulesEnum.role, permissionsEnum.delete, [rolesEnum.admin])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.roleService.remove(+id);
  }
}
