import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleModule } from "../role/role.module";
import { Permission } from "./entities/permission.entity";
import { SubPermission } from "./entities/subPermission.entity";
import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";
import { PermissionName } from "./entities/permissionName.entity";
import { SubPermissionName } from "./entities/subPermissionName.entity";

@Module({
  controllers: [PermissionController],
  imports: [
    TypeOrmModule.forFeature([
      PermissionName,
      Permission,
      SubPermissionName,
      SubPermission,
    ]),
    forwardRef(() => RoleModule),
  ],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PemissionModule {}
