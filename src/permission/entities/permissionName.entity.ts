import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Permission } from "./permission.entity";

@Entity()
export class PermissionName {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Permission, (permission) => permission.permissionName)
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;
}
