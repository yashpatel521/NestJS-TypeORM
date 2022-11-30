import { subPermissionsType } from "../../constants/types";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { Permission } from "./permission.entity";

@Unique(["name", "permission"])
@Entity()
export class SubPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: subPermissionsType;

  @Column({ default: true })
  access: boolean;

  @ManyToOne(() => Permission, (permission) => permission.subPermission, {
    onDelete: "CASCADE",
  })
  permission: Permission;

  @CreateDateColumn()
  createdAt: Date;
}
