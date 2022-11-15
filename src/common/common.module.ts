import { Module } from "@nestjs/common";
import { RoleModule } from "src/role/role.module";
import { UserModule } from "../user/user.module";
import { CommonController } from "./common.controller";

@Module({
  controllers: [CommonController],
  imports: [UserModule, RoleModule],
  providers: [],
  exports: [],
})
export class CommonModule {}
