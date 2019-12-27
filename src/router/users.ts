import express from "express";
import {
  IUserBody,
  IUserBodyPatch,
  UserController
} from "../controller/UserController";

const controller = new UserController();
const router = express.Router();
router
  .get("/:userId", async function(req, res, next) {
    try {
      const user = await controller.get(req.params.userId);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  })
  .post("/login", async function(req, res, next) {
    const { username, password }: IUserBody = req.body;
    try {
      const loggedIn = await controller.login({ username, password });
      return res.json(loggedIn);
    } catch (err) {
      return next(err);
    }
  })
  .post("/", async function(req, res, next) {
    const { ...fields }: IUserBody = req.body;
    try {
      const newUser = await controller.create(fields);
      return res.json(newUser);
    } catch (err) {
      return next(err);
    }
  })
  .patch("/:userId", async function(req, res, next) {
    const {
      password,
      verifyPassword,
      name,
      email,
      ...rest
    }: IUserBodyPatch = req.body;
    try {
      const newUser = await controller.update(req.params.userId, {
        password,
        verifyPassword,
        name,
        email
      });
      return res.json(newUser);
    } catch (err) {
      return next(err);
    }
  });
export default router;
