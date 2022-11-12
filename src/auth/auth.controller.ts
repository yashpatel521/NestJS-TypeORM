import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { login } from '../ApiResponsExample/user';
import { AuthService } from './auth.service';
import { Public } from '../constants/constants';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiResponse({
    status: 400,
    schema: {
      example: login,
    },
  })
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
