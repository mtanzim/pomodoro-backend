import express from "express";
import { FaveTask } from "../entity/FaveTask";
import { TaskController } from "../controller/TaskController";
import { _makeGenericRouter } from "./_makeRouter";

interface ITaskBodyPost {
  name: string;
  categoryId?: number;
}
interface ITaskBodyPatch {
  name?: string;
  categoryId?: number;
}

const taskController = new TaskController<
  FaveTask
>(FaveTask, "fave_task");
export default _makeGenericRouter<FaveTask, ITaskBodyPost, ITaskBodyPatch>(
  taskController
);
