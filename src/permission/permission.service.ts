import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { RoleService } from "../role/role.service";
import { Permission } from "./entities/permission.entity";
import { SubPermission } from "./entities/subPermission.entity";
import { PermissionName } from "./entities/permissionName.entity";
import { SubPermissionName } from "./entities/subPermissionName.entity";
import { message } from "src/errorLogging/errorMessage";

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionName)
    private permissionNameRepository: Repository<PermissionName>,

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    @InjectRepository(SubPermission)
    private subPermissionRepository: Repository<SubPermission>,

    @InjectRepository(SubPermissionName)
    private subPermissionNameRepository: Repository<SubPermissionName>,

    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService
  ) {}

  async permissionNameSave(modules: DeepPartial<PermissionName>) {
    return await this.permissionNameRepository.save(modules);
  }

  async subPermissionNameSave(name: string): Promise<SubPermissionName> {
    return await this.subPermissionNameRepository.save({ name });
  }

  async permissionSave(
    permission: DeepPartial<Permission>
  ): Promise<Permission> {
    return await this.permissionRepository.save(permission);
  }

  async subPermissionSave(
    subPermission: DeepPartial<SubPermission>
  ): Promise<SubPermission> {
    return await this.subPermissionRepository.save(subPermission);
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
          await this.subPermissionSave({
            subPermissionName: subPermission,
          })
        );
      }

      permissionTemp.push(
        await this.permissionSave({ subPermission: subPermissionTemp, role })
      );
    }

    return this.permissionNameSave({
      name: permissionName.name,
      permissions: permissionTemp,
    });
  }

  async findAllPermissionsName(): Promise<PermissionName[]> {
    return await this.permissionNameRepository
      .createQueryBuilder("permission")
      .leftJoinAndSelect("permission.permissions", "permissions")
      .leftJoinAndSelect("permissions.role", "role")
      .leftJoinAndSelect("permissions.subPermission", "subpermissions")
      .leftJoinAndSelect(
        "subpermissions.subPermissionName",
        "subPermissionName"
      )
      .orderBy("permission.id")
      .addOrderBy("permissions.id")
      .addOrderBy("subPermissionName.name")
      .getMany();
  }

  async findPermissionNameById(permissionId: number): Promise<PermissionName> {
    return await this.permissionNameRepository
      .createQueryBuilder("permission")
      .leftJoinAndSelect("permission.permissions", "permissions")
      .leftJoinAndSelect("permissions.role", "role")
      .leftJoinAndSelect("permissions.subPermission", "subpermissions")
      .where("permission.id =:permissionId", { permissionId })
      .getOne();
  }

  async findPermissionNameByIdOrThrow(
    permissionId: number
  ): Promise<PermissionName> {
    const permission = await this.findPermissionNameById(permissionId);
    if (!permission) {
      throw new BadRequestException(message.permissionNotFound);
    }
    return permission;
  }

  async findByPermissionName(name: string): Promise<PermissionName> {
    return await this.permissionNameRepository
      .createQueryBuilder("module")
      .where("LOWER(module.name) = LOWER(:name)", { name })
      .getOne();
  }

  async findAllSubpermissionName(): Promise<SubPermissionName[]> {
    return await this.subPermissionNameRepository
      .createQueryBuilder("subPermissionName")
      .leftJoinAndSelect("subPermissionName.subPermission", "subPermission")
      .leftJoinAndSelect("subPermission.permission", "permission")
      .leftJoinAndSelect("permission.role", "role")
      .leftJoinAndSelect("permission.permissionName", "permissionName")
      .getMany();
  }

  async findBySubPermissionName(name: string): Promise<SubPermissionName> {
    return await this.subPermissionNameRepository
      .createQueryBuilder("subPermissionName")
      .where("LOWER(subPermissionName.name) = LOWER(:name)", { name })
      .getOne();
  }

  async findSubPermissionNameById(
    subPermissionId: number
  ): Promise<SubPermissionName> {
    return await this.subPermissionNameRepository
      .createQueryBuilder("subPermissionName")
      .leftJoinAndSelect("subPermissionName.subPermission", "subPermission")
      .leftJoinAndSelect("subPermission.permission", "permission")
      .leftJoinAndSelect("permission.role", "role")
      .leftJoinAndSelect("permission.permissionName", "permissionName")
      .where("subPermissionName.id = :subPermissionId", { subPermissionId })
      .getOne();
  }

  async findSubPermissionNameByIdOrThrow(
    subPermissionId: number
  ): Promise<SubPermissionName> {
    const permission = await this.findSubPermissionNameById(subPermissionId);
    if (!permission) {
      throw new BadRequestException(message.subPermissionNotFound);
    }
    return permission;
  }

  async findPermissionNameByAndRole(
    permissionName: string,
    roleId: number
  ): Promise<Permission> {
    return this.permissionRepository
      .createQueryBuilder("permission")
      .leftJoin("permission.permissionName", "permissionName")
      .leftJoin("permission.role", "role")
      .where("LOWER(permissionName.name) = LOWER(:permissionName)", {
        permissionName,
      })
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
      .where("LOWER(subPermissionName.name) = LOWER(:subPermissionName)", {
        subPermissionName,
      })
      .andWhere("permission.id =:permissionId", { permissionId })
      .getOne();
  }

  async checkPermissionByRole(
    role: string,
    module: string,
    subPermission: string
  ) {
    let defaultPermission = false;
    const roleData = await this.roleService.findByNameOrThrow(role);
    const permissionData = await this.findPermissionNameByAndRole(
      module,
      roleData.id
    );

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

  async findPermissionByIdOrThorw(permissionId: number) {
    const permission = await this.permissionRepository.findOneBy({
      id: permissionId,
    });
    if (!permission) {
      throw new BadRequestException(message.permissionNotFound);
    }
    return permission;
  }

  async updatePermission(permissionId: number, access: boolean) {
    const permission = await this.findPermissionByIdOrThorw(permissionId);
    permission.access = access;
    await this.permissionSave(permission);
    return permission;
  }
}
