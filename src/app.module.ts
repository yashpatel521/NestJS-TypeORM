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
import { MailModule } from "./mail/mail.module";
import { ConfigModule } from "@nestjs/config";
import { EventsModule } from "./sockets/events.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    TypeOrmModule.forRoot({ ...config, autoLoadEntities: true }),
    CommonModule,
    ModulesModule,
    AuthModule,
    UserModule,
    RoleModule,
    MailModule,
    EventsModule,
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
