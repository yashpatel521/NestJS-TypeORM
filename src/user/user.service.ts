import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { message } from "../errorLogging/errorMessage";
import { CommonService } from "../common/common.service";
import { MailService } from "../mail/mail.service";
import { SERVER_URL, dataPerPage } from "../constants/constants";
import { mailContextType, rolesEnum } from "../constants/types";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly commonService: CommonService,
    private mailService: MailService
  ) {}

  async findAllUsers(
    search: string,
    pageNo: number
  ): Promise<{ allUser: User[]; allUserCount: number }> {
    const allUserCount = await this.usersRepository.count();
    const emailLower = search.toLocaleLowerCase();
    const allUser: User[] = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where("LOWER(user.email) like :email", {
        email: `%${emailLower}%`,
      })
      .take(dataPerPage)
      .skip(dataPerPage * (pageNo - 1))
      .getMany();

    return { allUser, allUserCount };
  }

  async create(user: DeepPartial<User>): Promise<User> {
    user.password = bcrypt.hashSync(user.password, 12);
    user.email = user.email.toLocaleLowerCase();
    return await this.save(user);
  }

  async save(userUpdate: DeepPartial<User>): Promise<User> {
    return await this.usersRepository.save(userUpdate);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where("LOWER(user.email) = LOWER(:email)", { email })
      .getOne();
  }

  async findByEmailOrThrow(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) throw new BadRequestException(message.emailExists);
    return user;
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findByIdOrThrow(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new BadRequestException(message.userNotFound);
    return user;
  }

  async delete(id: number) {
    await this.usersRepository.delete(id);
  }

  async fmcTokenCheck() {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.fcmToken != :fcmToken", { fcmToken: "" })
      .getOne();

    const body = {
      tokens: [user.fcmToken],
      notification: {
        title: "NestJs + TypeORM",
        body: "This is a boilerplate for NestJs and TypeORM that provides with basic example functionality.",
        imageUrl: "https://picsum.photos/200/300",
      },
      data: {
        url: "/user",
      },
    };

    return await this.commonService.sendMessage(body);
  }

  async mailCheck() {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .where("role.name = :role", { role: rolesEnum.user })
      .getOne();

    const context: mailContextType = {
      template: "confirmation",
      url: SERVER_URL,
      subject: "This is a confirmation",
    };
    return await this.mailService.sendUserConfirmation(user, context);
  }
}
