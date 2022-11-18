import {
  Controller,
  Get,
  Post,
  BadRequestException,
  Param,
  Body,
  Patch,
  Delete,
} from "@nestjs/common";
import { message } from "../errorLogging/errorMessage";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { userCreate, userList } from "../ApiResponsExample/user";
import {
  deleteSuccess,
  modulesEnum,
  permissionsEnum,
  Public,
  Roles,
  rolesEnum,
} from "../constants/constants";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { RoleService } from "../role/role.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService
  ) {}

  @Public()
  @Roles(modulesEnum.user, permissionsEnum.post, [rolesEnum.admin])
  @Post()
  @ApiResponse({
    status: 200,
    schema: {
      example: userCreate,
    },
  })
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    const userExits = await this.userService.findByEmail(userData.email);
    if (userExits) {
      throw new BadRequestException(message.emailExists);
    }
    const role = await this.roleService.findByNameOrThrow(userData.role);
    return await this.userService.create({ ...userData, role });
  }

  @Public()
  @ApiResponse({
    status: 200,
    schema: {
      example: userList,
    },
  })
  @Get()
  async getAllUsers(): Promise<User[] | User> {
    return await this.userService.findAllUsers();
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: userCreate,
    },
  })
  @Roles(modulesEnum.user, permissionsEnum.patch, [
    rolesEnum.admin,
    rolesEnum.customer,
  ])
  @Get(":id")
  async getUserById(@Param("id") id: number): Promise<User[] | User> {
    return await this.userService.findById(+id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: userCreate,
    },
  })
  @Roles(modulesEnum.user, permissionsEnum.patch, [rolesEnum.admin])
  @Patch(":id")
  async updateUser(
    @Param("id") id: number,
    @Body() userData: UpdateUserDto
  ): Promise<User> {
    const user = await this.userService.findByIdOrThrow(id);

    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) {
      throw new BadRequestException(message.passwordInvalid);
    }

    if (userData.email) {
      const userExits = await this.userService.findByEmail(userData.email);
      if (userExits && userExits.id !== user.id) {
        throw new BadRequestException(message.emailExists);
      }
      user.email = userData.email;
    }

    return await this.userService.save(user);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: deleteSuccess,
    },
  })
  @Roles(modulesEnum.user, permissionsEnum.delete, [rolesEnum.admin])
  @Delete(":id")
  async deleteUser(@Param("id") id: number) {
    await this.userService.findByIdOrThrow(id);
    return await this.userService.delete(id);
  }
}
