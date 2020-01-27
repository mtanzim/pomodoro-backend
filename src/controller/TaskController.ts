import { getConnection, getRepository } from "typeorm";
import { Categories } from "../entity/Categories";
import { User } from "../entity/User";
import { Constructable } from "./GenericController";
import { GenericController } from "./GenericController";

export class TaskController<Model, PostI, PatchI> extends GenericController<
  Model,
  PostI,
  PatchI
> {
  constructor(
    _model: Constructable<Model>,
    _modelAlias: string
  ) {
    super(_model, _modelAlias);
  }
  async create(userId: number | string, fields: PostI): Promise<Model> {
    const userRepo = getRepository(User);
    let newItem: Model = new this._model();
    Object.assign(newItem, fields);
    newItem.user = await userRepo.findOneOrFail(userId);
    const categoryRepo = getRepository(Categories);
    if (fields.categoryId) {
      newItem.category = await categoryRepo.findOneOrFail(fields.categoryId);
    }
    await getConnection().manager.save(newItem);
    return await this.get(userId, newItem.id);
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
  async get(userId: number | string, id: number | string): Promise<Model> {
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
