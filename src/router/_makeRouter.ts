import express, {Router} from "express";
import { GenericController, WithId } from "../controller/GenericController";
import { IAuthRequest } from "./IAuthRequest";

export function _makeGenericRouter<Model, IPostBody, IPatchBody>(
  controller: GenericController<Model, IPostBody, IPatchBody>
): Router {
  const router = express.Router();
  router
    .post("/", async function(req:express.Request & {user:any}, res, next) {
      const { ...fields }: IPostBody = req.body;
      try {
        const newModel = await controller.create(fields);
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
        const Model = await controller.get(req?.user?.userId, req.params.id);
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
      // cut out userId field
      const { userId, ...rest } = req.body;
      const fields: IPatchBody = rest;
      try {
        let Model = await controller.update(
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
