import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { message } from "../error/errorMessage";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async create(user: DeepPartial<User>): Promise<User> {
    user.password = bcrypt.hashSync(user.password, 12);
    return await this.usersRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
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
}
