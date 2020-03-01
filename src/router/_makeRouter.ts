import express, { Router } from "express";
import { GenericController } from "../controller/GenericController";
import { IAuthRequest } from "./IAuthRequest";

export function _makeGenericRouter<Model, IPostBody, IPatchBody>(
  controller: GenericController<Model>
): Router {
  const router = express.Router();
  router
    .post("/", async function(req: IAuthRequest, res, next) {
      try {
        const newModel = await controller.create<IPostBody>(
          req?.user?.userId,
          req.body
        );
        return res.json(newModel);
      } catch (err) {
        return next(err);
      }
    })
    .get("/", async function(req: IAuthRequest, res, next) {
      try {
        let allModels = await controller.getAll(req?.user?.userId);
        return res.json(allModels);
      } catch (err) {
        return next(err);
      }
    })
    .get("/:id", async function(req: IAuthRequest, res, next) {
      try {
        const Model = await controller.get(
          req?.user?.userId,
          Number(req.params.id)
        );
        return res.json(Model);
      } catch (err) {
        return next(err);
      }
    })
    .delete("/:id", async function(req: IAuthRequest, res, next) {
      try {
        await controller.delete(req?.user?.userId, req.params.id);
        return res.send(
          `Deleted Model:${req.params.id} for User: ${req?.user?.userId}`
        );
      } catch (err) {
        return next(err);
      }
    })
    .patch("/:id", async function(req: IAuthRequest, res, next) {
      const fields: IPatchBody = req.body;
      try {
        let Model = await controller.update<IPatchBody>(
          req?.user?.userId,
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
