import { Role } from "../../role/entities/role.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  AfterLoad,
} from "typeorm";
import { SERVER_URL } from "../../constants/constants";

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
  fcmToken: string;

  @Column({ default: "public/default.png" })
  profile: string;

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
    onDelete: "CASCADE",
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @AfterLoad()
  afterLoad() {
    if (this.profile) {
      if (!this.isValidHttpUrl(this.profile)) {
        this.profile = SERVER_URL + this.profile;
      }
    } else {
      this.profile = null;
    }
  }
  isValidHttpUrl(string: string) {
    let url: any;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }
}
