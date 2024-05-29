import { User } from "../../user/entities/user.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Permission } from "src/permission/entities/permission.entity";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => Permission, (permission) => permission.role, {
    onDelete: "CASCADE",
  })
  permission: Permission[];

  @CreateDateColumn()
  createdAt: Date;
}
