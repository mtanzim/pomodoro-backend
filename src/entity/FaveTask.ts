import { Entity, ManyToOne } from "typeorm";
import { AbstractTask } from "./AbstractTask";
import { Categories } from "./Categories";
import { User } from "./User";

@Entity()
export class FaveTask extends AbstractTask {
  @ManyToOne(
    type => Categories,
    category => category.faveTasks,
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
