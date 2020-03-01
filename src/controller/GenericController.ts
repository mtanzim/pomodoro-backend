import { getConnection, getRepository } from "typeorm";
import { Categories } from "../entity/Categories";
import { User } from "../entity/User";

// https://stackoverflow.com/questions/41017287/cannot-use-new-with-expression-typescript
export interface Constructable<T> {
  new (): T;
}

export interface IWithRelations {
  id: number | string;
  user: User;
  category?: Categories;
}

export class GenericController<Model> {
  constructor(
    protected _model: Constructable<Model & IWithRelations>,
    protected _modelAlias: string
  ) {}

  async create<PostI>(
    userId: number | string,
    fields: PostI
  ): Promise<Model & IWithRelations> {
    const userRepo = getRepository(User);
    let newItem = new this._model();
    Object.assign(newItem, fields);
    newItem.user = await userRepo.findOneOrFail(userId);
    await getConnection().manager.save(newItem);
    return await this.get(userId, newItem.id);
  }
  async getAll(userId: number | string): Promise<Model[]> {
    const repo = getRepository(this._model);

    let items = await repo
      .createQueryBuilder(this._modelAlias)
      .innerJoin(`${this._modelAlias}.user`, "user")
      .where("user.id = :userId", { userId })
      .getMany();
    return items;
  }
  async get(
    userId: number | string,
    id: number | string
  ): Promise<Model & IWithRelations> {
    const repo = await getRepository(this._model);

    let items = await repo
      .createQueryBuilder(this._modelAlias)
      .innerJoin(`${this._modelAlias}.user`, "user")
      .where("user.id = :userId", { userId })
      .andWhere(`${this._modelAlias}.id = :id`, { id })
      .getOne();
    return items;
  }
  async delete(userId: number | string, id: number | string): Promise<void> {
    const repo = getRepository(this._model);
    const item = await this.get(userId, id);
    await repo.remove(item);
    return;
  }
  async update<PatchI>(
    userId: number | string,
    id: number | string,
    fields: PatchI
  ): Promise<Model & IWithRelations> {
    const repo = getRepository(this._model);
    const item = await this.get(userId, id);
    Object.assign(item, fields);
    await repo.save(item);
    return await this.get(userId, id);
  }
}
