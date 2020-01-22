import { Task } from "../entity/Task";
import { GenericController, WithId } from "../controller/GenericController";
import { _makeGenericRouter } from "./_makeRouter";

export interface ITaskBody extends WithId {
  name: string;
  categoryId: number;
  duration: number;
}
interface ITaskBodyPatch extends WithId {
  name?: string;
  categoryId?: number;
  duration?: number;
}

const taskController = new GenericController<Task, ITaskBody, ITaskBodyPatch>(
  Task
);

export default _makeGenericRouter<Task, ITaskBody, ITaskBodyPatch>(taskController);
