import { Role } from "../../role/entities/role.entity";
import { PermissionName } from "./permissionName.entity";
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

@Unique(["permissionName", "role"])
@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  access: boolean;

  @ManyToOne(
    () => PermissionName,
    (permissionName) => permissionName.permissions,
    {
      eager: true,
      onDelete: "CASCADE",
    }
  )
  permissionName: PermissionName;

  @ManyToOne(() => Role, (role) => role.permission, { onDelete: "CASCADE" })
  role: Role;

  @OneToMany(() => SubPermission, (subPermission) => subPermission.permission)
  subPermission: SubPermission[];

  @CreateDateColumn()
  createdAt: Date;
}
