import express, { Router } from "express";
import { GenericController } from "../controller/GenericController";

export function _makeGenericRouter<Model, IPostBody, IPatchBody>(
  controller: GenericController<Model, IPostBody, IPatchBody>
): Router {
  const router = express.Router();
  router
    .post("/", async function(req, res, next) {
      const { ...fields }: IPostBody = req.body;
      try {
        const newModel = await controller.create(fields);
        return res.json(newModel);
      } catch (err) {
        return next(err);
      }
    })
    .get("/:userId", async function(req, res, next) {
      try {
        let allModels = await controller.getAll(req.params.userId);
        return res.json(allModels);
      } catch (err) {
        return next(err);
      }
    })
    .get("/:userId/:id", async function(req, res, next) {
      try {
        const Model = await controller.get(req.params.userId, req.params.id);
        return res.json(Model);
      } catch (err) {
        return next(err);
      }
    })
    .delete("/:userId/:id", async function(req, res, next) {
      try {
        await controller.delete(req.params.userId, req.params.id);
        return res.send(`Deleted Model:${req.params.id} for User: ${req.params.userId}`);
      } catch (err) {
        return next(err);
      }
    })
    .patch("/:userId/:id", async function(req, res, next) {
      // cut out userId field
      const { userId, ...rest } = req.body;
      const fields: IPatchBody = rest;
      try {
        let Model = await controller.update(
          req.params.userId,
          req.params.id,
          fields
        );
        return res.json(Model);
      } catch (err) {
        return next(err);
      }
    });
  return router;
}
