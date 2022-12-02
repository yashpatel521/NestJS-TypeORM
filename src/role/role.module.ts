import { forwardRef, Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { ModulesModule } from "src/module/module.module";

@Module({
  controllers: [RoleController],
  imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => ModulesModule)],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
