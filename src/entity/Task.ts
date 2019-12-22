import { Column, Entity, PrimaryGeneratedColumn, Check } from "typeorm";
import { AbstractTask } from "./AbstractTask";

@Entity()
// sqlite requires explicit check!
@Check(`typeof(duration) = "integer"`)
export class Task extends AbstractTask {
  @Column("int")
  duration: number;
}
