import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { Modules } from "./module.entity";

@Unique(["name", "module"])
@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  permission: boolean;

  @ManyToOne(() => Modules, (module) => module.subPermission, {
    onDelete: "CASCADE",
  })
  module: Modules;

  @CreateDateColumn()
  createdAt: Date;
}
