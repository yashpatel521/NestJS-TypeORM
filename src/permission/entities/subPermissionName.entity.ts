import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { SubPermission } from "./subPermission.entity";

@Entity()
export class SubPermissionName {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => SubPermission,
    (subPermission) => subPermission.subPermissionName
  )
  subPermission: SubPermission[];

  @CreateDateColumn()
  createdAt: Date;
}
