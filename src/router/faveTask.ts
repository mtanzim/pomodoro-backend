import express from "express";
import { FaveTask } from "../entity/FaveTask";
import { GenericController } from "../controller/GenericController";

const router = express.Router();

export interface ITaskBody {
  userId: number;
  name: string;
  categoryId: number;
}
interface ITaskBodyPatch {
  name?: string;
  categoryId?: number;
}

const taskController = new GenericController<FaveTask, ITaskBody, ITaskBodyPatch>(
  FaveTask
);

router
  .post("/", async function(req, res, next) {
    const { ...taskFields }: ITaskBody = req.body;
    try {
      const newTask = await taskController.create(taskFields);
      return res.json(newTask);
    } catch (err) {
      return next(err);
    }
  })
  .get("/:userId", async function(req, res, next) {
    try {
      let allTasks = await taskController.getAll(req.params.userId);
      return res.json(allTasks);
    } catch (err) {
      return next(err);
    }
  })
  .get("/:userId/:id", async function(req, res, next) {
    try {
      const task = await taskController.get(req.params.userId, req.params.id);
      return res.json(task);
    } catch (err) {
      return next(err);
    }
  })
  .delete("/:userId/:id", async function(req, res, next) {
    try {
      await taskController.delete(req.params.userId, req.params.id);
      return res.send(`Deleted task:${req.params.id}`);
    } catch (err) {
      return next(err);
    }
  })
  .patch("/:userId/:id", async function(req, res, next) {
    // cut out userId field
    const { userId, ...rest } = req.body;
    const taskFields: ITaskBodyPatch = rest;
    try {
      let task = await taskController.update(
        req.params.userId,
        req.params.id,
        taskFields
      );
      return res.json(task);
    } catch (err) {
      return next(err);
    }
  });

export default router;
