import { Role } from "../../role/entities/role.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: "public/user/default.png" })
  profile: string;

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
    onDelete: "CASCADE",
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
