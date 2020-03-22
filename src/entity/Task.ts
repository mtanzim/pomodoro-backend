import { Column, Entity, Check, ManyToOne } from "typeorm";
import { AbstractTask } from "./AbstractTask";
import { Categories } from "./Categories";
import { User } from "./User";

@Entity()
export class Task extends AbstractTask {
  @Column("int")
  duration: number;

  @ManyToOne(
    type => Categories,
    category => category.tasks,
    { nullable: true, onDelete: "CASCADE", onUpdate: "RESTRICT" }
  )
  category: Categories;

  @ManyToOne(
    type => User,
    user => user.tasks,
    { nullable: false, onDelete: "CASCADE", onUpdate: "RESTRICT" }
  )
  user: User;
}
