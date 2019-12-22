import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique
} from "typeorm";
import { AbstractTimetamp } from "./AbstractTimestamp";

@Entity()
@Unique(["userId", "name"])
export class Categories extends AbstractTimetamp {
  @PrimaryGeneratedColumn()
  id: number;

  // add foreign key properties later
  @Column("int")
  userId: number;

  @Column("varchar", { length: 50 })
  name: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
