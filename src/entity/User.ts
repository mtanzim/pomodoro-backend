import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany
} from "typeorm";
import { AbstractTimetamp } from "./AbstractTimestamp";
import { Task } from "./Task";
import { FaveTask } from "./FaveTask";
import { Categories } from "./Categories";

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

  @Column("varchar", { length: 50000 })
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
}
