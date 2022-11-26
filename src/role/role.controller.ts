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
import { deleteSuccess, Roles } from "../constants/constants";
import { modulesEnum } from "../constants/types";

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
  @Roles(modulesEnum.role)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Roles(modulesEnum.role)
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
  @Roles(modulesEnum.role)
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
  @Roles(modulesEnum.role)
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
  @Roles(modulesEnum.role)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.roleService.remove(+id);
  }
}
