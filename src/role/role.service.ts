import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { message } from "../errorLogging/errorMessage";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>
  ) {}

  async create(role: DeepPartial<Role>): Promise<Role> {
    return await this.rolesRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async findById(id: number): Promise<Role> {
    return await this.rolesRepository.findOneBy({ id });
  }

  async findByIdOrThrow(id: number): Promise<Role> {
    const role = await this.findById(id);
    if (!role) throw new BadRequestException(message.roleNotFound);
    return role;
  }

  async save(role: Role): Promise<Role> {
    return await this.rolesRepository.save(role);
  }

  async findByName(name: string): Promise<Role> {
    return await this.rolesRepository.findOne({ where: { name } });
  }

  async findByNameOrThrow(name: string): Promise<Role> {
    const role = await this.findByName(name);
    if (!role) throw new BadRequestException(message.roleNotFound);
    return role;
  }

  async remove(id: number) {
    await this.findById(id);
    return await this.rolesRepository.delete(id);
  }
}
