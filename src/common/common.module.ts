import { forwardRef, Global, Module } from "@nestjs/common";
import { MailModule } from "../mail/mail.module";
import { PemissionModule } from "../permission/permission.module";
import { RoleModule } from "../role/role.module";
import { UserModule } from "../user/user.module";
import { CloudinaryProvider } from "./common.constants";
import { CommonController } from "./common.controller";
import { CommonService } from "./common.service";

@Global()
@Module({
  controllers: [CommonController],
  imports: [
    forwardRef(() => PemissionModule),
    UserModule,
    RoleModule,
    MailModule,
  ],
  providers: [CloudinaryProvider, CommonService],
  exports: [CommonService],
})
export class CommonModule {}
