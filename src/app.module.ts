import { DataSource } from "typeorm";
import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import {
  ErrorsInterceptor,
  TransformInterceptor,
  LoggingInterceptor,
} from "./errorLogging/logging.interceptor";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "./constants/constants";
import { RoleModule } from "./role/role.module";
import { CommonModule } from "./common/common.module";
import { ModulesModule } from "./module/module.module";
import { RolesGuard } from "./auth/roles.guard";

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...config, autoLoadEntities: true }),
    CommonModule,
    ModulesModule,
    AuthModule,
    UserModule,
    RoleModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
