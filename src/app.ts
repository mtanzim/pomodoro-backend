require("dotenv").config();

import bodyParser from "body-parser";
import express, { ErrorRequestHandler } from "express";
import "reflect-metadata";
import { ConnectionOptions, createConnection } from "typeorm";
import { Categories } from "./entity/Categories";
import { FaveTask } from "./entity/FaveTask";
import { Task } from "./entity/Task";
import { User } from "./entity/User";
import catRouter from "./router/categories";
import faveTaskRouter from "./router/faveTask";
import taskRouter from "./router/tasks";
import useRouter from "./router/users";
import jwt from "express-jwt";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  jwt({ secret: process.env.JWT_SECRET }).unless({
    path: ["/api/users/auth/register", "/api/users/auth/login"]
  })
);

const options: ConnectionOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  database: "pomodoro-backend",
  entities: [User, Categories, Task, FaveTask],
  logging: true,
  synchronize: true
};

const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
  console.log(err);
  return res.status(500).json(err.message);
};

createConnection(options)
  .then(async _connection => {
    app.get("/health-check", function(_req, res) {
      res.send("Hello World!");
    });
    app.use("/api/tasks/", taskRouter);
    app.use("/api/fave/", faveTaskRouter);
    app.use("/api/cat/", catRouter);
    app.use("/api/users/", useRouter);
    app.use(handleError);
    app.listen(3000, function() {
      console.log("Example app listening on port 3000!");
    });
  })
  .catch(error => console.log(error));
