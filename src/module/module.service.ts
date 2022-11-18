import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Modules } from "./entities/module.entity";
import { Permission } from "./entities/modulePermission.entity";

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Modules)
    private moduleRepository: Repository<Modules>,

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>
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

  async createPermission(
    permission: DeepPartial<Permission>
  ): Promise<Permission> {
    return await this.permissionRepository.save(permission);
  }

  async findPermissionByNameAndModule(
    name: string,
    module: number
  ): Promise<Permission> {
    return await this.permissionRepository.findOne({
      where: { name, module: { id: module } },
    });
  }
}
