import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { CommonController } from "./common.controller";

@Module({
  controllers: [CommonController],
  imports: [UserModule],
  providers: [],
  exports: [],
})
export class CommonModule {}
