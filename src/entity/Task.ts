import { Column, Entity, Check, ManyToOne } from "typeorm";
import { AbstractTask } from "./AbstractTask";
import { Categories } from "./Categories";
import { User } from "./User";

@Entity()
// sqlite requires explicit check!
@Check(`typeof(duration) = "integer"`)
export class Task extends AbstractTask {
  @Column("int")
  duration: number;

  @Column({ type: "boolean", default: 0 })
  isFave: boolean;

  @ManyToOne(
    type => Categories,
    category => category.tasks
  )
  category: Categories;

  @ManyToOne(
    type => User,
    user => user.tasks,
    { nullable: false, onDelete: "CASCADE", onUpdate: "RESTRICT" }
  )
  user: User;
}
