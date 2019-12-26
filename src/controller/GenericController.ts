import { getRepository } from "typeorm";

// https://stackoverflow.com/questions/41017287/cannot-use-new-with-expression-typescript
export interface Constructable<T> {
  new (): T;
}

export interface WithId {
  id: number;
  userId: number;
}

export class GenericController<Model, PostI extends WithId, PatchI extends WithId> {
  constructor(private _model: Constructable<Model>) {}

  async create(fields: PostI): Promise<Model> {
    const repo = getRepository(this._model);
    let newItem: Model = new this._model();
    Object.assign(newItem, fields);
    const saved = await repo.save(newItem);
    return saved;
  }
  async getAll(userId: number | string): Promise<Model[]> {
    const repo = getRepository(this._model);
    let items = await repo.find({ where: { userId } });
    return items;
  }
  async get(userId: number | string, id: number | string): Promise<Model> {
    const repo = getRepository(this._model);
    let item = await repo.findOne({ where: { id, userId } });
    if (item === undefined) {
      throw new Error("Item not found");
    }
    return item;
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
    return this.get(userId, id);
  }
}
