import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractTimetamp } from "./AbstractTimestamp";

@Entity()
// sqlite requires explicit check!
export abstract class AbstractTask extends AbstractTimetamp {
  @PrimaryGeneratedColumn()
  id: number;

  // add foreign key properties later
  @Column("int")
  userId: number;

  @Column("varchar", { length: 50 })
  name: string;

  @Column("int")
  categoryId: Number;
}
