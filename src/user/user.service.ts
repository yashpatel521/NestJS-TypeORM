import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { message } from "../errorLogging/errorMessage";
import { CommonService } from "src/common/common.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly commonService: CommonService
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async create(user: DeepPartial<User>): Promise<User> {
    user.password = bcrypt.hashSync(user.password, 12);
    return await this.usersRepository.save(user);
  }

  async save(userUpdate: User): Promise<User> {
    return await this.usersRepository.save(userUpdate);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
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
}
