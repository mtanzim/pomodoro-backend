import { Column, Entity, PrimaryGeneratedColumn, Check, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
// sqlite requires explicit check!
@Check(`typeof(duration) = "integer"`)
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  // add foreign key properties later
  @Column("int")
  userId: number;

  @Column("varchar", { length: 50 })
  name: string;

}
