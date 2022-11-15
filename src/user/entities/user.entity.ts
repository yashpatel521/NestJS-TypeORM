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

  @Column({ nullable: true })
  profile: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
