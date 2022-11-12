import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { TOKEN_SECRET, TOKEN_EXPIRE } from '../constants/constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, passwordTemp: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(passwordTemp, user.password);
    if (!isMatch) {
      return null;
    }
    const { password, ...result } = user;
    return result;
  }

  async login(user: User) {
    const payload = { id: user.id };
    return {
      ...user,
      access_token: this.jwtService.sign(payload, {
        secret: TOKEN_SECRET,
        expiresIn: TOKEN_EXPIRE,
      }),
    };
  }
}
