import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Permission } from "./permission.entity";

@Entity()
export class Modules {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Permission, (permission) => permission.module)
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;
}
