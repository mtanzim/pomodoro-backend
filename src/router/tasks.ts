import { Task } from "../entity/Task";
import { TaskController } from "../controller/TaskController";
import { _makeGenericRouter } from "./_makeRouter";
import { IAuthRequest } from "./IAuthRequest";

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

const taskRouter = _makeGenericRouter<Task, ITaskBodyPost, ITaskBodyPatch>(
  taskController
);

taskRouter.get("/limited/today", async function (req: IAuthRequest, res, next) {
  try {
    const result = await taskController.getTodayTasks(req?.user?.userId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

export default taskRouter;
