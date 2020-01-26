import { Task } from "../entity/Task";
import { GenericController } from "../controller/GenericController";
import { _makeGenericRouter } from "./_makeRouter";

export interface ITaskBody {
  id: number;
  userId: number;
  name: string;
  categoryId: number;
  duration: number;
}
interface ITaskBodyPatch {
  id: number;
  userId: number;
  name?: string;
  categoryId?: number;
  duration?: number;
}

const taskController = new GenericController<Task, ITaskBody, ITaskBodyPatch>(
  Task, "task"
);

export default _makeGenericRouter<Task, ITaskBody, ITaskBodyPatch>(taskController);
