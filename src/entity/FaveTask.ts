import { Entity } from "typeorm";
import { AbstractTask } from "./AbstractTask";

@Entity()
export class FaveTask extends AbstractTask {}
