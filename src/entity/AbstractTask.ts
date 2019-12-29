import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractTimetamp } from "./AbstractTimestamp";

@Entity()
export abstract class AbstractTask extends AbstractTimetamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50 })
  name: string;
}
