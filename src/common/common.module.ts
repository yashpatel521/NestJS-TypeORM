import { Module } from "@nestjs/common";
import { ModulesModule } from "../module/module.module";
import { RoleModule } from "../role/role.module";
import { UserModule } from "../user/user.module";
import { CloudinaryProvider } from "./common.constants";
import { CommonController } from "./common.controller";

@Module({
  controllers: [CommonController],
  imports: [ModulesModule, UserModule, RoleModule],
  providers: [CloudinaryProvider],
  exports: [],
})
export class CommonModule {}
