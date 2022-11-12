import { UserModule } from 'src/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from 'src/app.module';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.register({}),
    forwardRef(() => AppModule),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
