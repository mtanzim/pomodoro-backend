import express from "express";
import { Task } from "../entity/Task";
import { GenericController } from "../controller/GenericController";

const router = express.Router();

export interface ITaskBody {
  userId: number;
  name: string;
  categoryId: number;
  duration: number;
}
interface ITaskBodyPatch {
  userId?: number;
  name?: string;
  categoryId?: number;
  duration?: number;
}

const taskController = new GenericController<Task, ITaskBody, ITaskBodyPatch>(
  Task
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
  .get("/", async function(_req, res, next) {
    try {
      let allTasks = await taskController.getAll();
      return res.json(allTasks);
    } catch (err) {
      return next(err);
    }
  })
  .get("/:id", async function(req, res, next) {
    try {
      const task = await taskController.get(req.params.id);
      return res.json(task);
    } catch (err) {
      return next(err);
    }
  })
  .delete("/:id", async function(req, res, next) {
    try {
      await taskController.delete(req.params.id);
      return res.send(`Deleted task:${req.params.id}`);
    } catch (err) {
      return next(err);
    }
  })
  .patch("/:id", async function(req, res, next) {
    const { ...taskFields }: ITaskBodyPatch = req.body;
    try {
      let task = await taskController.update(req.params.id, taskFields);
      return res.json(task);
    } catch (err) {
      return next(err);
    }
  });

export default router;
