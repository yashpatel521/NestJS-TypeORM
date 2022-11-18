import { Module } from "@nestjs/common";
import { ModulesModule } from "../module/module.module";
import { RoleModule } from "../role/role.module";
import { UserModule } from "../user/user.module";
import { CommonController } from "./common.controller";

@Module({
  controllers: [CommonController],
  imports: [ModulesModule, UserModule, RoleModule],
  providers: [],
  exports: [],
})
export class CommonModule {}
