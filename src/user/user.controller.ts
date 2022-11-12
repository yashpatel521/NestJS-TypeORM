import {
  Controller,
  Get,
  Post,
  BadRequestException,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { message } from '../error/errorMessage';
import { UserService } from './user.service';
import { ApiResponse } from '@nestjs/swagger';
import { userCreate, userList } from '../ApiResponsExample/user';
import { Public } from '../constants/constants';
import { User } from './dto/user.entity';
import { CreateUser, UpdateUser } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @ApiResponse({
    status: 200,
    schema: {
      example: userList,
    },
  })
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User[] | User> {
    return await this.userService.findById(+id);
  }

  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    schema: {
      example: userCreate,
    },
  })
  async createUser(@Body() userData: CreateUser): Promise<User> {
    const userExits = await this.userService.findByEmail(userData.email);
    if (userExits) {
      throw new BadRequestException(message.emailExists);
    }
    return await this.userService.create(userData);
  }

  @Patch()
  @ApiResponse({
    status: 200,
    schema: {
      example: userCreate,
    },
  })
  async udateUser(@Body() userData: UpdateUser): Promise<User> {
    console.log(userData.id);
    const user = await this.userService.findById(userData.id);

    if (!user) {
      throw new BadRequestException(message.userNotFound);
    }

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
}
