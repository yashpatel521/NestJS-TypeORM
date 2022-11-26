import { Role } from "../../role/entities/role.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { Permission } from "./modulePermission.entity";
import { modulesType } from "../../constants/types";

@Unique(["name", "role"])
@Entity()
export class Modules {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: modulesType;

  @Column({ default: true })
  permission: boolean;

  @ManyToOne(() => Role, (role) => role.module, { onDelete: "CASCADE" })
  role: Role;

  @OneToMany(() => Permission, (permission) => permission.module)
  subPermission: Permission;

  @CreateDateColumn()
  createdAt: Date;
}
