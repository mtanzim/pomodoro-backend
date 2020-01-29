import express from "express";
import {
  IUserBody,
  IUserBodyPatch,
  UserController
} from "../controller/UserController";
import { IAuthRequest } from "./IAuthRequest";

const controller = new UserController();
const router = express.Router();
router
  .get("/", async function(req: IAuthRequest, res, next) {
    try {
      const {
        created,
        updated,
        password,
        ...visibleUser
      } = await controller.get(req?.user?.userId);
      return res.json(visibleUser);
    } catch (err) {
      return next(err);
    }
  })
  .post("/auth/login", async function(req, res, next) {
    const { username, password }: IUserBody = req.body;
    try {
      const { auth, token } = await controller.login({ username, password });
      if (auth) return res.json({ token });
    } catch (err) {
      return next(err);
    }
    return res.status(401).send("Unauthorized");
  })
  .post("/auth/register", async function(req, res, next) {
    const { ...fields }: IUserBody = req.body;
    try {
      if (fields.password !== fields.verifyPassword) {
        throw new Error("Passwords do not match");
      }
      const newUser = await controller.create(fields);
      const { username } = newUser;
      return res.json({ username });
    } catch (err) {
      return next(err);
    }
  })
  .patch("/", async function(req: IAuthRequest, res, next) {
    const {
      password,
      verifyPassword,
      name,
      email,
      ...rest
    }: IUserBodyPatch = req.body;
    try {
      await controller.update(req?.user?.userId, {
        password,
        verifyPassword,
        name,
        email
      });
      const updatedUser = await controller.get(req?.user?.userId);
      const {
        created,
        updated,
        password: hiddenPass,
        ...visibleUser
      } = updatedUser;
      return res.json(visibleUser);
    } catch (err) {
      return next(err);
    }
  });
export default router;
