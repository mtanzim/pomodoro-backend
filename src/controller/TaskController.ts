import { getConnection, getRepository, MoreThanOrEqual } from "typeorm";
import { Categories } from "../entity/Categories";
import { User } from "../entity/User";
import {
  GenericController,
  IWithRelations,
  Constructable,
} from "./GenericController";
import { Task } from "../entity/Task";
import { FaveTask } from "../entity/FaveTask";

interface IWithCategoryId {
  categoryId?: number | string;
}

export class TaskController<Model> extends GenericController<Model> {
  constructor(
    _model: Constructable<Model & IWithRelations>,
    _modelAlias: string
  ) {
    super(_model, _modelAlias);
  }
  async create<PostI>(
    userId: number | string,
    fields: PostI & IWithCategoryId
  ): Promise<Model & IWithRelations> {
    const userRepo = getRepository(User);
    let newItem = new this._model();
    Object.assign(newItem, fields);
    newItem.user = await userRepo.findOneOrFail(userId);
    const categoryRepo = getRepository(Categories);
    if (fields.categoryId) {
      newItem.category = await categoryRepo.findOneOrFail(fields.categoryId);
    }
    await getConnection().manager.save(newItem);
    return this.get(userId, newItem.id);
  }
  async getAll(userId: number | string): Promise<Model[]> {
    const repo = await getRepository(this._model);
    let items = await repo
      .createQueryBuilder(this._modelAlias)
      .innerJoin(`${this._modelAlias}.user`, "user")
      .leftJoinAndSelect(`${this._modelAlias}.category`, "categories")
      .where("user.id = :userId", { userId })
      .getMany();
    return items;
  }

  async getTodayTasks(userId: number | string): Promise<Task[]> {
    if (this._model instanceof FaveTask) {
      throw new Error("Cannot use this method with FaveTask");
    }
    const repo = await getRepository(Task);
    let items = await repo
      .createQueryBuilder(this._modelAlias)
      .innerJoin(`${this._modelAlias}.user`, "user")
      .leftJoinAndSelect(`${this._modelAlias}.category`, "categories")
      .where("user.id = :userId", { userId })
      .andWhere("task.created >= curdate()")
      .take(50)
      .orderBy("task.created", "DESC")
      .getMany();
    return items;
  }
  async get(
    userId: number | string,
    id: number | string
  ): Promise<Model & IWithRelations> {
    const repo = await getRepository(this._model);
    const items = repo
      .createQueryBuilder(this._modelAlias)
      .innerJoin(`${this._modelAlias}.user`, "user")
      .leftJoinAndSelect(`${this._modelAlias}.category`, "categories")
      .where("user.id = :userId", { userId })
      .andWhere(`${this._modelAlias}.id = :id`, { id })
      .getOne();
    return items;
  }
}
