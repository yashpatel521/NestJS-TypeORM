import { forwardRef, Global, Module } from "@nestjs/common";
import { MailModule } from "../mail/mail.module";
import { ModulesModule } from "../module/module.module";
import { RoleModule } from "../role/role.module";
import { UserModule } from "../user/user.module";
import { CloudinaryProvider } from "./common.constants";
import { CommonController } from "./common.controller";
import { CommonService } from "./common.service";

@Global()
@Module({
  controllers: [CommonController],
  imports: [
    forwardRef(() => ModulesModule),
    UserModule,
    RoleModule,
    MailModule,
  ],
  providers: [CloudinaryProvider, CommonService],
  exports: [CommonService],
})
export class CommonModule {}
