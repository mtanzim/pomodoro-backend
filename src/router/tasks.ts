import express from "express";
import { getRepository } from "typeorm";
import { Task } from "../entity/Task";

const router = express.Router();

interface ITaskBody {
  userId: number;
  name: string;
  category: string;
  duration: number;
}
interface ITaskBodyPatch {
  userId?: number;
  name?: string;
  category?: string;
  duration?: number;
}

router
  .post("/", async function(req, res, next) {
    const taskRepo = getRepository(Task);
    let newTask = new Task();
    const { ...taskFields }: ITaskBody = req.body;
    Object.assign(newTask, taskFields);
    try {
      await taskRepo.save(newTask);
    } catch (err) {
      return next(err);
    }
    return res.json(newTask);
  })
  .get("/", async function(_req, res, next) {
    const taskRepo = getRepository(Task);
    try {
      let allTasks = await taskRepo.find();
      return res.json(allTasks);
    } catch (err) {
      return next(err);
    }
  })
  .get("/:id", async function(req, res, next) {
    const taskRepo = getRepository(Task);
    try {
      let task = await taskRepo.findOne(req.params.id);
      if (task === undefined) {
        throw new Error("Task not found");
      }
      return res.json(task);
    } catch (err) {
      return next(err);
    }
  })
  .delete("/:id", async function(req, res, next) {
    const taskRepo = getRepository(Task);
    try {
      let task = await taskRepo.findOne(req.params.id);
      await taskRepo.remove(task);
      return res.send(`Deleted task:${req.params.id}`);
    } catch (err) {
      return next(err);
    }
  })
  .patch("/:id", async function(req, res, next) {
    const taskRepo = getRepository(Task);
    const { ...taskFields }: ITaskBodyPatch = req.body;
    try {
      let task = await taskRepo.findOne(req.params.id);
      if (task === undefined) {
        throw new Error("Task not found");
      }
      Object.assign(task, taskFields);
      await taskRepo.save(task);
      return res.json(task);
    } catch (err) {
      return next(err);
    }
  });

export default router;
