import { Role } from "../../role/entities/role.entity";
import { Modules } from "./module.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { SubPermission } from "./subPermission.entity";

@Unique(["module", "role"])
@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  access: boolean;

  @ManyToOne(() => Modules, (module) => module.permissions, {
    eager: true,
    onDelete: "CASCADE",
  })
  module: Modules;

  @ManyToOne(() => Role, (role) => role.permission, { onDelete: "CASCADE" })
  role: Role;

  @OneToMany(() => SubPermission, (subPermission) => subPermission.permission)
  subPermission: SubPermission[];

  @CreateDateColumn()
  createdAt: Date;
}
