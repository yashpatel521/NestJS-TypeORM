import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { message } from "../errorLogging/errorMessage";
import { SERVER_URL } from "../constants/constants";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findAllUsers(): Promise<User[]> {
    let users = await this.usersRepository.find();
    users = users.map((user) => {
      return {
        ...user,
        profile: user.profile ? SERVER_URL + user.profile : null,
      };
    });
    return users;
  }

  async create(user: DeepPartial<User>): Promise<User> {
    user.password = bcrypt.hashSync(user.password, 12);
    return await this.usersRepository.save(user);
  }

  async save(userUpdate: User): Promise<User> {
    let user = await this.usersRepository.save(userUpdate);
    user.profile = user.profile ? SERVER_URL + user.profile : null;
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { email } });
    if (user) user.profile = user.profile ? SERVER_URL + user.profile : null;
    return user;
  }

  async findByEmailOrThrow(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) throw new BadRequestException(message.emailExists);
    return user;
  }

  async findById(id: number): Promise<User> {
    let user = await this.usersRepository.findOneBy({ id });
    if (user) user.profile = user.profile ? SERVER_URL + user.profile : null;
    return user;
  }

  async findByIdOrThrow(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new BadRequestException(message.userNotFound);
    return user;
  }

  async delete(id: number) {
    await this.usersRepository.delete(id);
  }
}
