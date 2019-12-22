import { Task } from "../entity/Task";
import { FaveTask } from "../entity/FaveTask";
import { getRepository, EntitySchema } from "typeorm";

// TODO: fix types
export class TaskController {
  model: any;
  constructor(_model: any) {
    this.model = _model;
  }

  async create(taskFields: any): Promise<Task | FaveTask> {
    const taskRepo = getRepository(this.model);
    let newTask = new this.model();
    Object.assign(newTask, taskFields);
    await taskRepo.save(newTask);
    return newTask;
  }
  async getAll(): Promise<any> {
    const taskRepo = getRepository(this.model);
    let tasks = await taskRepo.find();
    return tasks;

  }
}
