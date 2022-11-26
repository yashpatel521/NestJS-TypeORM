import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Global, Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { join } from "path";
import { ConfigService } from "@nestjs/config";
import { mailConfig } from "../constants/constants";

@Global() // 👈 global module
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: mailConfig.host,
          secure: false,
          auth: {
            user: mailConfig.user,
            pass: mailConfig.password,
          },
        },
        defaults: {
          from: `"NestJs + TypeORM" <${mailConfig.from}>`,
        },
        template: {
          dir: join(__dirname, "templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
