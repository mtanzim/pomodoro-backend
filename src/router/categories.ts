import express from "express";
import { Categories } from "../entity/Categories";
import { GenericController } from "../controller/GenericController";

const router = express.Router();

export interface ICatBody {
  userId: number;
  name: string;
}
interface ICatBodyPatch {
  name?: string;
}

const catController = new GenericController<
  Categories,
  ICatBody,
  ICatBodyPatch
>(Categories);

router
  .post("/", async function(req, res, next) {
    const { ...catFields }: ICatBody = req.body;
    try {
      const newCat = await catController.create(catFields);
      return res.json(newCat);
    } catch (err) {
      return next(err);
    }
  })
  .get("/:userId", async function(req, res, next) {
    try {
      let allCats = await catController.getAll(req.params.userId);
      return res.json(allCats);
    } catch (err) {
      return next(err);
    }
  })
  .get("/:userId/:id", async function(req, res, next) {
    try {
      const cat = await catController.get(req.params.userId, req.params.id);
      return res.json(cat);
    } catch (err) {
      return next(err);
    }
  })
  .delete("/:userId/:id", async function(req, res, next) {
    try {
      await catController.delete(req.params.userId, req.params.id);
      return res.send(`Deleted task:${req.params.id}`);
    } catch (err) {
      return next(err);
    }
  })
  .patch("/:userId/:id", async function(req, res, next) {
    // cut out userId field
    const { userId, ...rest } = req.body;
    const catFields: ICatBodyPatch = rest;
    try {
      let task = await catController.update(
        req.params.userId,
        req.params.id,
        catFields
      );
      return res.json(task);
    } catch (err) {
      return next(err);
    }
  });

export default router;
