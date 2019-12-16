import bodyParser from "body-parser";
import express from "express";
import * as path from "path";
import "reflect-metadata";
import { ConnectionOptions, createConnection } from "typeorm";
import { Task } from "./entity/Task";

const root: string = path.resolve(__dirname, "..");
const app = express();
app.use(bodyParser.json());

const options: ConnectionOptions = {
  type: "sqlite",
  database: `${root}/data/pomodoro.sqlite`,
  entities: [Task],
  logging: true,
  synchronize: true
};

interface ITaskBody {
  userId: number;
  name: string;
  category: string;
  duration: number;
}

createConnection(options)
  .then(async connection => {
    app.get("/", function(_req, res) {
      res.send("Hello World again!");
    });
    app.post("/api/tasks/", async function(req, res, next) {
      let newTask = new Task();
      const { ...taskFields }: ITaskBody = req.body;
      Object.assign(newTask, taskFields);
      try {
        await connection.manager.save(newTask);
      } catch (err) {
        return next(err);
      }
      res.send("saved new task");
    });
    app.get("/api/tasks/", async function(_req, res, next) {
      try {
        let savedPhotos = await connection.manager.find(Task);
        res.send(savedPhotos);
      } catch (err) {
        return next(err);
      }
    });

    app.listen(3000, function() {
      console.log("Example app listening on port 3000!");
    });
  })
  .catch(error => console.log(error));
