import express from "express";
import { FaveTask } from "../entity/FaveTask";
import { GenericController, WithId } from "../controller/GenericController";
import { _makeGenericRouter } from "./_makeRouter";

export interface ITaskBody extends WithId{
  name: string;
  categoryId: number;
}
interface ITaskBodyPatch extends WithId {
  name?: string;
  categoryId?: number;
}

const taskController = new GenericController<
  FaveTask,
  ITaskBody,
  ITaskBodyPatch
>(FaveTask);
export default _makeGenericRouter<FaveTask, ITaskBody, ITaskBodyPatch>(
  taskController
);
