import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleModule } from "../role/role.module";
import { Modules } from "./entities/module.entity";
import { Permission } from "./entities/modulePermission.entity";
import { ModuleService } from "./module.service";

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([Modules, Permission]), RoleModule],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModulesModule {}
