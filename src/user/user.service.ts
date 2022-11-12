import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './dto/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAllUsers(): Promise<User[] | User> {
    return await this.usersRepository.find();
  }

  async create(user: User): Promise<User> {
    user.password = bcrypt.hashSync(user.password, 12);
    return await this.save(user);
  }

  async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }
}
