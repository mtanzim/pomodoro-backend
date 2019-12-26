import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractTimetamp } from "./AbstractTimestamp";

@Entity()
export abstract class User extends AbstractTimetamp {
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
}
