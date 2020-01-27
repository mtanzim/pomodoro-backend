import { Task } from "../entity/Task";
import { TaskController } from "../controller/TaskController";
import { _makeGenericRouter } from "./_makeRouter";

type ITaskBodyPost = {
  name: string;
  categoryId?: number;
  duration: number;
};
type ITaskBodyPatch = {
  name?: string;
  categoryId?: number;
  duration?: number;
};

const taskController = new TaskController<Task>(Task, "task");

export default _makeGenericRouter<Task, ITaskBodyPost, ITaskBodyPatch>(
  taskController
);
