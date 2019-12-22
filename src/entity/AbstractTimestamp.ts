import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
// sqlite requires explicit check!
export abstract class AbstractTimetamp {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
