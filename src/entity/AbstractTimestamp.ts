import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export abstract class AbstractTimetamp {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
