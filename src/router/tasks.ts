import { Task } from "../entity/Task";
import { GenericController } from "../controller/GenericController";
import { _makeGenericRouter } from "./_makeRouter";

export interface ITaskBody {
  userId: number;
  name: string;
  categoryId: number;
  duration: number;
}
interface ITaskBodyPatch {
  name?: string;
  categoryId?: number;
  duration?: number;
}

const taskController = new GenericController<Task, ITaskBody, ITaskBodyPatch>(
  Task
);

export default _makeGenericRouter<Task, ITaskBody, ITaskBodyPatch>(taskController);
