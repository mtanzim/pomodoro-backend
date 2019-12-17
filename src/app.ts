import bodyParser from "body-parser";
import express, {ErrorRequestHandler} from "express";
import * as path from "path";
import "reflect-metadata";
import { ConnectionOptions, createConnection } from "typeorm";
import { Task } from "./entity/Task";
import taskRouter from "./router/tasks";


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

const handleError:ErrorRequestHandler = (err, _req,res, _next) => {
  // console.log(err);
  return res.status(500).send(err.message);
}

createConnection(options)
  .then(async _connection => {
    app.get("/health-check", function(_req, res) {
      res.send("Hello World!");
    });
    app.use("/api/tasks", taskRouter);
    app.use(handleError);
    app.listen(3000, function() {
      console.log("Example app listening on port 3000!");
    });
  })
  .catch(error => console.log(error));
