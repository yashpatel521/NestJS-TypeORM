import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Modules } from "./entities/module.entity";
import { Permission } from "./entities/modulePermission.entity";
import { RoleService } from "../role/role.service";

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Modules)
    private moduleRepository: Repository<Modules>,

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    private readonly roleService: RoleService
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

  async findPermissionByRole(role: string, module: string, permission: string) {
    let defaultPermission = false;
    const roleData = await this.roleService.findByNameOrThrow(role);
    const moduleData = await this.findByNameAndRole(module, roleData.id);
    if (moduleData.permission) {
      const permissionData = await this.findPermissionByNameAndModule(
        permission,
        moduleData.id
      );
      if (permissionData.permission) {
        defaultPermission = true;
      }
    }

    return defaultPermission;
  }
}
