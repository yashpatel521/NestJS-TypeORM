import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { RoleService } from "../role/role.service";
import { Permission } from "./entities/permission.entity";
import { SubPermission } from "./entities/subPermission.entity";
import { PermissionName } from "./entities/permissionName.entity";
import { SubPermissionName } from "./entities/subPermissionName.entity";

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionName)
    private moduleRepository: Repository<PermissionName>,

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    @InjectRepository(SubPermission)
    private subPermissionRepository: Repository<SubPermission>,

    @InjectRepository(SubPermissionName)
    private subPermissionNameRepository: Repository<SubPermissionName>,

    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService
  ) {}

  async findAll(): Promise<PermissionName[]> {
    return await this.moduleRepository.find();
  }

  async createSubPermissionName(name: string): Promise<SubPermissionName> {
    return await this.subPermissionNameRepository.save({ name });
  }

  async findAllSubpermissionName(): Promise<SubPermissionName[]> {
    return await this.subPermissionNameRepository.find();
  }

  async findBySubPermissionName(name: string): Promise<SubPermissionName> {
    return await this.subPermissionNameRepository
      .createQueryBuilder("subPermissionName")
      .where("LOWER(subPermissionName.name) = LOWER(:name)", { name })
      .getOne();
  }

  async findById(moduleId: number): Promise<PermissionName[]> {
    return await this.moduleRepository
      .createQueryBuilder("module")
      .leftJoinAndSelect("module.permissions", "permissions")
      .leftJoinAndSelect("permissions.role", "role")
      .leftJoinAndSelect("permissions.subPermission", "subpermissions")
      .where("module.id =:moduleId", { moduleId })
      .getMany();
  }

  async createPermissionName(
    permissionName: DeepPartial<PermissionName>
  ): Promise<PermissionName> {
    permissionName.name = permissionName.name.toLocaleLowerCase();
    const roles = await this.roleService.findAll();
    const permissionTemp = [];
    const subPermissions = await this.findAllSubpermissionName();

    for await (const role of roles) {
      const subPermissionTemp = [];
      for await (const subPermission of subPermissions) {
        subPermissionTemp.push(
          await this.createSubPermission({
            subPermissionName: subPermission,
          })
        );
      }

      permissionTemp.push(
        await this.createPermission({ subPermission: subPermissionTemp, role })
      );
    }

    return this.moduleSave({
      name: permissionName.name,
      permissions: permissionTemp,
    });
  }

  async moduleSave(modules: DeepPartial<PermissionName>) {
    return await this.moduleRepository.save(modules);
  }

  async findByPermissionName(name: string): Promise<PermissionName> {
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
      .leftJoin("permission.permissionName", "permissionName")
      .leftJoin("permission.role", "role")
      .where("permissionName.name =:moduleName", { moduleName })
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
      .leftJoin("subPermission.subPermissionName", "subPermissionName")
      .where("subPermissionName.name =:subPermissionName", {
        subPermissionName,
      })
      .andWhere("permission.id =:permissionId", { permissionId })
      .getOne();
  }

  async findPermissionByRole(
    role: string,
    module: string,
    subPermission: string
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
