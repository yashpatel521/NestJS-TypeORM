import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { RoleModule } from "../role/role.module";
import { CommonService } from "../common/common.service";

@Module({
  controllers: [UserController],
  imports: [RoleModule, TypeOrmModule.forFeature([User])],
  providers: [UserService, CommonService],
  exports: [UserService],
})
export class UserModule {}
