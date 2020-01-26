import { getRepository, getConnection } from "typeorm";
import { User } from "../entity/User";
import { Categories } from "../entity/Categories";

// https://stackoverflow.com/questions/41017287/cannot-use-new-with-expression-typescript
export interface Constructable<T> {
  new (): T;
}

// TODO: add relations with categories
// TODO: ensure proper distinction b/w categories and tasks
export class GenericController<Model, PostI, PatchI> {
  constructor(
    private _model: Constructable<Model>,
    private modelAlias: string
  ) {}

  async create(userId: number | string, fields: PostI): Promise<Model> {
    const userRepo = getRepository(User);
    let newItem: Model = new this._model();
    Object.assign(newItem, fields);
    newItem.user = await userRepo.findOneOrFail(userId);
    if (fields.categoryId) {
      const categoryRepo = getRepository(Categories);
      newItem.category = await categoryRepo.findOneOrFail(fields.categoryId);
    }
    await getConnection().manager.save(newItem);
    return await this.get(userId, newItem.id);
  }
  async getAll(userId: number | string): Promise<Model[]> {
    const items = await getRepository(this._model)
      .createQueryBuilder(this.modelAlias)
      .innerJoin(`${this.modelAlias}.user`, "user")
      .where("user.id = :userId", { userId })
      .getMany();
    return items;
  }
  async get(userId: number | string, id: number | string): Promise<Model> {
    const items = await getRepository(this._model)
      .createQueryBuilder(this.modelAlias)
      .innerJoin(`${this.modelAlias}.user`, "user")
      .where("user.id = :userId", { userId })
      .andWhere(`${this.modelAlias}.id = :id`, { id })
      .getOne();
    return items;
  }
  async delete(userId: number | string, id: number | string): Promise<void> {
    const repo = getRepository(this._model);
    const item = await this.get(userId, id);
    await repo.remove(item);
    return;
  }
  async update(
    userId: number | string,
    id: number | string,
    fields: PatchI
  ): Promise<Model> {
    const repo = getRepository(this._model);
    const item = await this.get(userId, id);
    Object.assign(item, fields);
    await repo.save(item);
    return await this.get(userId, id);
  }
}
