import bcrypt from "bcrypt";
import { Length } from "class-validator";
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
  username: string;

  @Column("varchar", { length: 500, nullable: true })
  name: string;

  @Column("varchar", { length: 500, nullable: true })
  email: string;

  @Column("varchar")
  @Length(4, 500)
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
