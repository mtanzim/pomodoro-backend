import { Column, Entity, PrimaryGeneratedColumn, Check, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
// sqlite requires explicit check!
@Check(`typeof(duration) = "integer"`)
export class FaveTask {
  @PrimaryGeneratedColumn()
  id: number;

  // add foreign key properties later
  @Column("int")
  userId: number;

  @Column("varchar", { length: 50 })
  name: string;

  @Column("int")
  category_id: Number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

}
