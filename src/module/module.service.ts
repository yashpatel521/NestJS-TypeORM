import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Modules } from "./entities/module.entity";
import { RoleService } from "../role/role.service";
import { subPermissions, subPermissionsType } from "../constants/types";
import { Permission } from "./entities/permission.entity";
import { SubPermission } from "./entities/subPermission.entity";

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Modules)
    private moduleRepository: Repository<Modules>,

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    @InjectRepository(SubPermission)
    private subPermissionRepository: Repository<SubPermission>,

    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService
  ) {}

  async findAll(): Promise<Modules[]> {
    return await this.moduleRepository.find();
  }

  async findById(moduleId: number): Promise<Modules[]> {
    return await this.moduleRepository
      .createQueryBuilder("module")
      .leftJoinAndSelect("module.permissions", "permissions")
      .leftJoinAndSelect("permissions.role", "role")
      .leftJoinAndSelect("permissions.subPermission", "subpermissions")
      .where("module.id =:moduleId", { moduleId })
      .getMany();
  }

  async createModule(module: DeepPartial<Modules>): Promise<Modules> {
    module.name = module.name.toLocaleLowerCase();
    const roles = await this.roleService.findAll();
    const permissionTemp = [];

    for await (const role of roles) {
      const subPermissionTemp = [];
      for await (const constPermission of subPermissions) {
        subPermissionTemp.push(
          await this.createSubPermission({
            name: constPermission as subPermissionsType,
          })
        );
      }

      permissionTemp.push(
        await this.createPermission({ subPermission: subPermissionTemp, role })
      );
    }

    return this.moduleSave({
      name: module.name,
      permissions: permissionTemp,
    });
  }

  async moduleSave(modules: DeepPartial<Modules>) {
    return await this.moduleRepository.save(modules);
  }

  async findByName(name: string): Promise<Modules> {
    return await this.moduleRepository
      .createQueryBuilder("module")
      .where("LOWER(module.name) = LOWER(:name)", { name })
      .getOne();
  }

  async createPermission(
    permission: DeepPartial<Permission>
  ): Promise<Permission> {
    return await this.permissionRepository.save(permission);
  }

  async createSubPermission(
    subPermission: DeepPartial<SubPermission>
  ): Promise<SubPermission> {
    return await this.subPermissionRepository.save(subPermission);
  }

  async findByNameAndRole(
    moduleName: string,
    roleId: number
  ): Promise<Permission> {
    return this.permissionRepository
      .createQueryBuilder("permission")
      .leftJoin("permission.module", "module")
      .leftJoin("permission.role", "role")
      .where("module.name =:moduleName", { moduleName })
      .andWhere("role.id =:roleId", { roleId })
      .getOne();
  }

  async findSubPermissionByNameAndPermission(
    subPermissionName: string,
    permissionId: number
  ): Promise<SubPermission> {
    return this.subPermissionRepository
      .createQueryBuilder("subPermission")
      .leftJoin("subPermission.permission", "permission")
      .where("subPermission.name =:subPermissionName", { subPermissionName })
      .andWhere("permission.id =:permissionId", { permissionId })
      .getOne();
  }

  async findPermissionByRole(
    role: string,
    module: string,
    subPermission: subPermissionsType
  ) {
    let defaultPermission = false;
    const roleData = await this.roleService.findByNameOrThrow(role);
    const permissionData = await this.findByNameAndRole(module, roleData.id);

    if (permissionData && permissionData.access) {
      const subPermissionData = await this.findSubPermissionByNameAndPermission(
        subPermission,
        permissionData.id
      );
      if (subPermissionData && subPermissionData.access) {
        defaultPermission = true;
      }
    }

    return defaultPermission;
  }
}
