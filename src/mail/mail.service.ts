import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable } from "@nestjs/common";
import { join } from "path";
import { User } from "../user/entities/user.entity";
import { isMailEnable } from "../constants/constants";
import { message } from "../errorLogging/errorMessage";
import { mailContextType } from "../constants/types";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, mailContextType: mailContextType) {
    if (isMailEnable) {
      return await this.mailerService.sendMail({
        to: user.email,
        subject: mailContextType.subject,
        template: join(
          __dirname,
          "..",
          "../mail/templates/" + mailContextType.template
        ),
        context: {
          name: user.name,
          url: mailContextType.url,
        },
      });
    } else {
      throw new BadRequestException(message.mailServiceNotEnable);
    }
  }
}
