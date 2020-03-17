import bcrypt from "bcrypt";
import { Length, IsEmail, IsOptional } from "class-validator";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { AbstractTimetamp } from "./AbstractTimestamp";
import { Categories } from "./Categories";
import { FaveTask } from "./FaveTask";
import { Task } from "./Task";

@Entity()
@Unique(["username"])
export class User extends AbstractTimetamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 500 })
  @Length(4, 50, { message: "Username length invalid." })
  username: string;

  @Column("varchar", { length: 500, nullable: true })
  name?: string;

  @Column("varchar", { length: 500, nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Column("varchar")
  @Length(4, 500, { message: "Password length invalid." })
  password: string;

  @OneToMany(
    type => Task,
    task => task.user
  )
  tasks: Task[];
  @OneToMany(
    type => FaveTask,
    faveTask => faveTask.user
  )
  faveTasks: FaveTask[];
  @OneToMany(
    type => Categories,
    categories => categories.user
  )
  categories: Categories[];

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
  }
}
