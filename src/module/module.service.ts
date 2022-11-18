import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Modules } from "./entities/module.entity";
import { Role } from "../role/entities/role.entity";

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Modules)
    private moduleRepository: Repository<Modules>
  ) {}

  async create(module: DeepPartial<Modules>): Promise<Modules> {
    return await this.moduleRepository.save(module);
  }

  async findByName(name: string): Promise<Modules> {
    return await this.moduleRepository.findOne({ where: { name } });
  }

  async findByNameAndRole(name: string, role: number): Promise<Modules> {
    return await this.moduleRepository.findOne({
      where: { name, role: { id: role } },
    });
  }
}
