import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Role } from "./entities/role.entity";
import { message } from "../errorLogging/errorMessage";
import { PermissionService } from "../permission/permission.service";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private readonly permissionService: PermissionService
  ) {}

  async create(role: DeepPartial<Role>): Promise<Role> {
    const allPermissionName =
      await this.permissionService.findAllPermissionsName();
    const allSubPermissionName =
      await this.permissionService.findAllSubpermissionName();
    const permissions = [];

    for await (const permissionName of allPermissionName) {
      const subPermissionTemp = [];
      for await (const subPermissionName of allSubPermissionName) {
        subPermissionTemp.push(
          await this.permissionService.subPermissionSave({
            subPermissionName,
          })
        );
      }
      permissions.push(
        await this.permissionService.permissionSave({
          subPermission: subPermissionTemp,
          permissionName,
        })
      );
    }

    return await this.save({
      name: role.name,
      permission: permissions,
    });
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

  async save(role: DeepPartial<Role>): Promise<Role> {
    role.name = role.name.toLocaleLowerCase();
    return await this.rolesRepository.save(role);
  }

  async findByName(name: string): Promise<Role> {
    return await this.rolesRepository
      .createQueryBuilder("role")
      .where("LOWER(role.name) = LOWER(:name)", { name })
      .getOne();
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
