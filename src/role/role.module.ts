import { forwardRef, Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { PemissionModule } from "src/permission/permission.module";

@Module({
  controllers: [RoleController],
  imports: [
    TypeOrmModule.forFeature([Role]),
    forwardRef(() => PemissionModule),
  ],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
