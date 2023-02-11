import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { Permission } from "./permission.entity";
import { SubPermissionName } from "./subPermissionName.entity";

@Unique(["subPermissionName", "permission"])
@Entity()
export class SubPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  access: boolean;

  @ManyToOne(() => Permission, (permission) => permission.subPermission, {
    onDelete: "CASCADE",
  })
  permission: Permission;

  @ManyToOne(
    () => SubPermissionName,
    (subPermissionName) => subPermissionName.subPermission,
    {
      eager: true,
      onDelete: "CASCADE",
    }
  )
  subPermissionName: SubPermissionName;

  @CreateDateColumn()
  createdAt: Date;
}
