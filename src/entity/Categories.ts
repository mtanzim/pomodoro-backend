import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
  ManyToOne
} from "typeorm";
import { AbstractTimetamp } from "./AbstractTimestamp";
import { Task } from "./Task";
import { FaveTask } from "./FaveTask";
import { User } from "./User";

@Entity()
@Unique(["name"])
export class Categories extends AbstractTimetamp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => User,
    user => user.tasks,
    { nullable: false, onDelete: "CASCADE", onUpdate: "RESTRICT" }
  )
  user: User;

  @Column("varchar", { length: 50 })
  name: string;

  @OneToMany(
    type => Task,
    task => task.category
  )
  tasks: Task[];
  @OneToMany(
    type => FaveTask,
    faveTask => faveTask.category
  )
  faveTasks: FaveTask[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
